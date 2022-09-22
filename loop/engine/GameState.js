class GameState {

    constructor(engine) {
        this.engine = engine;
        Object.assign(this, engine.gameModel.allProperties);
    }

    // Render properties
    get displayWidth() { return this._displayWidth };
    set displayWidth(value) {
        this._displayWidth = Input.width = value;
        this.engine.render.renderer.resize(value, this.displayHeight);
        this.engine.render.stage.hitArea = new PIXI.Rectangle(-Input.width / 2, -Input.height / 2, Input.width, Input.height);
    }

    get displayHeight() { return this._displayHeight };
    set displayHeight(value) {
        this._displayHeight = Input.height = value;
        this.engine.render.renderer.resize(this.displayWidth, value);
        this.engine.render.stage.hitArea = new PIXI.Rectangle(-Input.width / 2, -Input.height / 2, Input.width, Input.height);
    }

    get cameraX() { return this._cameraX };
    set cameraX(value) { this._cameraX = value; this.engine.render.stage.x = this.displayWidth / 2.0 - value }

    get cameraY() { return this._cameraY }
    set cameraY(value) { this._cameraY = value; this.engine.render.stage.y = this.displayHeight / 2.0 + value }

    get cameraAngle() { return this._cameraAngle }
    set cameraAngle(value) { this._cameraAngle = value; this.engine.render.stage.angle = value }

    get cameraZoom() { return this._cameraZoom }
    set cameraZoom(value) { this._cameraZoom = value; this.engine.render.stage.scale = { x: value, y: -value } }

    get backgroundColor() { return this._backgroundColor }
    set backgroundColor(value) { this._backgroundColor = value; this.engine.render.renderer.backgroundColor = PIXI.utils.string2hex(value); }

    // Sound properties
    get soundOn() { return this._soundOn }
    set soundOn(value) {
        if (value != this.soundOn) {
            if (value && this.engine.music) this.engine.music.source.play(this.engine.music.id);
            else if (this.engine.music) this.engine.music.source.stop(this.engine.music.id);
        }
        this._soundOn = value;
    }

    get soundtrack() { return this._soundtrack }
    set soundtrack(value) {
        if (value != this.soundtrack) {
            if (this.engine.music) this.engine.music.source.stop(this.engine.music.id);
            this.engine.music = new Sound(value, { volume: this.volume, loop: this.loop, pan: this.pan, start: this.start });
            if (this.soundOn)
                if (this.engine.music.source) this.engine.music.source.play(this.engine.music.id)
                else if (this.engine.music.source) this.engine.music.source.stop(this.engine.music.id);
        }
        this._soundtrack = value;
    }

    get volume() { return this._volume };
    set volume(value) { this._volume = value; if (this.engine.music.source) this.engine.music.source.volume(value) }

    get start() { return this._start };
    set start(value) { this._start = value; if (this.engine.music.source) this.engine.music.source.seek(value) }

    get pan() { return this._pan };
    set pan(value) { this._pan = value; if (this.engine.music.source) this.engine.music.source.stereo(value) }

    get loop() { return this._loop }
    set loop(value) { this._loop = value; if (this.engine.music.source) this.engine.music.source.loop(value); }

    // Physic properties
    get physicsOn() { return this._physicsOn }
    set physicsOn(value) { this._physicsOn = value }

    get gravityX() { return this._gravityX }
    set gravityX(value) { this._gravityX = value; this.engine.physics.world.setGravity(planck.Vec2(value, this.gravityY)); }

    get gravityY() { return this._gravityY }
    set gravityY(value) { this._gravityY = value; this.engine.physics.world.setGravity(planck.Vec2(this.gravityX, value)) }

    // // Input properties
    get currentScene() { return this._currentScene }
    set currentScene(value) { this._currentScene = value; this.engine.currentScene = value }

    get currentSceneNumber() { return this._currentSceneNumber }
    set currentSceneNumber(value) { this._currentSceneNumber = value; this.engine.currentSceneNumber = value };

    get time() { return this._time.toFixed(1) }
    set time(value) { this._time = value; this.engine.time = value }

    get FPS() { return this_FPS.toFixed(0) }
    set FPS(value) { this._FPS = value; this.engine.frameTime = 1 / value }

    get deltaTime() { return this_deltaTime.toFixed(3) }
    set deltaTime(value) { this._deltaTime = value; this.engine.deltaTime = value }

    get mouseX() { return Input.pointerX }
    set mouseX(value) { Input.pointerX = value }

    get mouseY() { return Input.pointerY }
    set mouseY(value) { Input.pointerY = value }
}