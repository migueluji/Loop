class GameLevel {

    constructor(engine, gameModel) {
        this.engine = engine;
        for (let key in gameModel.allProperties) { this[key] = gameModel.allProperties[key]; }
    }

    get displayWidth() { return this.engine.render.renderer.width; }
    set displayWidth(value) { }

    get displayHeight() { return this.engine.render.renderer.height; }
    set displayHeight(value) { }

    get cameraX() { return (this.engine.render.stage.position.x * 2.0 / this.displayWidth) }
    set cameraX(value) { this.engine.render.stage.x = this.displayWidth / 2.0 - value; }

    get cameraY() { return (-this.engine.render.stage.position.y * 2.0 / this.displayHeight) }
    set cameraY(value) { this.engine.render.stage.position.y = this.displayHeight / 2.0 + value }

    get cameraZoom() { return this.engine.render.stage.scale.x }
    set cameraZoom(value) { this.engine.render.stage.scale = { x: value, y: -value }; }

    get soundtrack() { return this.engine.music.source._src }
    set soundtrack(value) {
        if (this.engine.aural.music.source._src != player.file.playList[value]._src) { // change sound file
            var volume = this.volume; // get previous volume
            this.engine.aural.music.source.stop(this.engien.aural.music.id);
            this.engine.aural.music = new Sound(value);
            this.volume = volume; // update volume
        }
    }

    get volume() { return this.engine.aural.music.source.volume() };
    set volume(value) { this.engine.aural.music.source.volume(value); }

    get start() { return this.engine.aural.music.source.seek() };
    set start(value) { this.engine.aural.music.source.seek(value) };

    get pan() { return this.engine.aural.music.source.stereo() };
    set pan(value) { this.engine.aural.music.source.stereo(value) };

    get loop() { return this.engine.aural.music.source.loop() }
    set loop(value) { this.engine.aural.music.source.loop(value) };

    get gravityX() { return this.engine.physics.world.getGravity().x; }
    set gravityX(value) { this.engine.physics.world.setGravity(planck.Vec2(value, this.gravityY)) }

    get gravityY() { return this.engine.physics.world.getGravity().y }
    set gravityY(value) { this.engine.physics.world.setGravity(planck.Vec2(this.gravityX, value)) }

    get mouseX() { return Input.pointerX }
    set mouseX(value) { Input.pointerX = value };

    get mouseY() { return Input.pointerY }
    set mouseY(value) { Input.pointerY = value };
}