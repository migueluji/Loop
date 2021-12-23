class GameLevel {

    constructor(engine) {
        this._engine = engine;
        for (let key in engine.gameModel.allProperties) {
            this["_" + key] = engine.gameModel.allProperties[key];
        }
        // Define get and set functions for new game properties
        for (let key in engine.gameModel.newProperties) {
            Object.defineProperty(this, key, {
                get() { return this["_" + key] },
                set(value) { this["_" + key] = value }
            });
        }
    }

    updateScene (){
        for (let key in this._engine.gameModel.properties) { // Update game properties
            this["_" + key] = this._engine.gameModel.properties[key];
        }
    }

    // Render Properties
    get displayWidth() { return this._displayWidth }

    get displayHeight() { return this._displayHeight }

    get cameraX() { return this._cameraX }
    set cameraX(value) { this._cameraX = value; if (this._engine) this._engine.render.stageWorld.x = -value }

    get cameraY() { return this._cameraY }
    set cameraY(value) { this._cameraY = value; if (this._engine) this._engine.render.stageWorld.y = -value }

    get cameraAngle() { return this._cameraAngle }
    set cameraAngle(value) { this._cameraAngle = value; if (this._engine) this._engine.render.stageWorld.angle = value }

    get cameraZoom() { return this._cameraZoom }
    set cameraZoom(value) { this._cameraZoom = value; if (this._engine) this._engine.render.stage.scale = { x: value, y: -value } }

    get backgroundColor() { return this._backgroundColor }
    set backgroundColor(value) {
        this._backgroundColor = value;
        if (this._engine) this._engine.render.renderer.backgroundColor = PIXI.utils.string2hex(value)
    }

    // Sound properties
    get soundOn() { return this._soundOn }
    set soundOn(value) { this.soundOn = value }

    get soundtrack() { return this._soundtrack }
    set soundtrack(value) {
        this._soundtrack = value;
        if (this._engine) { // change sound file
            this._engine.aural.music.source.stop(this._engine.aural.music.id);
            this._engine.aural.music = new Sound(value);
            this._engine.aural.music.source.play(this._engine.aural.music.id);
        }
    }

    get volume() { return this._volume };
    set volume(value) { this._voluem = value; if (this._engine) this._engine.aural.music.source.volume(value) }

    get start() { return this._start };
    set start(value) { this._start = value; if (this._engine) this._engine.aural.music.source.seek(value) }

    get pan() { return this._pan };
    set pan(value) { this._pan = value; if (this._engine) this._engine.aural.music.source.stereo(value) }

    get loop() { return this._loop }
    set loop(value) {
        this._loop = value;
        if (this._engine) {
            this._engine.aural.music.source.loop(value);
            this._engine.aural.music.source.play();
        }
    }

    // Physic properties
    get physicsOn() { return this._physicsOn }
    set physicsOn(value) { this._physicsOn = value }

    get gravityX() { return this._gravityX }
    set gravityX(value) {
        this._gravityX = value;
        if (this._engine) this._engine.physics.world.setGravity(planck.Vec2(value, this.gravityY));
    }

    get gravityY() { return this._gravityY }
    set gravityY(value) {
        this._gravityY = value;
        if (this._engine) this._engine.physics.world.setGravity(planck.Vec2(this.gravityX, value))
    }

    // Input properties
    get currentScene() { return this._engine.currentScene }
    set currentScene(value) { this._engine.currentScene = value }

    get currentSceneNumber() { return this._engine.currentSceneNumber }
    set currentSceneNumber(value) { this._engine.currentSceneNumber = value };

    get time() { return this._engine.time.toFixed(1) }

    get FPS() { return (1 / this._engine.frameTime).toFixed(0) }

    get deltaTime() { return this._engine.deltaTime.toFixed(3) }

    get mouseX() { return Input.pointerX }

    get mouseY() { return Input.pointerY }
}