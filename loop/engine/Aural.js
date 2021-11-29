class Aural {
    
    constructor(gameLevel) {
        this.music = new Sound(gameLevel.soundtrack, {
            volume: gameLevel.volume, loop: gameLevel.loop, 
            pan: gameLevel.pan, start: gameLevel.start 
        });
    }

    play(engine) {
        engine.gameLevel.play(this.music);
        engine.gameObjects.forEach(gameObject => { gameObject.play() });
    }
}