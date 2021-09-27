class Engine {

    constructor(gameModel) {
        this.fps = 30;
        this.currentTime;
        this.accumulator = 0.0;
        this.dt = 1.0 / this.fps;
        this.t = 0.0;
        this.frameTime=0.0;

        this.init(gameModel);
        this.render = new Render(this.gameObjects, gameModel.properties);
        this.logic = new Logic(this.gameObjects, this.scope);

        window.requestAnimationFrame(this.gameLoop.bind(this));
        this.fpsText = document.getElementById("fps");
    }

    gameLoop(newTime) {
        window.requestAnimationFrame(this.gameLoop.bind(this));
        if (this.currentTime) {
            this.frameTime = newTime - this.currentTime;
            if (this.frameTime > 250) this.frameTime = 250;
            this.accumulator += this.frameTime;
            while (this.accumulator >= this.dt) {
                this.fpsText.innerHTML = (1000 / this.frameTime).toFixed(1) + " fps " + this.fps + " ffps " + (this.t / 1000).toFixed(2) + " sec";
                this.logic.update(this.dt / 1000);
                this.t += this.dt;
                this.accumulator -= this.dt;
            }
            this.render.integrate(this.accumulator / this.dt);
        }
        this.currentTime = newTime;
    }

    init(gameModel) {
        this.gameObjects = new Map();
        this.scope = new Object({"Game":gameModel.allProperties});
        gameModel.sceneList[0].actorList.forEach(actor => {
            var gameObject = new GameObject(actor);
            this.gameObjects.set(actor.name, gameObject);
            this.scope[actor.name] = gameObject;
        });
        console.log(this.gameObjects, this.scope);
    }
}
