class Logic {

    constructor(engine) {
        this.engine = engine;
        this.gameObjects = engine.gameObjects;
        this.logicOn = true;
        this.changeScene = false;
        this.sceneName = "";
        this.soundsMute = this.soundsUnMute = false;
    }

    fixedUpdate(dt, scope) { // time in miliseconds
        if (this.logicOn) {
            this.gameObjects.forEach(gameObject => {
                if (!gameObject.sleeping) gameObject.fixedUpdate(dt, scope)
            })
            // if (this.soundsMute) { // mute all sounds
            //     this.soundsMute = false;
            //     this.gameObjects.forEach(gameObject => {
            //         if (gameObject.audio.source) gameObject.audio.source.mute(true, gameObject.audio.id)
            //     })
            // }
            // if (this.soundsUnMute) { // Unmute all sounds
            //     this.soundsUnMute = false;
            //     this.gameObjects.forEach(gameObject => {
            //         if (gameObject.audio.source) gameObject.audio.source.mute(false, gameObject.audio.id)
            //     })
            // }
            if (this.changeScene) { // change scene on request
                this.gameObjects.forEach(gameObject => gameObject.remove())
                this.engine.loadScene(this.sceneName);
                this.gameObjects.forEach(gameObject => {
                    if (this.engine.physicsOn) (gameObject.physicsOn) ? Rigidbody.convertToRigidbody(gameObject) : Rigidbody.convertToSensor(gameObject);
                    else Rigidbody.convertToSensor(gameObject);
                })
            }
        }
        // else this.gameObjects.forEach(gameObject => { // apply only the rules for "resume" objects 
        //     if (!gameObject.sleeping && gameObject.resume) gameObject.fixedUpdate(dt, scope)
        // })
    }
}