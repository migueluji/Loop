class Sound {
    constructor(src) {
        this.source = player.file.playList[src];
        this.id = this.source.play(); // play to get the sound id
        this.source.stop(this.id); //  stop to initialize the
        console.log(src, this.id);
        return (this);
    }
}
