class Sound {

    constructor(src, options) {
        this.source = player.file.playList[src];
        if (this.source) {
            this.source.stop(this.id); //  stop to initialize the sound and get a new id when play is performed
            this.id = this.source.play(); // play to get the sound id
            if (options) {
                this.source.volume(options.volume);
                this.source.loop(options.loop);
                this.source.stereo(options.pan);
                this.source.seek(options.start); ///

            }
        }
    }
}
