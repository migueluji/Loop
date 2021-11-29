class Logic {

    fixedUpdate(engine, dt, t, frameTime) { // time in miliseconds
        engine.gameLevel.fixedUpdate(dt, t, frameTime);
        engine.gameObjects.forEach(gameObject => { gameObject.fixedUpdate(dt, engine.scope); })
    }
}