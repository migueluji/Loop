class Engine {

    constructor(gameModel) {
        this.init(gameModel);

        this.render = new Render(this.gameObjects, this.gameProperties);
        this.logic = new Logic(this.gameObjects, this.gameProperties);

        window.requestAnimationFrame(this.gameLoop.bind(this));
        this.fpsText = document.getElementById("fps");
        
        this.fps = 30;
        this.currentTime;
        this.accumulator = 0.0;
        this.dt = 1.0 / this.fps;
        this.t = 0.0;
    }

    init(gameModel) {
        this.gameObjects = [];
        console.log(gameModel);
        gameModel.sceneList[0].actorList.forEach(actor => {
            this.gameObjects.push(new GameObject(actor));
        });
        this.gameProperties=gameModel.properties;
    }

    gameLoop(newTime) {
        requestAnimationFrame(this.gameLoop.bind(this));
        if (this.currentTime) {
            var frameTime = newTime - this.currentTime;
            if (frameTime > 250) frameTime = 250;
            this.accumulator += frameTime;
            while (this.accumulator >= this.dt) {
                this.fpsText.innerHTML = (1000 / frameTime).toFixed(1) + " fps " + this.fps + " ffps " + (this.t / 1000).toFixed(2) + " sec";
                this.logic.update(this.dt / 1000);
                this.t += this.dt;
                this.accumulator -= this.dt;
            }
            this.render.draw(this.accumulator / this.dt);
        }
        this.currentTime = newTime;
    }
}
