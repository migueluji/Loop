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
        var secuence = "[";
        nodeList.forEach(node => {
            secuence += this.parseNode(node) + ";";
        })
        secuence = secuence.replace(/.$/, "]"); // replace last character ; by ]
        return (secuence);
    }

    parseNode(node) {
        var nodeExpression = "";
        switch (node.type) {
            case "Edit": nodeExpression = this.addEdit(node); break;
            case "Compare": nodeExpression = this.addCompare(node); break;
        }
        return (nodeExpression);
    }

    addEdit(node) {
        if (node.parameters.value[0] == "#") node.parameters.value = "'" + node.parameters.value + "'"; // add quotes to color value
        return (node.parameters.property + "=" + node.parameters.value);
    }

    addCompare(node) {
        switch (node.parameters.operation) {
            case "Less": node.parameters.operation = "<"; break;
            case "Less Equal": node.parameters.operation = "<="; break;
            case "Equal": node.parameters.operation = "=="; break;
            case "Greater Equal": node.parameters.operation = ">="; break;
            case "Greater": node.parameters.operation = ">"; break;
            case "Different": node.parameters.operation = "!="; break;
        }
        return ("[" + node.parameters.value_1 + " " + node.parameters.operation + " " + node.parameters.value_2 + " ? " +
            this.parseNodeList(node.nodeListTrue) + " : " + this.parseNodeList(node.nodeListFalse) + "]");
    }
}
