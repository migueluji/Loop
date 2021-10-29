class Rule {

    constructor(gameObject) {
        this.gameObject = gameObject;
        var expression = [];
        gameObject.actor.scriptList.forEach((script, i) => { // add scripts to expression
            expression += this.parseNodeList(script.nodeList) + ";"; // replace Me by actor's name
        });
        expression = expression.replace(/Me\./g, gameObject.name + ".");
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
    edit(params) {
        var position = params.property.indexOf(".") + 1;
        var property = params.property.substring(position);
        var specialProperties = ["color", "backgroundColor", "fill", "image", "font", "style", "align"];
        if (specialProperties.includes(property)) params.value = "'" + params.value + "'"; // to add quotes
        return (params.property + " = " + params.value);
    }

    spawn(params) {
        return ("Engine.spawn(" + params.actor + ",Me.x+" + params.x + ",Me.y +" + params.y + ",Me.angle+" + params.angle + ")");
    }

    delete() {
        return ("Engine.delete(Me.name)");
    }

    animate(params) {
        var timer = new Timer(this.gameObject, 1); // animate each second
        return ("Engine.animate(" + this.gameObject.name + ",'" + timer.id + "','" + params.animation + "'," + params.fps + ")");
    }

    move(params) {
        var x = "Me.x = Me.x + " + params.speed + " * Game.deltaTime * cos(" + params.angle + " deg);";
        var y = "Me.y = Me.y + " + params.speed + " * Game.deltaTime * sin(" + params.angle + " deg)";
        return (x + y);
    }

    move_to(params) {
        var distance = "dist = distance([Me.x,Me.y],[" + params.x + "," + params.y + "]);";
        var x = "Me.x = (dist >= 1) ? Me.x + " + params.speed + " * Game.deltaTime * (" + params.x + "- Me.x) / dist : " + params.x + ";";
        var y = "Me.y = (dist >= 1) ? Me.y + " + params.speed + " * Game.deltaTime * (" + params.y + "- Me.y) / dist : " + params.y;
        return (distance + x + y);
    }

    rotate(params) {
        var dist = "dist = distance([" + params.pivot_X + ", " + params.pivot_Y + "],[Me.x, Me.y]);";
        var angle = " Me.angle = Me.angle + " + params.speed + " * Game.deltaTime;";
        var x = "Me.x = " + params.pivot_X + " + dist * cos(Me.angle deg);";
        var y = "Me.y = " + params.pivot_Y + " + dist * sin(Me.angle deg)";
        return (dist + angle + x + y);
    }

    rotate_to(params) {
        var dist = "dist = distance([" + params.pivot_X + ", " + params.pivot_Y + "],[Me.x, Me.y]);";
        var dx0 = "dx0 = " + params.pivot_X + " - Me.x;";
        var dy0 = "dy0 = " + params.pivot_Y + " - Me.y;";
        var angle0 = "angle0  = ((dx0 == 0) and (dy0 == 0)) ? Me.angle * PI / 180 : PI + atan2(dy0, dx0);";
        var dx1 = "dx1 = " + params.pivot_X + " - " + params.x + ";";
        var dy1 = "dy1 = " + params.pivot_Y + " - " + params.y + ";";
        var angle1 = "angle1 = PI + atan2(dy1, dx1);";
        var da = "da = angle1 - angle0;";
        var daa = " daa =(abs(da) > PI) ? (da < -PI ? 2 * PI + da : -2 * PI + da) : da;";
        var angle = "Me. angle = Me.angle + daa * 180 / PI * " + params.speed + " * Game.deltaTime;";
        var x = "Me.x = " + params.pivot_X + " + dist * cos(Me.angle deg);";
        var y = "Me.y = " + params.pivot_Y + " + dist * sin(Me.angle deg)";
        return (dist + dx0 + dy0 + angle0 + dx1 + dy1 + angle1 + da + daa + angle + x + y);
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

    collision(params,nodeListTrue,nodeListFalse) {
        var tags = params.tags.split(",");
        if(!this.gameObject.collision) this.gameObject.collision={};
        tags.forEach(tag=>{
            if (!this.gameObject.collision[tag]) this.gameObject.collision[tag] = false;
        })
        return ("[Engine.collision(" + this.gameObject.name + ",'" + params.tags+"') ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    timer(params, nodeListTrue, nodeListFalse) {
        var id = utils.id();
        if (!this.gameObject.timer) this.gameObject.timer = {};
        var timer = new Object({ "time": 0.0, "previousTime": 0.0, "seconds":  math.eval(params.seconds) });
        return ("[Engine.timer(" + this.gameObject.name + ",'" + id + "','" + params.seconds + "') ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    touch(params, nodeListTrue, nodeListFalse) {
        if  (params.mode == "Is Over") params.mode ="over";
        if(params.on_Actor) Input.addActor(this.gameObject);
        return ("[Engine.touch('" + params.mode.toLowerCase() + "',"+params.on_Actor+","+this.gameObject.name+") ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }
    keyboard(params, nodeListTrue, nodeListFalse) {
        Input.addKey(params.key);
        return ("[Engine.keyboard('" + params.key+ "','" + params.key_Mode.toLowerCase() + "') ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }
}

