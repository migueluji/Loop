class Input {
    static keyList = {};
    static pointer = { down: false, up: true, over: false, tap: false };
    static gameObjects = {};

    constructor(engine) {
        Input.pointerX = engine.gameProperties.mouseX;
        Input.pointerY = engine.gameProperties.mouseY;
        Input.width = engine.gameProperties.displayWidth;
        Input.height = engine.gameProperties.displayHeight;
        var stage = engine.render.stage;
        // Stage pointer eventes
        stage.on("pointerdown", Input.pointerDownHandler.bind(this));
        stage.on("pointerupoutside", Input.pointerUpHandler.bind(this));
        stage.on("pointerup", Input.pointerUpHandler.bind(this));
        stage.on("pointermove", Input.pointerMoveHandler.bind(this));
        // Key events
        document.addEventListener("keydown", Input.keyDownHandler.bind(this));
        document.addEventListener("keyup", Input.keyUpHandler.bind(this));
    }

    static addKey(key) {
        if (!key in this.keyList) this.keyList[key] = { down: false, up: true, pressed: false };
    }

    static addActor(gameObject) {
        var name = gameObject.name;
        if (!this.gameObjects.hasOwnProperty(name)) this.gameObjects[name] = { down: false, up: true, over: false, tap: false };

        gameObject.container.interactive = true;
        gameObject.container.buttonMode = true;
        // GameObject events
        gameObject.container.on("pointerdown", this.actorPointerDownHandler.bind(this, name));
        gameObject.container.on("pointerupoutside", this.actorPointerUpHandler.bind(this, name));
        gameObject.container.on("pointerup", this.actorPointerUpHandler.bind(this, name));
        gameObject.container.on("pointerover", this.actorPointerOverHandler.bind(this, name));
        gameObject.container.on("pointerout", this.actorPointerOutHandler.bind(this, name));
    }

    static actorPointerDownHandler(name) {
        Input.gameObjects[name].down = true;
        Input.gameObjects[name].up = false;
        Input.gameObjects[name].tap = true;
    }

    static actorPointerUpHandler(name) {
        Input.gameObjects[name].down = false;
        Input.gameObjects[name].up = true;
        Input.gameObjects[name].tap = false;
    }

    static actorPointerOverHandler(name) {
        Input.gameObjects[name].over = true;
    }

    static actorPointerOutHandler(name) {
        Input.gameObjects[name].over = false;
    }

    static pointerDownHandler() {
        Input.pointer.down = true;
        Input.pointer.up = false;
        Input.pointer.tap = true;
    }

    static pointerUpHandler() {
        Input.pointer.down = false;
        Input.pointer.up = true;
        Input.pointer.tap = false;
    }

    static pointerMoveHandler(event) {
        var x = event.data.global.x - (Input.width / 2);
        var y = (Input.height / 2) - event.data.global.y;
        Input.pointerX = (x > Input.width / 2) ? Input.width / 2 : (x < -Input.width / 2) ? -Input.width / 2 : x;
        Input.pointerY = (y > Input.height / 2) ? Input.height / 2 : (y < -Input.height / 2) ? -Input.height / 2 : y;
    }

    static keyDownHandler(event) {
        event.preventDefault();
        if (Input.keyList.hasOwnProperty(event.code)) {
            Input.keyList[event.code] = { down: !Input.keyList[event.code].pressed, up: false, pressed: true };
        }
    }

    static keyUpHandler(event) {
        event.preventDefault();
        if (Input.keyList.hasOwnProperty(event.code)) {
            Input.keyList[event.code] = { down: false, up: true, pressed: false };
        }
    }
}
