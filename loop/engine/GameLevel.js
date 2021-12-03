class GameLevel {

    constructor(gameModel) {
        var soundOpt = { volume: gameModel.volume, loop: gameModel.loop, pan: gameModel.pan, start: gameModel.start }
        if (gameModel.soundtrack) this.music = new Sound(gameModel.soundtrack,soundOpt);
        for (let key in gameModel.allProperties) { this[key] = gameModel.allProperties[key];}
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

    play() {
        console.log(this.soundOn,this.music.id,this.music.source.playing());
        if (this.soundOn) this.music.source.play(this.music.id);
        else this.music.source.stop(this.music.id);
        // if (music.source._src != player.file.playList[this.soundtrack]._src) { // change soundtrack
        //     music.source.stop(music.id);
        //     music = new Sound(this.soundtrack);
        // }

        // if (this.start != this.start) {
        //     music.source.seek(this.start);
        //     this.start = this.start;
        // }
         //music.source.volume(this.volume);
        // music.source.stereo(this.pan);
        // music.source.loop(this.loop);
    }
    
    get volume(){ return this.music.source.volume() };
    set volume(value) { this.music.source.volume(value);}

    get start() { return this.music.source.seek() };
    set start(value) { this.music.source.seek(value) };

    get pan() { return this.music.source.stereo() };
    set pan(value) { this.music.source.stereo(value) };

    get loop() { return this.music.source.loop() }
    set loop(value) { this.music.source.loop(value) };
}