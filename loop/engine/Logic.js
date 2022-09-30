class Logic {

    constructor(engine) {
        this.engine = engine;
        this.gameObjects = engine.gameObjects;
        this.changeScene = false;
        this.sceneName = "";
        this.soundsMute = this.soundsUnMute = false;
    }

    fixedUpdate(dt, scope) { // time in miliseconds
        this.gameObjects.forEach(gameObject => {
            if (!gameObject.sleeping) gameObject.fixedUpdate(dt, scope);
        })
        if (this.changeScene) {
            this.gameObjects.forEach(gameObject => gameObject.remove())
            this.engine.loadScene(this.sceneName);
        }
        if (this.soundsMute) {
            this.soundsMute = false;
            this.gameObjects.forEach(gameObject => {
                if (gameObject.audio.source) gameObject.audio.source.mute(true, gameObject.audio.id);
            })
        }
        if (this.soundsUnMute) {
            this.soundsUnMute = false;
            this.gameObjects.forEach(gameObject => {
                if (gameObject.audio.source) gameObject.audio.source.mute(false, gameObject.audio.id);
            })
        }
    }
}