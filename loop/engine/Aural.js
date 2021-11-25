class Aural {
    
    constructor(engine) {
        this.gameLevel = engine.gameLevel;
        this.gameObjects = engine.gameObjects;
        this.music = new Sound(this.gameLevel.soundtrack, {
            volume: this.gameLevel.volume, loop: this.gameLevel.loop, 
            pan: this.gameLevel.pan, start: this.gameLevel.start 
        });
    }

    play() {
        this.gameLevel.play(this.music);
        this.gameObjects.forEach(gameObject => { gameObject.play() });
    }
}