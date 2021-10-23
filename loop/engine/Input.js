class Input {
    static keyList = {};
    static pointer = { down: false, up: true, over: false, tap: false };

    constructor(engine) {
        Input.pointerX = engine.gameProperties.mouseX;
        Input.pointerY = engine.gameProperties.mouseY;
        Input.width = engine.gameProperties.displayWidth;
        Input.height = engine.gameProperties.displayHeight;
        var stage = engine.render.stage;

        stage.on("pointerdown", Input.pointerDownHandler.bind(this));
        stage.on("pointerupoutside", Input.pointerUpHandler.bind(this));
        stage.on("pointerup", Input.pointerUpHandler.bind(this));
        stage.on("pointermove", Input.pointerMoveHandler.bind(this));

        document.addEventListener("keydown", Input.keyDownHandler.bind(this));
        document.addEventListener("keyup", Input.keyUpHandler.bind(this));
    }

    static addKey(key) {
        this.keyList[key] = { down: false, up: true, pressed: false };
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
        Input.pointerX = event.data.global.x - (Input.width / 2);
        Input.pointerY = (Input.height / 2) - event.data.global.y;
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
