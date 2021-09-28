class Logic {

    constructor(gameObjects, scope) {
        this.gameObjects = gameObjects;
        this.scope = scope;
    }

    fixedUpdate(deltaTime) {
        this.gameObjects.forEach(gameObject => {
            gameObject.fixedUpdate(deltaTime,this.scope);
        })
    }
}