class Engine {

    constructor(gameModel) {
        this.ffps = 120;
        this.fps = 60;
        this.currentTime = 0.0;
        this.accumulator = 0.0;
        this.dt = 1000 / this.ffps;
        this.t = 0.0;
        this.frameTime = 0.0;

        this.gameObjects = this.createGameObjects(gameModel);
        console.log(this.gameObjects);
        this.scope = this.createScope(this.gameObjects, gameModel.allProperties);
        this.render = new Render(this);
        this.logic = new Logic(this);
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

    createGameObjects(gameModel) {
        var gameObjects = new Map();
        var zIndex =0;
        gameModel.sceneList[0].actorList.forEach(actor => {
            actor.zIndex = zIndex;
            var gameObject = new GameObject(actor);
            gameObjects.set(actor.name, gameObject);
            zIndex++;
        });
        return gameObjects;
    }

    createScope(gameObjects, gameProperties) {
        var scope = new Object({ "Game": gameProperties, "Engine": this });
        gameObjects.forEach((gameObject, actorName) => { scope[actorName] = gameObject; });
        return scope;
    }

    spawnObject(gameObject, x, y, angle) {
        var spawnName = gameObject.name + Utils.id();
        var spawnObject = new GameObject(this.gameObjects.get(gameObject.actor.name).actor, spawnName);
        spawnObject = Object.assign(spawnObject, { "x": x, "y": y, "angle": angle, "sleeping": false });
        this.gameObjects.set(spawnObject.name, spawnObject);
        this.scope[spawnObject.name] = spawnObject;
        this.render.addGameObject(spawnObject);
    }

    deleteObject(actorName){
        console.log(actorName);
    }
}
