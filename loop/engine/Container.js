class Container extends PIXI.Container {

    constructor(actor) {
        super();
        this.zIndex = actor.zIndex;
        // add sprite
        this.sprite = new PIXI.TilingSprite();
        this.updateSprite(actor.image, actor.tileX, actor.tileY);
        this.addChild(this.sprite);
        // add sprite text
        const style = new PIXI.TextStyle({ wordWrap: true, wordWrapWidth: actor.width, padding: actor.width });
        this.spriteText = new PIXI.Text("", style);
        this.spriteText.anchor.set(0.5);
        this.spriteText.scale.y = -1;
        this.addChild(this.spriteText);
    }

    updateSprite(image, tileX, tileY) {
        const existsImage = Boolean(player.file.loader.resources[image]);
        if (existsImage) this.sprite.texture = player.file.loader.resources[image].texture;
        else {
            this.sprite.texture = PIXI.Texture.WHITE;
            this.sprite.texture.orig = new PIXI.Rectangle(0, 0, 50, 50);
        }
        this.sprite.texture.rotate = 8;
        this.sprite.anchor.set(0.5);
        this.sprite.width = this.sprite.texture.width * tileX;
        this.sprite.height = this.sprite.texture.height * tileY;
    }
}
