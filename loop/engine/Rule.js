class Rule {

    constructor(actor) {
        console.log(JSON.stringify(actor.scriptList));
        this.expression = this.parseScript(actor.scriptList);
        this.code = math.compile(this.expression);
    }

    parseScript(scriptList) {
        return ("shine");
    }

}
