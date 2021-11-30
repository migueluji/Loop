class Logic {

    fixedUpdate(engine, dt, t, frameTime) { // time in miliseconds
        engine.gameLevel.fixedUpdate(dt, t, frameTime);
        engine.gameObjects.forEach(gameObject => { 
            if (!engine.gamePaused) gameObject.fixedUpdate(dt, engine.scope); 
            else if (gameObject.resume) gameObject.fixedUpdate(dt, engine.scope);
        })
        if (engine.changeScene) { // the change of scene occurs after evaluating all logic
            engine.loadScene(engine.goToScene);
            engine.changeScene = false;
        }
    }
}