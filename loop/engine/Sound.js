class Sound {
    constructor(src) {
        this.source = player.file.playList[src];
        this.id = this.source.play();
        console.log(this.id,src);
        return (this);
    }
}
