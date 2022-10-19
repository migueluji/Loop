class Logic {

    constructor(engine) {
        this.engine = engine;
        this.gameObjects = engine.gameObjects;
        this.logicOn = true;
    }

    fixedUpdate(dt, scope) {
        if (this.logicOn) this.gameObjects.forEach(gameObject => {
            gameObject.fixedUpdate(dt, scope)
        })
    }
}