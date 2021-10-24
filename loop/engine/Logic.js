class Logic {

    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        this.scope = engine.scope;
    }

    fixedUpdate(dt, t, frameTime) {
        this.scope["Game"].deltaTime = dt / 1000;
        this.scope["Game"].time = t / 1000;
        this.scope["Game"].mouseX = Input.pointerX;
        this.scope["Game"].mouseY = Input.pointerY;
        this.scope["Game"].FPS = 1000 / frameTime;
        this.gameObjects.forEach(gameObject => {
            gameObject.fixedUpdate(dt / 1000, this.scope);
        })
    }
}