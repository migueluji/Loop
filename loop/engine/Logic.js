class Logic {

    constructor(engine) {
        this.engine = engine;
        this.gameObjects = engine.gameObjects;
        this.logicOn = true;
    }

    fixedUpdate(dt, scope) {
        if (this.logicOn) this.gameObjects.forEach(gameObject => {
            gameObject.fixedUpdate(dt, scope)
        })
        else this.gameObjects.forEach(gameObject => {
            if (!gameObject.sleeping && gameObject.resume) gameObject.fixedUpdate(dt, scope);
        })
        if (this.changeScene) { // change scene on request
            this.gameObjects.forEach(gameObject => gameObject.remove());
            this.engine.loadScene(this.sceneName);
        }
    }

    get soundsOn() { return this._soundsOn }
    set soundsOn(value) {
        this.gameObjects.forEach(gameObject => {
            if (gameObject.audio.source) gameObject.audio.source.mute(!value, gameObject.audio.id)
        })
        this._soundsOn = undefined;
    }
}