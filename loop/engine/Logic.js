class Logic {

    constructor(gameObjects, gameProperties) {
        this.gameObjects=gameObjects;
    }

    update(deltaTime) {
         this.gameObjects.forEach(gameObject => {
             gameObject.spriteText.update(deltaTime);
         })
    }
}