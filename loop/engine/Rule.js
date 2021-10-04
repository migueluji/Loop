class Rule {

    constructor(actor) {
        this.actorName = actor.name;
        var expression = [];
        actor.scriptList.forEach((script, i) => { // add scripts to expression
            expression += this.parseNodeList(script.nodeList).replace(/Me./g, this.actorName + ".").slice(1, -1) + ";";
        });
        //   console.log(expression);
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
        console.log(node);
        var nodeExpression = "";
        switch (node.type) {
            case "Edit": nodeExpression = this.addEdit(node.parameters); break;
            case "Compare": nodeExpression = this.addCompare(node.parameters,node.nodeListTrue,node.nodeListFalse); break;
        }
        return (nodeExpression);
    }

    addEdit(node) {
        var position = node.property.indexOf(".") + 1;
        var property = node.property.substring(position);
        var specialProperties = ["color", "backgroundColor", "fill", "image"];
        if (specialProperties.includes(property)) // to add quotes
            node.value = "'" + node.value + "'";
        return (node.property + "=" + node.value);
    }

    addCompare(node,nodeListTrue, nodeListFalse) {
        var dictionary = { "Less": "<", "Less Equal": "<=", "Equal": "==", "Greater Equal": ">=", "Greater": ">", "Different": "!=" };
        node.operation = dictionary[node.operation];
        return ("[" + node.value_1 + " " + node.operation + " " + node.value_2 + " ? " +
            this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }
}
