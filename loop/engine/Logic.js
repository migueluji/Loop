class Logic {

    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        this.scope = engine.scope;
    }

    fixedUpdate(dt, t, frameTime) { // time in miliseconds
        this.scope["Game"].deltaTime = dt / 1000;
        this.scope["Game"].time = t / 1000;
        this.scope["Game"].mouseX = Input.pointerX;
        this.scope["Game"].mouseY = Input.pointerY;
        this.scope["Game"].FPS = 1000 / frameTime;
        console.log(this.scope["Game"].deltaTime,this.scope["Game"].time);
        // update gameObjects
       this.scope["star"].x += 100 * this.scope["Game"].deltaTime;
        var value = this.scope["Blue"].x;
        this.gameObjects.forEach(gameObject => { gameObject.fixedUpdate(dt / 1000, this.scope); })
        console.log(this.scope["Blue"].x-value,this.scope["star"].x,this.scope["Blue"].x);
    }
}