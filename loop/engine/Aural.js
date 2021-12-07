class Aural {

    constructor(gameModel){
        var soundOpt = { volume: gameModel.volume, loop: gameModel.loop, pan: gameModel.pan, start: gameModel.start }
        if (gameModel.soundtrack) this.music = new Sound(gameModel.soundtrack,soundOpt);
        if (gameModel.soundOn) this.music.source.play(this.music.id);
        console.log(this.music,this.music.source.loop());
    }
    
    play(engine) {
        if (!engine.stopSounds) engine.gameObjects.forEach(gameObject => { gameObject.play() });
        else engine.gameObjects.forEach(gameObject => { gameObject.pause() });
    }
}
