class Logic {

    constructor(engine) {
        this.gameLevel = engine.gameLevel;
        this.gameObjects = engine.gameObjects;
        this.scope = engine.scope;
    }

    fixedUpdate(dt, t, frameTime) { // time in miliseconds
        this.gameLevel.fixedUpdate(dt, t, frameTime);
        this.gameObjects.forEach(gameObject => { gameObject.fixedUpdate(dt, this.scope); })
    }
}