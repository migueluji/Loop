class Audio {

    play(engine) {
        if (engine.objectSoundsOn) engine.gameObjects.forEach(gameObject => { gameObject.play() });
        else engine.gameObjects.forEach(gameObject => { gameObject.stop() });
    }
}
