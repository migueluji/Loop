class Audio {

    constructor(engine) {
        this.gameProperties = engine.gameProperties;
        this.previousStart = engine.gameProperties.start;
        this.scope = engine.scope;
        this.play= true;
        var soundProperties = {
            sound: this.gameProperties.soundtrack,
            soundOn: this.gameProperties.soundOn,
            volume: this.gameProperties.volume,
            start: this.gameProperties.start,
            pan: this.gameProperties.pan,
            loop: this.gameProperties.loop
        }
        this.music = new Sound(soundProperties);
    }

    fixedUpdate() {  // time in miliseconds
        this.music.volume(this.scope["Game"].volume);
        this.music.loop(this.scope["Game"].loop);
        this.music.stereo = this.scope["Game"].pan;
        // if (this.scope["Game"].soundOn && this.play){
        //     this.music.play();
        //     this.scope["Game"].soundOn
        // } 
        if (this.previousStart != this.scope["Game"].start) {
            this.music.seek(this.scope["Game"].start);
            this.scope["Game"].start = 0;
            this.previousStart = 0;
        }
    }
}