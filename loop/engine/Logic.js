class Logic {

    constructor(gameObjects) {
        this.gameObjects = gameObjects;
        console.log(this.gameObjects);
    }

    fixedUpdate(dt, scope) {
        console.log(this.gameObjects)
        this.gameObjects.forEach(gameObject => {
            gameObject.fixedUpdate(dt, scope)
        })
        this.gameObjects.forEach(gameObject => {
            if (gameObject._dead) gameObject.remove();
        })
        Input.restartInput();
        console.log(".............................");
    }
}