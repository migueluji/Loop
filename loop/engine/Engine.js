class Engine {

    constructor(gameModel) {
        this.gameModel = gameModel;
        this.ffps = 100;
        this.deltaTime = 1 / this.ffps;
        this.currentTime = this.accumulator = this.frameTime = this.time = 0.0;
        this.debug = gameModel.debug;
        // Start variables to pause the engine
        this.physicsOn = true;
        this.logicOn = true;
        this.objectSoundsOn = true;
        // Create a new object to acces by name to the scenes in the load and in the scope
        this.sceneList = new Object();
        gameModel.sceneList.forEach(scene => { this.sceneList[scene.name] = scene; });
        // Start the game execution properties
        this.gameLevel = new GameLevel(this);
        // Start audio engine
        this.aural = new Aural(gameModel);
        // Load currente scene
        this.loadScene(this.gameLevel.currentScene);
        // Launch gameloop
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop(newTime) {
        window.requestAnimationFrame(this.gameLoop.bind(this));
        this.frameTime = (newTime - this.currentTime) / 1000;
        if (this.frameTime > 0.1) this.frameTime = 0.1;
        this.accumulator += this.frameTime;
        while (this.accumulator >= this.deltaTime) {
            this.physics.fixedStep(this, this.deltaTime);
            this.logic.fixedUpdate(this, this.deltaTime);
            this.time += this.deltaTime;
            this.accumulator -= this.deltaTime;
        }
        this.aural.play(this);
        this.render.update(this, this.accumulator / this.deltaTime);
        this.currentTime = newTime;
    }

    loadScene(scene) {
        this.resume(); // Active the different engines
        // Create new data structures
        this.gameObjects = new Map();
        this.scope = new Object({ "Game": this.gameLevel, "Engine": this });
        // Init engines
        this.render = new Render(this.gameModel);
        this.logic = new Logic();
        this.input = new Input(this.gameModel, this.render.stage);
        this.physics = new Physics(this.gameModel, this.gameObjects);
        // Create gameObjects
        var zIndex = 0;
        this.sceneList[scene].actorList.forEach(actor => {
            actor.zIndex = zIndex;
            var gameObject = new GameObject(this, actor);
            this.gameObjects.set(actor.name, gameObject);
            this.scope[actor.name] = gameObject;
            zIndex++;
        });
        this.currentScene = scene;
        this.currentSceneNumber = this.gameModel.sceneList.indexOf(this.sceneList[scene]);
        this.changeScene = false;
    }

    // scene actions
    goTo(scene) { this.changeScene = true; this.goToScene = scene.name; }

    pause(physics, logic, sounds) {
        this.physicsOn = !physics; this.logicOn = !logic; this.objectSoundsOn = !sounds;
    }

    resume() {
        this.physicsOn = this.logicOn = this.objectSoundsOn = true;
    }

    // actions
    spawn(spawnerObject, gameObject, x, y, angle) {
        if (gameObject) { // spawn new gameObject if exists
            var spawnName = gameObject.name + Utils.id();
            gameObject.actor.sleeping = false; // to active the object
            var spawnObject = new GameObject(this, gameObject.actor, spawnName);
            spawnObject.rigidbody.setUserData({ name: spawnName, tags: spawnObject.actor.tags });
            console.log(spawnObject.angle);
            spawnObject = Object.assign(spawnObject, {
                "x": spawnerObject.x + x * Math.cos(Utils.radians(spawnerObject.angle)),
                "y": spawnerObject.y + y * Math.sin(Utils.radians(spawnerObject.angle)),
              //  "angle": spawnerObject.angle + gameObject.angle + angle,
            });
            spawnObject.angle= spawnerObject.angle  + angle ;
            console.log(spawnerObject.angle, gameObject.angle,angle,spawnObject.angle);
            this.scope[spawnObject.name] = spawnObject;
            this.gameObjects.set(spawnObject.name, spawnObject);
        }
    }

    delete(gameObject) { gameObject.dead = true; }// mark to be eliminated

    animate(gameObject, id, animation, fps) {
        var secuence = animation.split(",");
        var dtAnim = 1000 / fps;
        if (gameObject.timer[id].time + this.deltaTime < 1000) gameObject.timer[id].time += this.deltaTime;
        else gameObject.timer[id].time = 0;
        var frame = (gameObject.timer[id].time / dtAnim) * 1000;
        gameObject.image = secuence[Math.floor(frame % secuence.length)];
    }

    play(gameObject, sound) {
        var sound = new Sound(sound, { volume: gameObject.volume, loop: false });
        if (this.objectSoundsOn) sound.source.play(sound.id);
    }

    move(gameObject, speed, angle) {
        gameObject.x += speed * this.deltaTime * Math.cos(Utils.radians(angle));
        gameObject.y += speed * this.deltaTime * Math.sin(Utils.radians(angle));
    }

    moveTo(gameObject, speed, px, py) {
        var dist = Utils.getDistance({ x: gameObject.x, y: gameObject.y }, { x: px, y: py });
        gameObject.x = (dist > 1) ? gameObject.x + speed * this.deltaTime * (px - gameObject.x) / dist : px;
        gameObject.y = (dist > 1) ? gameObject.y + speed * this.deltaTime * (py - gameObject.y) / dist : py;
    }

    rotate(gameObject, speed, pivotX, pivotY) {
        var dist = Utils.getDistance({ x: pivotX, y: pivotY }, { x: gameObject.x, y: gameObject.y });
        gameObject.angle += speed * this.deltaTime;
        gameObject.x = pivotX + dist * Math.cos(Utils.radians(gameObject.angle));
        gameObject.y = pivotY + dist * Math.sin(Utils.radians(gameObject.angle));
    }

    rotateTo(gameObject, speed, x, y, pivotX, pivotY) {
        var dist = Utils.getDistance({ x: pivotX, y: pivotY }, { x: gameObject.x, y: gameObject.y });
        var d0 = { x: pivotX - gameObject.x, y: pivotY - gameObject.y };
        var angle0 = ((d0.x == 0) && (d0.y == 0)) ? Utils.radians(gameObject.angle) : Math.PI + Math.atan2(d0.y, d0.x); // angle between 0 and 2 PI
        var d1 = { x: pivotX - x, y: pivotY - y };
        var angle1 = Math.PI + Math.atan2(d1.y, d1.x); // angle between 0 and 2 PI
        var da = angle1 - angle0;
        da = (Math.abs(da) > Math.PI) ? (da < -Math.PI ? 2 * Math.PI + da : -2 * Math.PI + da) : da;
        gameObject.angle = (Utils.degrees(Math.abs(da)) > 0.5) ? gameObject.angle + speed * this.deltaTime : gameObject.angle;
        gameObject.x = pivotX + dist * Math.cos(Utils.radians(gameObject.angle));
        gameObject.y = pivotY + dist * Math.sin(Utils.radians(gameObject.angle));
    }

    push(gameObject, force, angle) {
        var forceX = force * Math.cos(angle * Math.PI / 180) * Physics.pixelsPerMeter;
        var forceY = force * Math.sin(angle * Math.PI / 180) * Physics.pixelsPerMeter;
        gameObject.rigidbody.applyForce(planck.Vec2(forceX, forceY), gameObject.rigidbody.getWorldCenter());
    }

    pushTo(gameObject, force, x, y) {
        this.push(gameObject, force, Math.atan2(y - gameObject.y, x - gameObject.x) * 180 / Math.PI);
    }

    torque(gameObject, angle) {
        gameObject.rigidbody.applyTorque(angle * 180 / Math.PI);
    }

    // conditions
    timer(gameObject, id, expression) {
        var lostFlow = ((gameObject.timer[id].previousTime - gameObject.timer[id].time) > 0);
        var secReached = (gameObject.timer[id].time >= gameObject.timer[id].seconds * 1000);
        if (lostFlow || secReached) {
            gameObject.timer[id] = { time: 0.0, previousTime: 0.0, seconds: math.eval(expression) };
            return true;
        }
        else {
            gameObject.timer[id].time += this.deltaTime;
            gameObject.timer[id].previousTime = gameObject.timer[id].time;
            return false;
        }
    }

    collision(gameObject, tags) {
        var tagsToCollide = tags.split(",");
        var value = true;
        tagsToCollide.forEach(tag => {
            value = (value && (gameObject.collision[tag].size > 0));
        })
        return value;
    }

    keyboard(key, mode) {
        var value = Input.keyList[key][mode]; // read key input
        if (Input.keyList[key].down) Input.keyList[key].down = false; // after reading the input value the key is reset
        return value;
    }

    touch(mode, onActor, gameObject) {
        var value;
        if (onActor) {
            value = Input.touchObjects[gameObject.name][mode];
            Input.touchObjects[gameObject.name].tap = false;
        }
        else {
            value = Input.pointer[mode];
            Input.pointer.tap = false;
        }
        return value;
    }
}
