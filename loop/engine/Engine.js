class Engine {

    constructor(gameModel) {
        this.ffps = 100;
        this.fps = 60;
        this.currentTime=0.0;
        this.accumulator = 0.0;
        this.dt = 1000 / this.ffps;
        this.t = 0.0;
        this.frameTime = 0.0;

        this.gameObjects = this.createGameObjects(gameModel);
        this.scope = this.createScope(this.gameObjects, gameModel.allProperties);
        console.log(this.scope);
        this.render = new Render(this);
        this.logic = new Logic(this);
        this.gameLoop();
    } ;

    gameLoop(newTime) {
        //var newTime = Date.now();
        //setTimeout(this.gameLoop.bind(this),1000/this.fps);
       // setTimeout(() => {window.requestAnimationFrame(this.gameLoop.bind(this));}, 1000 / this.fps);
        window.requestAnimationFrame(this.gameLoop.bind(this));
        if (this.currentTime) {
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
            this.render.integrate(this.accumulator / this.dt);
            this.scope["Game"].FPS = 1000 / this.frameTime;
        }
        this.currentTime = newTime;
        
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
        var scope = new Object({ "Game": gameProperties });
        gameObjects.forEach((gameObject, actorName) => {
            scope[actorName] = gameObject;
        });
        return scope;
    }
}
