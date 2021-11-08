class Logic {

    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        this.scope = engine.scope;
    }

    fixedUpdate(dt, t, frameTime) { // time in miliseconds
        this.scope["Game"] = {
            deltaTime: dt / 1000,
            time: t / 1000,
            mouseX: Input.pointerX,
            mouseY: Input.pointerY,
            FPS: 1000 / frameTime
        }
        this.gameObjects.forEach(gameObject => { gameObject.fixedUpdate(dt / 1000, this.scope); })
    }
}