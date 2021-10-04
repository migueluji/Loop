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
        var secuence=[];
        if (nodeList.length>0) {
            nodeList.forEach(node => {
                secuence += this.parseNode(node) + ";";
            })
            secuence = "["+secuence.replace(/.$/, "]"); // replace last ; by ]
        }
        else secuence ="[]"; // empty nodeList
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
        console.log(node);
        var property = node.parameters.property;
        var position = property.indexOf(".")+1;
        console.log(property,position,property.substring(position));
        console.log("number", isNaN(property));
        switch (property.substring(position)){
            case "color" :
            case "backgroundColor" :
            case "fill":
            case "image" : node.parameters.value = "'" + node.parameters.value + "'";  break;
        }
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
