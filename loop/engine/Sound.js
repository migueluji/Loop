class Sound {
    constructor(actor) {
        console.log(actor.name, actor.soundOn, actor.sound, actor.volume, actor.start, actor.pan, actor.loop);
        var sound = new Howl({
            src: [serverGamesFolder + "/" + gameFolder + "/sounds/" + actor.sound],
            autoplay: actor.soundOn,
            seek: actor.start,
            loop: actor.loop,
            volume: actor.volume,
            stereo: actor.pan,
            format: actor.sound.split(".")[1],
            onload: function () { console.log("load ", actor.sound); },
            onend: function () { console.log("dead ", actor.sound); }
        })
        return (sound);
    }
}
