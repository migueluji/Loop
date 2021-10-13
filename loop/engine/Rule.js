class Rule {

    constructor(actor) {
        this.actorName = actor.name;
        var expression = [];
        actor.scriptList.forEach((script, i) => { // add scripts to expression
            expression += this.parseNodeList(script.nodeList).replace(/Me./g, this.actorName + ".").slice(1, -1) + ";";
        });
      //  expression = "plane.x = plane.x + 100 * Game.deltaTime * ( 100-plane.x) / distance([plane.x,plane.y],[100,100])";
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
            case "Edit": nodeExpression = this.addEdit(node.parameters); break;
            case "Move": nodeExpression = this.addMove(node.parameters); break;
            case "Move_To": nodeExpression = this.addMoveTo(node.parameters); break;
            case "Compare": nodeExpression = this.addCompare(node.parameters, node.nodeListTrue, node.nodeListFalse); break;
            case "Check": nodeExpression = this.addCheck(node.parameters, node.nodeListTrue, node.nodeListFalse); break;
        }
        return (nodeExpression);
    }
    // Actions 
    addEdit(params) {
        var position = params.property.indexOf(".") + 1;
        var property = params.property.substring(position);
        var specialProperties = ["color", "backgroundColor", "fill", "image", "font", "style", "align"];
        if (specialProperties.includes(property)) params.value = "'" + params.value + "'"; // to add quotes
        return (params.property + "=" + params.value);
    }

    addMove(params) {
        var x = "Me.x = Me.x + " + params.speed + " * Game.deltaTime * cos(" + params.angle + " deg)";
        var y = "Me.y = Me.y + " + params.speed + " * Game.deltaTime * sin(" + params.angle + " deg)";
        return (x + " ; " + y);
    }

    addMoveTo(params) {
        var x = "Me.x = Me.x + " + params.speed + " * Game.deltaTime * (" + params.x + "- Me.x) / distance([Me.x,Me.y],[" + params.x + "," + params.y + "])";
        var y = "Me.y = Me.y + " + params.speed + " * Game.deltaTime * (" + params.y + "- Me.y) / distance([Me.x,Me.y],[" + params.x + "," + params.y + "])";
        return (x + " ; " + y);
    }
    // Conditions
    addCompare(params, nodeListTrue, nodeListFalse) {
        var dictionary = { "Less": "<", "Less Equal": "<=", "Equal": "==", "Greater Equal": ">=", "Greater": ">", "Different": "!=" };
        params.operation = dictionary[params.operation];
        return ("[" + params.value_1 + " " + params.operation + " " + params.value_2 + " ? " +
            this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    addCheck(params, nodeListTrue, nodeListFalse) {
        return ("[" + params.property + " ? " +
            this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }
}
