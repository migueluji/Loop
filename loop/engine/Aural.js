class Aural {

    play(engine) {
        console.log(engine.gameLevel.music.source.volume());
        engine.gameLevel.play(this.music);
        // if (!engine.stopSounds) engine.gameObjects.forEach(gameObject => { gameObject.play() });
        // else engine.gameObjects.forEach(gameObject => { gameObject.pause() });
    }
}