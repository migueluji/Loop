class Engine {

    constructor(gameModel) {
        this.ffps = 100;
        //   this.fps = 60;
        this.dt = 1000 / this.ffps;
        this.currentTime = this.accumulator = this.t = this.frameTime = 0.0;
        // Create data structures
        this.gameObjects = new Map();
        this.scope = new Object({ "Game": gameModel.allProperties, "Engine": this });
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
        this.logic = new Logic(this);
        // Launch gameloop
        window.requestAnimationFrame(this.gameLoop.bind(this));
        console.log(this.gameObjects);
    };

    gameLoop(newTime) {
        window.requestAnimationFrame(this.gameLoop.bind(this));
        this.frameTime = newTime - this.currentTime;
        if (this.frameTime > 250) this.frameTime = 250;
        this.accumulator += this.frameTime;
        while (this.accumulator >= this.dt) {
            this.scope["Game"].deltaTime = this.dt / 1000;
            this.scope["Game"].time = this.t / 1000;
            this.logic.fixedUpdate(this.dt / 1000);
            this.t += this.dt;
            this.accumulator -= this.dt;
        }
        this.render.update(this.accumulator / this.dt);
        this.scope["Game"].FPS = 1000 / this.frameTime;
        this.currentTime = newTime;
    }

    spawn(gameObject, x, y, angle) {
        var spawnName = gameObject.name + Utils.id();
        var spawnObject = new GameObject(this.gameObjects.get(gameObject.actor.name).actor, spawnName);
        spawnObject = Object.assign(spawnObject, { "x": x, "y": y, "angle": angle, "sleeping": false });
        this.scope[spawnObject.name] = spawnObject;
        this.gameObjects.set(spawnObject.name, spawnObject);
        this.render.stage.addChild(spawnObject.container);
    }

    delete(actorName) {
        this.render.stage.removeChild(this.gameObjects.get(actorName).container);
        this.gameObjects.delete(actorName);
        delete this.scope[actorName];
    }

    timer(gameObject, id, expression) {
        var lostFlow = ((gameObject.timers[id].previousTime - gameObject.timers[id].time) > 0);
        var secReached = (gameObject.timers[id].time >= gameObject.timers[id].seconds * 1000);
        if (lostFlow || secReached) {
            gameObject.timers[id] = { time: 0.0, previousTime: 0.0, seconds: math.eval(expression) };
            return (true);
        }
        else {
            gameObject.timers[id].time += this.dt;
            gameObject.timers[id].previousTime = gameObject.timers[id].time;
            return (false);
        }
    }

    animate(gameObject, id, animation, fps) {
        var secuence = animation.split(",");
        var dtAnim = 1000 / fps;
        if (gameObject.timers[id].time + this.dt < 1000) gameObject.timers[id].time += this.dt;
        else gameObject.timers[id].time = 0;
        var frame = gameObject.timers[id].time / dtAnim;
        gameObject.image = secuence[Math.floor(frame % secuence.length)];
    }
}
