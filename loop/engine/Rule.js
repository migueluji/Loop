class Rule {

    constructor(actor) {
        this.actorName = actor.name;
        this.parseScripts(actor.scriptList);
        console.log(this.expression);
        this.code = math.compile(this.expression);
    }

    parseScripts(scriptList) {
        this.expression = "[";
        scriptList.forEach(script => {
            script.nodeList.forEach(node => {
                this.parseNodeList(node);
            })
        });
        this.expression = this.expression.replace(/.$/,"]"); 
        this.expression = this.expression.replace(/Me./g, this.actorName + ".");
    }

    parseNodeList(node) {
        switch (node.type) {
            case "Edit": this.addEdit(node.parameters);
        }
    }

    addEdit(parameters) {
        this.expression += parameters.property + "=" + parameters.value + ",";
    }

}
