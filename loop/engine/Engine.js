class Engine {

    constructor(gameModel) {
        this.ffps = 60;
        //   this.fps = 60;
        this.dt = 1000 / this.ffps;
        this.currentTime = this.accumulator = this.t = this.frameTime = 0.0;
        // Create data structures
        this.gameObjects = new Map();
        this.gameProperties = gameModel.allProperties;
        this.scope = new Object({ "Game": this.gameProperties, "Engine": this });
        var zIndex = 0;
        gameModel.sceneList[0].actorList.forEach(actor => {
            actor.zIndex = zIndex;
            var gameObject = new GameObject(actor);
            this.gameObjects.set(actor.name, gameObject);
            this.scope[actor.name] = gameObject;
            zIndex++;
        });
        // Create engines
        this.render = new Render(this);
        this.input = new Input(this);
        this.logic = new Logic(this);
        this.physics = new Physics(this);
        // Launch gameloop
        window.requestAnimationFrame(this.gameLoop.bind(this));
        console.log(this.gameObjects, this.scope, this.render, this.input, this.logic, this.physics);
    };

    gameLoop(newTime) {
        window.requestAnimationFrame(this.gameLoop.bind(this));
        this.frameTime = newTime - this.currentTime;
        if (this.frameTime > 100) this.frameTime = 100;
        this.accumulator += this.frameTime;
        while (this.accumulator >= this.dt) {
            this.physics.fixedStep(this.dt);
            this.t += this.dt;
            this.accumulator -= this.dt;
        }
        this.logic.fixedUpdate(this.dt, this.t, this.frameTime);
        this.render.update(this.accumulator / this.dt);
        this.currentTime = newTime;
    }

    spawn(gameObject, x, y, angle) {
        var spawnName = gameObject.name + Utils.id();
        var spawnObject = new GameObject(this.gameObjects.get(gameObject.actor.name).actor, spawnName);
        spawnObject = Object.assign(spawnObject, { "x": x, "y": y, "angle": angle, "sleeping": false });
        // add spawnObject to data structures
        this.scope[spawnObject.name] = spawnObject;
        this.gameObjects.set(spawnObject.name, spawnObject);
        // add spawnObject to stage
        this.render.stage.addChild(spawnObject.container);
        // add spawnObject to physics world
        spawnObject.rigidbody = this.physics.world.createBody(spawnObject.body.bodyDef);
        spawnObject.rigidbody.setUserData({name:spawnName,tags:spawnObject.actor.tags});
        spawnObject.rigidbody.createFixture(spawnObject.body.fixtureDef);
        spawnObject.rigidbody.setPosition(planck.Vec2(x * Physics.metersPerPixel, y * Physics.metersPerPixel));
        spawnObject.rigidbody.setAngle(angle * Math.PI / 180);
        console.log(spawnObject.rigidbody);
    }

    delete(actorName) {
        this.render.stage.removeChild(this.gameObjects.get(actorName).container);
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

    collision(gameObject,tags){
        var tags = tags.split(",");
        var collision = false;
        tags.forEach(tag=>{
            gameObject.collision[tag]
        })
        return 
        console.log("engine collision ",gameObject.collision,tags);
       // return(gameObject.collision[id].value);
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
