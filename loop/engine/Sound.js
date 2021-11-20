class Sound {
    constructor(src, options) {
        this.source = player.file.playList[src];
        this.id = this.source.play(); // play to get the sound id
        this.source.stop(this.id); //  stop to initialize the
        if (options) {
            this.source.volume(options.volume);
            this.source.loop(options.loop);
            this.source.stereo(options.pan);
            this.source.seek(options.start);
        }
        console.log(src, this.id, this.source.seek());
        return (this);
    }
}
