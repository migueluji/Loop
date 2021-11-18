class Engine {

    constructor(gameModel) {
        this.ffps = 60;
        this.dt = 1000 / this.ffps;
        this.currentTime = this.accumulator = this.t = this.frameTime = 0.0;
        this.debug = gameModel.debug;
        // Create data structures
        this.gameObjects = new Map();
        this.gameProperties = gameModel.allProperties;
        this.scope = new Object({ "Game": this.gameProperties, "Engine": this });
        // Create engines
        console.log(this);
        this.render = new Render(this);
        this.input = new Input(this);
        this.logic = new Logic(this);
        this.physics = new Physics(this);
        this.aural = new Aural(this);
        // Create gameObjects
        var zIndex = 0;
        gameModel.sceneList[0].actorList.forEach(actor => {
            actor.zIndex = zIndex;
            var gameObject = new GameObject(this, actor);
            this.gameObjects.set(actor.name, gameObject); // gameObjets Map
            this.scope[actor.name] = gameObject; // gameObjects Scope
            zIndex++;
        });
        // Launch gameloop
        window.requestAnimationFrame(this.gameLoop.bind(this));
    };

    gameLoop(newTime) {
        window.requestAnimationFrame(this.gameLoop.bind(this));
        this.frameTime = newTime - this.currentTime;
        if (this.frameTime > 100) this.frameTime = 100;
        this.accumulator += this.frameTime;
        while (this.accumulator >= this.dt) {
            this.physics.fixedStep(this.dt);
            this.logic.fixedUpdate(this.dt, this.t, this.frameTime);
            this.aural.fixedPlay();
            this.t += this.dt;
            this.accumulator -= this.dt;
        }
        this.render.update(this.accumulator / this.dt);
        this.currentTime = newTime;
    }

    // engine commands
    spawn(gameObject, x, y, angle) {
        if (gameObject) { // spawn new gameObject if exists
            var spawnName = gameObject.name + Utils.id();
            var spawnObject = new GameObject(this, gameObject.actor, spawnName);
            spawnObject.rigidbody.setUserData({ name: spawnName, tags: spawnObject.actor.tags });
            spawnObject = Object.assign(spawnObject, { "x": x, "y": y, "angle": angle, "sleeping": false });
            this.scope[spawnObject.name] = spawnObject;
            this.gameObjects.set(spawnObject.name, spawnObject);
        }
    }

    delete(gameObject) {
        gameObject.dead = true; // mark to be eliminated
    }

    animate(gameObject, id, animation, fps) {
        var secuence = animation.split(",");
        var dtAnim = 1000 / fps;
        if (gameObject.timer[id].time + this.dt < 1000) gameObject.timer[id].time += this.dt;
        else gameObject.timer[id].time = 0;
        var frame = gameObject.timer[id].time / dtAnim;
        gameObject.image = secuence[Math.floor(frame % secuence.length)];
    }

    play(gameObject, soundID) {
        gameObject.playList[soundID].play();
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

    timer(gameObject, id, expression) {
        var lostFlow = ((gameObject.timer[id].previousTime - gameObject.timer[id].time) > 0);
        var secReached = (gameObject.timer[id].time >= gameObject.timer[id].seconds * 1000);
        if (lostFlow || secReached) {
            gameObject.timer[id] = { time: 0.0, previousTime: 0.0, seconds: math.eval(expression) };
            return (true);
        }
        else {
            gameObject.timer[id].time += this.dt;
            gameObject.timer[id].previousTime = gameObject.timer[id].time;
            return (false);
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
        return (Input.keyList[key][mode]);
    }

    touch(mode, onActor, gameObject) {
        var value;
        if (onActor) {
            value = Input.gameObjects[gameObject.name][mode];
            Input.gameObjects[gameObject.name].tap = false;
        }
        else {
            value = Input.pointer[mode];
            Input.pointer.tap = false;

        }
        return (value);
    }
}
