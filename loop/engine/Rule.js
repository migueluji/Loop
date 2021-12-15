class Rule {

    constructor(gameObject) {
        this.gameObject = gameObject;
        this.gameObject.resume = false;
        var expression = [];
        gameObject.actor.scriptList.forEach((script, i) => { // add scripts to expression
            expression += this.parseNodeList(script.nodeList) + ";"; // replace Me by actor's name
        });
        expression = expression.replace(/Me\./g, gameObject.name + ".");
        // console.log(gameObject.name,expression);
        return (math.compile(expression));
    }

    parseNodeList(nodeList) {
        var secuence = [];
        if (nodeList.length > 0) {
            nodeList.forEach(node => {
                secuence += this[node.type.toLowerCase()](node.parameters, node.nodeListTrue, node.nodeListFalse) + ";"; // call node function
            })
            secuence = "[" + secuence.replace(/.$/, "]"); // replace last ; by ];
        }
        else secuence = "[]"; // empty nodeList
        return (secuence);
    }

    // Actions 
    go_to(params) {
        this.gameObject.resume = true;
        return ("Engine.goTo(Engine.sceneList." + params.scene + ")");
    }

    pause(params) { // pause
        return ("Engine.pause(" + params.physics + "," + params.logic + "," + params.sounds + ")");
    }

    resume() { // resume
        this.gameObject.resume = true;
        return ("Engine.resume()");
    }

    edit(params) {
        var position = params.property.indexOf(".") + 1;
        var property = params.property.substring(position);
        var specialProperties = ["type", "color", "backgroundColor", "fill", "image", "sound", "soundtrack", "font", "style", "align"];
        if (specialProperties.includes(property) && params.value[0] != "'") params.value = "'" + params.value + "'"; // to add quotes if it doesn't have them
        return (params.property + " = " + params.value);
    }

    spawn(params) {
        return ("Engine.spawn("+ this.gameObject.name+","+ params.actor + "," + params.x + "," + params.y + "," + params.angle + ")");
    }

    delete() {
        return ("Engine.delete(" + this.gameObject.name + ")");
    }

    animate(params) {
        var id = Utils.id();
        if (!this.gameObject.timer) this.gameObject.timer = {}; // create timers if doesn't exist
        this.gameObject.timer[id] = new Object({ "time": 0.0, "previousTime": 0.0, "seconds": 1 });
        return ("Engine.animate(" + this.gameObject.name + ",'" + id + "','" + params.animation + "'," + params.fps + ")"); s
    }

    play(params) {
        return ("Engine.play(" + this.gameObject.name + ",'" + params.sound_File + "')");
    }

    move(params) {
        return ("Engine.move(" + this.gameObject.name + "," + params.speed + "," + params.angle + ")");
    }

    move_to(params) {
        return ("Engine.moveTo(" + this.gameObject.name + "," + params.speed + "," + params.x + "," + params.y + ")");
    }

    rotate(params) {
        return ("Engine.rotate(" + this.gameObject.name + "," + params.speed + "," + params.pivot_X + "," + params.pivot_Y + ")");
    }

    rotate_to(params) {
        return ("Engine.rotateTo(" + this.gameObject.name + "," + params.speed + "," + params.x + "," + params.y + "," + params.pivot_X + "," + params.pivot_Y + ")");
    }

    push(params) {
        return ("Engine.push(" + this.gameObject.name + "," + params.force + "," + params.angle + ")");
    }

    push_to(params) {
        return ("Engine.pushTo(" + this.gameObject.name + "," + params.force + "," + params.x + "," + params.y + ")");
    }

    torque(params) {
        return ("Engine.torque(" + this.gameObject.name + "," + params.angle + ")");
    }

    // Conditions
    compare(params, nodeListTrue, nodeListFalse) {
        var dictionary = { "Less": "<", "Less Equal": "<=", "Equal": "==", "Greater Equal": ">=", "Greater": ">", "Different": "!=" };
        var operation = dictionary[params.operation];
        return ("[" + params.value_1 + " " + operation + " " + params.value_2 + " ? " +
            this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    check(params, nodeListTrue, nodeListFalse) {
        return ("[" + params.property + " ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    collision(params, nodeListTrue, nodeListFalse) {
        var tags = params.tags.split(",");
        if (!this.gameObject.collision) this.gameObject.collision = {};
        tags.forEach(tag => {
            if (!this.gameObject.collision[tag]) this.gameObject.collision[tag] = new Set();
        })
        return ("[Engine.collision(" + this.gameObject.name + ",'" + params.tags + "') ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    timer(params, nodeListTrue, nodeListFalse) {
        var id = Utils.id();
        if (!this.gameObject.timer) this.gameObject.timer = {};
        this.gameObject.timer[id] = new Object({ "time": 0.0, "previousTime": 0.0, "seconds": math.eval(params.seconds) });;
        return ("[Engine.timer(" + this.gameObject.name + ",'" + id + "','" + params.seconds + "') ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    touch(params, nodeListTrue, nodeListFalse) {
        if (params.mode == "Is Over") params.mode = "over";
        if (params.on_Actor) Input.addActor(this.gameObject);
        return ("[Engine.touch('" + params.mode.toLowerCase() + "'," + params.on_Actor + "," + this.gameObject.name + ") ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    keyboard(params, nodeListTrue, nodeListFalse) {
        Input.addKey(params.key);
        return ("[Engine.keyboard('" + params.key + "','" + params.key_Mode.toLowerCase() + "') ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }
}

