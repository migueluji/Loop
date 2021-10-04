class Logic {

    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        this.scope = engine.scope;
    }

    fixedUpdate(deltaTime) {
        this.gameObjects.forEach(gameObject => {
            gameObject.fixedUpdate(deltaTime,this.scope);
        })
    }
}