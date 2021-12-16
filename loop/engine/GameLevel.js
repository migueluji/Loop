class GameLevel {

    constructor(engine) {
        this.engine = engine;
        for (let key in engine.gameModel.allProperties) {
            this["_" + key] = engine.gameModel.allProperties[key];
        }
        this._currentScene = engine.gameModel.sceneList[0].name;
        this._currentSceneNumber = 0;
        console.log(this);
    }

    get displayWidth() { return this._displayWidth }

    get displayHeight() { return this._displayHeight }

    get cameraX() { return this._cameraX }
    set cameraX(value) { this._cameraX = value; if (this.engine) this.engine.render.stageWorld.x = -value }

    get cameraY() { return this._cameraY }
    set cameraY(value) { this._cameraY = value; if (this.engine) this.engine.render.stageWorld.y = -value }

    get cameraAngle() { return this._cameraAngle }
    set cameraAngle(value) { this._cameraAngle = value; if (this.engine) this.engine.render.stageWorld.angle = value }

    get cameraZoom() { return this._cameraZoom }
    set cameraZoom(value) { this._cameraZoom = value; if (this.engine) this.engine.render.stage.scale = { x: value, y: -value } }

    get backgroundColor() { return this._backgroundColor }
    set backgroundColor(value) {
        this._backgroundColor = value;
        if (this.engine) this.engine.render.renderer.backgroundColor = PIXI.utils.string2hex(value)
    }

    get soundtrack() { return this._soundtrack }
    set soundtrack(value) {
        this._soundtrack = value;
        if (this.engine) { // change sound file
            this.engine.aural.music.source.stop(this.engine.aural.music.id);
            this.engine.aural.music = new Sound(value);
            this.engine.aural.music.source.play(this.engine.aural.music.id);
        }
    }

    get volume() { return this._volume };
    set volume(value) { this._voluem = value; if (this.engine) this.engine.aural.music.source.volume(value) }

    get start() { return this._start };
    set start(value) { this._start = value; if (this.engine) this.engine.aural.music.source.seek(value) }

    get pan() { return this._pan };
    set pan(value) { this._pan = value; if (this.engine) this.engine.aural.music.source.stereo(value) }

    get loop() { return this._loop }
    set loop(value) {
        this._loop = value;
        if (this.engine) {
            this.engine.aural.music.source.loop(value);
            this.engine.aural.music.source.play();
        }
    }

    get gravityX() { return this._gravityX }
    set gravityX(value) {
        this._gravityX = value;
        if (this.engine) this.engine.physics.world.setGravity(planck.Vec2(value, this.gravityY));
    }

    get gravityY() { return this._gravityY }
    set gravityY(value) {
        this._gravityY = value;
        if (this.engine) this.engine.physics.world.setGravity(planck.Vec2(this.gravityX, value))
    }

    get time() { return (this.engine.time).toFixed(1); }
    set time(value) { };

    get FPS() { return (1 / this.engine.frameTime).toFixed(0); }
    set FPS(value) { };

    get deltaTime() { return (this.engine.deltaTime).toFixed(3); }
    set deltaTime(value) { };

    get currentScene() { return this._currentScene }
    set currentScene(value) { this._currentScene = this.engine.currentScene = value }

    get currentSceneNumber() { return this._currentSceneNumber }
    set currentSceneNumber(value) { this._currentSceneNumber = this.engine.currentSceneNumber = value };

    get mouseX() { return Input.pointerX }
    set mouseX(value) { Input.pointerX = value };

    get mouseY() { return Input.pointerY }
    set mouseY(value) { Input.pointerY = value };
}