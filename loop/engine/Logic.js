class Logic {

    constructor(gameObjects, scope) {
        this.gameObjects = gameObjects;
        this.scope = scope;
    }

    update(deltaTime) {
        this.gameObjects.forEach(gameObject => {
            gameObject.update(deltaTime,this.scope);
        })
    }
}