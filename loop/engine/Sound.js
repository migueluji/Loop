class Sound {
    
    constructor(src, options) {
        this.source = player.file.playList[src];
        this.source.stop(this.id); //  stop to initialize the sound and get a new id when play is performed
        this.id = this.source.play(); // play to get the sound id
        this.source.stop(this.id); //  stop the sound id
        if (options) {
            this.source.volume(options.volume);
            this.source.loop(options.loop);
            this.source.stereo(options.pan);
            this.source.seek(options.start);
        }
        return (this);
    }
}
