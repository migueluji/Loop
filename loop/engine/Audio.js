class Audio {

    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        this.gameProperties = engine.gameProperties;
        this.scope = engine.scope;
        this.startSound = engine.gameProperties.start;
        this.scope = engine.scope;
        var soundProperties = {
            sound: this.gameProperties.soundtrack,
            soundOn: this.gameProperties.soundOn,
            volume: this.gameProperties.volume,
            start: this.gameProperties.start,
            pan: this.gameProperties.pan,
            loop: this.gameProperties.loop
        }
        this.music = new Sound(soundProperties, false);
    }

    fixedPlay() {
        // update game music
        if (this.scope["Game"].soundOn) {
            if (!this.music.playing()) {
                this.music.play();
            }
        }
        else this.music.stop();
        if (this.startSound != this.scope["Game"].start) {
            this.music.seek(this.scope["Game"].start);
            this.scope["Game"].start = this.startSound;
        }
        if (this.music._src != serverGamesFolder + "/" + gameFolder + "/sounds/" + this.scope["Game"].soundtrack) {
            this.music.unload();
            this.music._src = serverGamesFolder + "/" + gameFolder + "/sounds/" + this.scope["Game"].soundtrack;
            this.music.load();
        }
        this.music.volume(this.scope["Game"].volume);
        this.music.loop(this.scope["Game"].loop);
        this.music.stereo = this.scope["Game"].pan;
        //this.gameObjects.forEach(gameObject => { gameObject.fixedPlay()});
    }
}