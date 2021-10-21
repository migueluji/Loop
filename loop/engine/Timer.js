class Timer {
    constructor(gameObject, seconds) {
        this.id = Utils.id();
        if (!gameObject.timers) gameObject.timers = {}; // create timers if doesn't exist
        var timer = new Object({ "time": 0.0, "previousTime": 0.0, "seconds": seconds });
        gameObject.timers[this.id] = timer;
    }
}
