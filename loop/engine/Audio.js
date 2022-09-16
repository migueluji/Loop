class Audio {

    constructor(gameModel){
        var soundOpt = { volume: gameModel.volume, loop: gameModel.loop, pan: gameModel.pan, start: gameModel.start }
        if (gameModel.soundtrack) this.music = new Sound(gameModel.soundtrack,soundOpt);
        if (gameModel.soundOn) this.music.source.play(this.music.id);
    }
    
    play(engine) {
        if (engine.objectSoundsOn) engine.gameObjects.forEach(gameObject => { gameObject.play() });
        else engine.gameObjects.forEach(gameObject => { gameObject.stop() });
    }
}
