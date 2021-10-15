class Engine {

    constructor(gameModel) {
        this.ffps = 120;
        this.fps = 60;
        this.currentTime = 0.0;
        this.accumulator = 0.0;
        this.dt = 1000 / this.ffps;
        this.t = 0.0;
        this.frameTime = 0.0;

        this.gameModel = gameModel;
        this.originalObjects = this.createOriginalObjects(gameModel);
        this.gameObjects = this.createGameObjects(gameModel);
        this.scope = this.createScope(this.gameObjects, gameModel.allProperties);
        console.log(this.scope);
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

    createOriginalObjects(gameModel) {
        var objects = new Object();
        gameModel.sceneList[0].actorList.forEach(actor => { objects[actor.name] = actor; });
        return objects;
    }

    createGameObjects(gameModel) {
        var gameObjects = new Map();
        gameModel.sceneList[0].actorList.forEach(actor => {
            var gameObject = new GameObject(actor);
            gameObjects.set(actor.name, gameObject);
        });
        return gameObjects;
    }

    createScope(gameObjects, gameProperties) {
        var scope = new Object({ "Game": gameProperties, "Engine": this });
        gameObjects.forEach((gameObject, actorName) => { scope[actorName] = gameObject; });
        return scope;
    }

    spawnObject(actor, x, y, angle) {
        var spawnObject = new GameObject(this.originalObjects[actor.actor.name]);
        spawnObject.name = actor.name + Utils.id();
        spawnObject.x = x;
        spawnObject.y = y;
        spawnObject.angle = angle;
        this.gameObjects.set(spawnObject.name,spawnObject);
        this.scope[spawnObject.name] = spawnObject;
        console.log("spawn ",this.gameObjects);
    }
}
