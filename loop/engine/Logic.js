class Logic {

    fixedUpdate(engine, dt) { // time in miliseconds
        engine.gameObjects.forEach(gameObject => { 
            console.log(gameObject.name);
            if (engine.logicOn) gameObject.fixedUpdate(dt, engine.scope); 
            else if (gameObject.resume) gameObject.fixedUpdate(dt, engine.scope);
        })
        if (engine.changeScene) { // The change of scene occurs after evaluating the entire logic
            engine.gameObjects.forEach(gameObject => { gameObject.stop(); }) // Stop gameObject sounds
            engine.loadScene(engine.goToScene);
        }
    }
}