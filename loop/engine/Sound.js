class Sound {
    
    constructor(src, options) {
        this.source = player.file.playList[src];
        // this.id = this.source.play(); // play to get the sound id
        // this.source.stop(); //  stop to initialize the sound
        this.id = this.source.play(); // play to get the sound id
        this.source.stop(this.id); //  stop to initialize the sound
        if (options) {
            this.source.volume(options.volume);
            this.source.loop(options.loop);
            this.source.stereo(options.pan);
            this.source.seek(options.start);
        }
        console.log(src,this.source.volume(),this.id);
        return (this);
    }
}
