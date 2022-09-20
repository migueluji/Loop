class Container extends PIXI.Container {

    constructor(actor) {
        super();
        this.zIndex = actor.zIndex;
        this.x = actor.x;
        this.y = actor.y;
        this.angle = actor.angle;
        this.sprite = new Sprite(actor);
        this.addChild(this.sprite);
        this.spriteText = new Text(actor);
        this.addChild(this.spriteText);
    }
}
