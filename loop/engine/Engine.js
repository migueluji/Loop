class Engine {

    constructor(gameModel) {
        this.ffps = 60;
        this.dt = 1000 / this.ffps;
        this.currentTime = this.accumulator = this.t = this.frameTime = 0.0;
        this.debug = true;
        // Create data structures
        this.gameObjects = new Map();
        this.gameProperties = gameModel.allProperties;
        this.scope = new Object({ "Game": this.gameProperties, "Engine": this });
        // Create engines
        this.render = new Render(this);
        this.input = new Input(this);
        this.logic = new Logic(this);
        this.physics = new Physics(this);
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
            this.logic.fixedUpdate(this.dt,this.t,this.frameTime);
            this.t += this.dt;
            this.accumulator -= this.dt;
        }
        this.render.update(this.accumulator / this.dt);
        this.currentTime = newTime;
    }

    spawn(gameObject, x, y, angle) {
        var spawnName = gameObject.name + Utils.id();
        var spawnObject = new GameObject(this,this.gameObjects.get(gameObject.actor.name).actor, spawnName);
        spawnObject.rigidbody.setUserData({ name: spawnName, tags: spawnObject.actor.tags });
        spawnObject = Object.assign(spawnObject, { "x": x, "y": y, "angle": angle, "sleeping": false });
        // add spawnObject to data structures
        this.scope[spawnObject.name] = spawnObject;
        this.gameObjects.set(spawnObject.name, spawnObject);
    }

    delete(actorName) {
        this.render.stage.removeChild(this.gameObjects.get(actorName).container);
        this.physics.world.destroyBody(this.gameObjects.get(actorName).rigidbody);
        this.gameObjects.delete(actorName);
        delete this.scope[actorName];
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

    animate(gameObject, id, animation, fps) {
        var secuence = animation.split(",");
        var dtAnim = 1000 / fps;
        if (gameObject.timer[id].time + this.dt < 1000) gameObject.timer[id].time += this.dt;
        else gameObject.timer[id].time = 0;
        var frame = gameObject.timer[id].time / dtAnim;
        gameObject.image = secuence[Math.floor(frame % secuence.length)];
    }

    keyboard(key, mode) {
        var value = Input.keyList[key][mode];
        Input.keyList[key].down = false;
        Input.keyList[key].up = true;
        return (value);
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
