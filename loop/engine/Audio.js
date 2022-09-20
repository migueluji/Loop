class Audio {

    constructor(gameObjects){
        this.gameObjects = gameObjects;
    }

    play() {
        this.gameObjects.forEach(gameObject => { gameObject.play() });
    }
}
