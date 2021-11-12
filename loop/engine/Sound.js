class Sound {
    constructor(actor, destroy) {
        var sound = new Howl({
            src: [serverGamesFolder + "/" + gameFolder + "/sounds/" + actor.sound],
            autoplay: actor.soundOn,
            loop: actor.loop,
            volume: actor.volume,
            stereo: actor.pan,
            format: actor.sound.split(".")[1],
            onend: function () { if (destroy) { this.unload() }}
        })
        return (sound);
    }
}
