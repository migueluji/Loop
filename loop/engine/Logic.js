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
            this.gameObjects.forEach(gameObject => gameObject.remove())
            this.engine.loadScene(this.sceneName);
        }
    }
}