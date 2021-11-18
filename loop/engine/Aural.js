class Aural {

    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        this.gameProperties = engine.gameProperties;
        this.scope = engine.scope;
        this.music = new Sound(this.gameProperties.soundtrack);
    }

    fixedPlay() {
        // update game music
        if (this.music.source._src != player.file.playList[this.scope["Game"].soundtrack]._src) { // change soundtrack
            this.music.source.stop(this.music.id);
            this.music = new Sound(this.scope["Game"].soundtrack );
        }
        if (!this.scope["Game"].soundOn) this.music.source.stop(this.music.id);
        else if (!this.music.source.playing(this.musicID)) {
            console.log("play", this.music.id);
            this.music.source.loop(this.scope["Game"].loop);
            this.music.source.seek(this.scope["Game"].start);
            this.music.source.volume(this.scope["Game"].volume);
            this.music.source.stereo(this.scope["Game"].stereo);
            this.music.source.play(this.music.id);
        }
        this.gameObjects.forEach(gameObject => { gameObject.fixedPlay() });
    }
}