class GameObject {

    constructor(actor) {
        this.actor ={};
        Object.assign(this.actor, actor);
        this.spriteText= new SpriteText(actor);
        this.rule = new Rule(actor);
        actor.x=0;
        console.log(this);
    }
}