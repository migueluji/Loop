class Rule {

    constructor(actor) {
        this.actorName = actor.name;
        this.parseScripts(actor.scriptList);
        console.log(this.expression);
        this.expression="(plane.x < 0) ? [plane.x=plane.x+1;plane.y=100;(plane.x >= -100) ? [plane.y=150;plane.flipX=false] : plane.flipX =true] : [plane.angle=plane.angle+1;plane.y=0] ; plane.color='#d85555'";
        //console.log(this.expression);
        this.code = math.compile(this.expression);
    }

    parseScripts(scriptList) {
        this.expression = "[";
        scriptList.forEach(script => {
            this.parseNodeList(script.nodeList);
        });
        this.expression = this.expression.replace(/.$/, "]");
        this.expression = this.expression.replace(/Me./g, this.actorName + ".");
    }

    parseNodeList(nodeList){
        nodeList.forEach(node => {
            this.parseNode(node);
            this.expression +=",";
        })
        this.expression.slice(0,-1);
    }

    parseNode(node) {
        console.log(node);
        switch (node.type) {
            case "Edit": this.addEdit(node); break;
            case "Compare": this.addCompare(node); break;
        }
    }

    addEdit(node) {
        if (node.parameters.value[0] == "#") node.parameters.value = "'" + node.parameters.value + "'"; // add quotes to color value
        this.expression += node.parameters.property + "=" + node.parameters.value ;
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
        this.expression += node.parameters.value_1 + " " + node.parameters.operation + " " + node.parameters.value_2+ " ? "+
                        this.parseNodeList(node.nodeListTrue)+ " : "+ this.parseNodeList(node.nodeListFalse);
        //this.expression = "[plane.x<0 ? plane.x=plane.x+1 : plane.angle=plane.angle+1]";
    }

}
