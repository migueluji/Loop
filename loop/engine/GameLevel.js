class GameLevel {

    constructor(gameModel) {
        for (let key in gameModel.allProperties) { this[key] = gameModel.allProperties[key];}
        gameModel.sceneList.forEach(scene => { this[scene.name] = scene.name;});
    }

    fixedStep(world) {
        world.setGravity(planck.Vec2(this.gravityX, this.gravityY));
    }

    fixedUpdate(deltaTime, time, frameTime) {
        this.deltaTime = deltaTime;
        this.time = time;
        this.FPS = 1 / frameTime;
        this.mouseX = Input.pointerX;
        this.mouseY = Input.pointerY;
    }

    update(renderer, stage) {
        renderer.backgroundColor = PIXI.utils.string2hex(this.backgroundColor);
        stage.position = {
            x: this.displayWidth / 2.0 - this.cameraX,
            y: this.displayHeight / 2.0 + this.cameraY
        };
        stage.scale = { x: this.cameraZoom, y: -this.cameraZoom };
        stage.angle = this.cameraAngle;
    }

    play(music) {
        if (this.soundOn) music.source.play(music.id);
        else music.source.stop(music.id);
        if (music.source._src != player.file.playList[this.soundtrack]._src) { // change soundtrack
            music.source.stop(music.id);
            music = new Sound(this.soundtrack);
        }
        music.source.volume(this.volume);
        if (this.start != this.start) {
            music.source.seek(this.start);
            this.start = this.start;
        }
        music.source.stereo(this.pan);
        music.source.loop(this.loop);
    }
}