class Input {
    static keyList = {};
    static pointer = { down: false, up: true, over: false, tap: false };
    static engine;
    static dummyConstructor = (function () {
        document.addEventListener("keydown", Input.keyDownHandler.bind(this));
        document.addEventListener("keyup", Input.keyUpHandler.bind(this));
    })();

    constructor(engine){
        Input.engine = engine;
    }

    static addKey(key) {
        this.keyList[key] = { down: false, up: true, pressed: false };
    }

    static keyDownHandler(event) {
        console.log(".....",Input.engine);
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
