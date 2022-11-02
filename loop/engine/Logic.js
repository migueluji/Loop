class Logic {

    constructor(gameObjects) {
        this.gameObjects = gameObjects;
    }

    fixedUpdate(dt, scope) {
        this.gameObjects.forEach(gameObject => {
            gameObject.fixedUpdate(dt, scope)
        })
        // this.gameObjects.forEach(gameObject => { // remove marked objects
        //     if (gameObject._dead) gameObject.remove();
        // })
        Input.restartInput();
    }
}