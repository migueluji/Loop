class Logic {

    constructor(engine) {
        this.engine = engine;
        this.gameObjects = engine.gameObjects;
        this.changeScene = false;
    }

    fixedUpdate(dt, scope) { // time in miliseconds
        this.gameObjects.forEach(gameObject => {
            if (!gameObject.sleeping) gameObject.fixedUpdate(dt, scope);
        })
        if (this.changeScene) {
            this.engine.gameObjects.clear();
            this.engine.render = new Render(this.engine.gameObjects)
            Object.assign(this.engine.gameState,this.engine.gameState);
            // this.engine.gameState.backgroundColor = this.engine.gameState._backgroundColor;
            // this.engine.gameState.displayWidth = this.engine.gameState._displayWidth;
            // this.engine.gameState.displayHeight = this.engine.gameState._displayHeight;
            this.engine.physics = new Physics(this.engine.gameObjects);
            this.engine.loadScene(this.sceneName);
        }
    }
}