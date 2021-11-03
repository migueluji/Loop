class Input {
    static keyList = {};
    static pointer = { down: false, up: true, over: false, tap: false };
    static gameObjects = {};
    static keyUP = true; // to avoid repeated keydown events

    constructor(engine) {
        Input.pointerX = engine.gameProperties.mouseX;
        Input.pointerY = engine.gameProperties.mouseY;
        Input.width = engine.gameProperties.displayWidth;
        Input.height = engine.gameProperties.displayHeight;
        var stage = engine.render.stage;
        // Stage pointer events
        stage.hitArea = new PIXI.Rectangle(-Input.width / 2, -Input.height / 2, Input.width, Input.height);
        stage.on("pointerdown", Input.pointerDownHandler.bind(this));
        stage.on("pointerupoutside", Input.pointerUpHandler.bind(this));
        stage.on("pointerup", Input.pointerUpHandler.bind(this));
        stage.on("pointermove", Input.pointerMoveHandler.bind(this));
        // Key events
        document.addEventListener("keydown", Input.keyDownHandler.bind(this));
        document.addEventListener("keyup", Input.keyUpHandler.bind(this));
    }

    static addKey(key) {
        if (!this.keyList.hasOwnProperty(key)) 
            this.keyList[key] = { down: false, up: true, pressed: false };
    }

    static addActor(gameObject) {
        var name = gameObject.name;
        if (!this.gameObjects.hasOwnProperty(name))
            this.gameObjects[name] = { down: false, up: false, over: false, tap: false };

        gameObject.container.interactive = true;
        gameObject.container.buttonMode = true;
        // GameObject pointer events
        gameObject.container.on("pointerdown", this.actorPointerDownHandler.bind(this, name));
        gameObject.container.on("pointerupoutside", this.actorPointerUpHandler.bind(this, name));
        gameObject.container.on("pointerup", this.actorPointerUpHandler.bind(this, name));
        gameObject.container.on("pointerover", this.actorPointerOverHandler.bind(this, name));
        gameObject.container.on("pointerout", this.actorPointerOutHandler.bind(this, name));
    }

    static actorPointerDownHandler(name) {
        Input.gameObjects[name] = { down: true, up: false, over: true, tap: true };
    }

    static actorPointerUpHandler(name) {
        Input.gameObjects[name] = { down: false, up: true, over: true, tap: false };
    }

    static actorPointerOverHandler(name) {
        Input.gameObjects[name].over = true;
        Input.gameObjects[name].up = true;
    }

    static actorPointerOutHandler(name) {
        Input.gameObjects[name].over = false;
        Input.gameObjects[name].up = false;
    }

    static pointerDownHandler() {
        Input.pointer = { down: true, up: false, tap: true };
    }

    static pointerUpHandler() {
        Input.pointer = { down: false, up: true, tap: false };
    }

    static pointerMoveHandler(event) {
        var x = event.data.global.x - (Input.width / 2);
        var y = (Input.height / 2) - event.data.global.y;
        Input.pointerX = (x > Input.width / 2) ? Input.width / 2 : (x < -Input.width / 2) ? -Input.width / 2 : x;
        Input.pointerY = (y > Input.height / 2) ? Input.height / 2 : (y < -Input.height / 2) ? -Input.height / 2 : y;
    }

    static keyDownHandler(event) {
        event.preventDefault();
        if ((Input.keyUP) && (Input.keyList.hasOwnProperty(event.code))) {
            Input.keyList[event.code] = { down: true, up: false, pressed: true };
            Input.keyUP = false;
        }
    }

    static keyUpHandler(event) {
        event.preventDefault();
        if (Input.keyList.hasOwnProperty(event.code)) {
            Input.keyList[event.code] = { down: false, up: true, pressed: false };
        }
        Input.keyUP = true;
    }
}
