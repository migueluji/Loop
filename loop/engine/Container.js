class Container extends PIXI.Container {

    constructor(actor) {
        super();
        this.zIndex = actor.zIndex;
        // Settings properties
        this.x = actor.x;
        this.y = actor.y;
        this.angle = actor.angle;
        // Sprite properties
        const existsImage = Boolean(player.file.loader.resources[actor.image]);
        this.sprite = new Sprite(actor);
        this.addChild(this.sprite);
        // Text properties
        this.text = new Text(actor);
        this.addChild(this.text);
    }
}
