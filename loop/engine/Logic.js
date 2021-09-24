class Logic {

    constructor(gameObjects, scope) {
        this.gameObjects = gameObjects;
        this.scopre = scope;
    }

    update(deltaTime) {
        console.log("updateLogic ",this.gameObjects);
        this.gameObjects.forEach(gameObject => {
            gameObject.update(deltaTime,this.scope);
        })
    }
}