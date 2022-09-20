class Logic {

    constructor(gameObjects) {
        this.gameObjects = gameObjects;
    }

    fixedUpdate(dt, scope) { // time in miliseconds
        this.gameObjects.forEach(gameObject => {
            gameObject.fixedUpdate(dt, scope);
        })
    }
}