class Logic {

    constructor(gameObjects, gameProperties) {
        this.gameObjects = gameObjects;
    }

    update(deltaTime) {
        console.log("updateLogic ",this.gameObjects);
        this.gameObjects.forEach(gameObject => {
            gameObject.update(deltaTime,this.gameObjects);
        })
    }
}