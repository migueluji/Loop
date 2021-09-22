class Logic {

    constructor(gameObjects, gameProperties) {
        this.gameObjects=gameObjects;
    }

    update(deltaTime) {
         this.gameObjects.forEach(gameObject => {
             gameObject.container.update(deltaTime);
         })
    }
}