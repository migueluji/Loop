class Engine {

    constructor(gameModel) {
        this.id = 0;
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
            this.scope[actor.name]=gameObject;
            zIndex++;
        });
        // Create engines
        this.render = new Render(this);
        this.logic = new Logic(this);
        // Launch gameloop
        window.requestAnimationFrame(this.gameLoop.bind(this));
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

    spawnObject(gameObject, x, y, angle) {
        var spawnName = gameObject.name + this.id;
        this.id++;
        var spawnObject = new GameObject(this.gameObjects.get(gameObject.actor.name).actor, spawnName);
        spawnObject = Object.assign(spawnObject, { "x": x, "y": y, "angle": angle, "sleeping": false });
 
        this.scope[spawnObject.name] = spawnObject;
        this.gameObjects.set(spawnObject.name, spawnObject);
        this.render.stage.addChild(spawnObject.container);
        console.log(this.scope);
    }

    deleteObject(actorName) {
        this.render.stage.removeChild(this.gameObjects.get(actorName).container);
        this.gameObjects.delete(actorName);
        delete this.scope[actorName];
    }

    checkTimer(gameObject,id,seconds){
        if (gameObject.timers[id] == seconds * 1000) { 
            gameObject.timers[id] = 0; return(true);
        }
        else {
            gameObject.timers[id] += this.dt; return(false);
        }
    }
}
