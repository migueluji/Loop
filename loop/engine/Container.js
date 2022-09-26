class Container extends PIXI.Container {

    constructor(actor) {
        super();
        this.zIndex = actor.zIndex;
        // add sprite
        const existsImage = Boolean(player.file.loader.resources[actor.image]);
        this.sprite = new PIXI.TilingSprite();
        if (existsImage) this.sprite.texture = player.file.loader.resources[actor.image].texture;
        else {
            this.sprite.texture = PIXI.Texture.WHITE;
            this.sprite.texture.orig = new PIXI.Rectangle(0, 0, 50, 50);
        }
        this.sprite.texture.rotate = 8;
        this.sprite.anchor.set(0.5);
        this.addChild(this.sprite);
        // add sprite text
        const style = new PIXI.TextStyle({ wordWrap: true, wordWrapWidth: actor.width, padding: actor.width });
        this.spriteText = new PIXI.Text("", style);
        this.spriteText.anchor.set(0.5);
        this.spriteText.scale.y = -1;
        this.addChild(this.spriteText);
    }
}
