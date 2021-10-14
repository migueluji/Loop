class Rule {

    constructor(actor) {
        this.actorName = actor.name;
        var expression = [];
        actor.scriptList.forEach((script, i) => { // add scripts to expression
            expression += this.parseNodeList(script.nodeList).replace(/Me./g, this.actorName + ".").slice(1, -1) + ";";
        });
        console.log(expression);
        this.code = math.compile(expression);
    }

    parseNodeList(nodeList) {
        var secuence = [];
        if (nodeList.length > 0) {
            nodeList.forEach(node => {
                secuence += this.parseNode(node) + ";";
            })
            secuence = "[" + secuence.replace(/.$/, "]"); // replace last ; by ]
        }
        else secuence = "[]"; // empty nodeList
        return (secuence);
    }

    parseNode(node) {
        var nodeExpression = "";
        switch (node.type) {
            case "Edit": nodeExpression = this.edit(node.parameters); break;
            case "Move": nodeExpression = this.move(node.parameters); break;
            case "Move_To": nodeExpression = this.moveTo(node.parameters); break;
            case "Rotate": nodeExpression = this.rotate(node.parameters); break;
            case "Rotate_To": nodeExpression = this.rotateTo(node.parameters); break;
            case "Compare": nodeExpression = this.compare(node.parameters, node.nodeListTrue, node.nodeListFalse); break;
            case "Check": nodeExpression = this.check(node.parameters, node.nodeListTrue, node.nodeListFalse); break;
        }
        return (nodeExpression);
    }
    // Actions 
    edit(params) {
        var position = params.property.indexOf(".") + 1;
        var property = params.property.substring(position);
        var specialProperties = ["color", "backgroundColor", "fill", "image", "font", "style", "align"];
        if (specialProperties.includes(property)) params.value = "'" + params.value + "'"; // to add quotes
        return (params.property + "=" + params.value);
    }

    move(params) {
        var x = "Me.x = Me.x + " + params.speed + " * Game.deltaTime * cos(" + params.angle + " deg)";
        var y = "Me.y = Me.y + " + params.speed + " * Game.deltaTime * sin(" + params.angle + " deg)";
        return (x + " ; " + y);
    }

    moveTo(params) {
        var distance = "dist = distance([Me.x,Me.y],[" + params.x + "," + params.y + "])";
        var x = "Me.x = (dist >= 1) ? Me.x + " + params.speed + " * Game.deltaTime * (" + params.x + "- Me.x) / dist : " + params.x;
        var y = "Me.y = (dist >= 1) ? Me.y + " + params.speed + " * Game.deltaTime * (" + params.y + "- Me.y) / dist : " + params.y;
        return (distance + "; " + x + "; " + y);
    }

    rotate(params) {
        var dist = "dist = distance([" + params.pivot_X + ", " + params.pivot_Y + "],[Me.x, Me.y]);";
        var angle = " Me.angle = Me.angle + " + params.speed + " * Game.deltaTime;";
        var x = "Me.x = " + params.pivot_X + " + dist * cos(Me.angle deg);";
        var y = "Me.y = " + params.pivot_Y + " + dist * sin(Me.angle deg);";
        return (dist + angle + x + y);
    }

    rotateTo(params) {
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
        var y = "Me.y = " + params.pivot_Y + " + dist * sin(Me.angle deg);";
        return (dist + dx0 + dy0 + angle0 + dx1 + dy1 + angle1 + da + daa + angle + x + y);
    }
    // Conditions
    compare(params, nodeListTrue, nodeListFalse) {
        var dictionary = { "Less": "<", "Less Equal": "<=", "Equal": "==", "Greater Equal": ">=", "Greater": ">", "Different": "!=" };
        params.operation = dictionary[params.operation];
        return ("[" + params.value_1 + " " + params.operation + " " + params.value_2 + " ? " +
            this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    check(params, nodeListTrue, nodeListFalse) {
        return ("[" + params.property + " ? " +
            this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }
}
