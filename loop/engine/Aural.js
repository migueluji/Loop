class Aural {

    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        this.gameProperties = engine.gameProperties;
        this.scope = engine.scope;
        this.start = this.gameProperties.start;
        var soundOpt = { volume: this.gameProperties.volume, loop: this.gameProperties.loop, pan: this.gameProperties.pan, start: this.gameProperties.start }
        this.music = new Sound(this.gameProperties.soundtrack, soundOpt);
    }

    play() {
        // update game music
        if (this.scope["Game"].soundOn) this.music.source.play(this.music.id);
        else this.music.source.stop(this.music.id);
        if (this.music.source._src != player.file.playList[this.scope["Game"].soundtrack]._src) { // change soundtrack
            this.music.source.stop(this.music.id);
            this.music = new Sound(this.scope["Game"].soundtrack);
        }
        this.music.source.volume(this.scope["Game"].volume);
        if (this.start != this.scope["Game"].start) {
            this.music.source.seek(this.scope["Game"].start);
            this.start = this.scope["Game"].start;
        }
        this.music.source.stereo(this.scope["Game"].pan);
        this.music.source.loop(this.scope["Game"].loop);
        this.gameObjects.forEach(gameObject => { gameObject.play() });
    }
}