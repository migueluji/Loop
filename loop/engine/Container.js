class Container extends PIXI.Container {

    constructor(actor) {
        super();
        const existsImage = Boolean(player.file.loader.resources[actor.image]);
        this.scroll = Boolean((actor.scrollX != 0) || (actor.scrollY != 0));
        const tile = Boolean((actor.tileX != 1) || (actor.tileY != 1));

        const texture = (existsImage) ? player.file.loader.resources[actor.image].texture : PIXI.Texture.WHITE;
        texture.rotate = 8;
        const sprite = (this.scroll || tile) ? new PIXI.TilingSprite(texture, actor.width, actor.height) : new PIXI.Sprite(texture);
        if (tile && !this.scroll) sprite.cacheAsBitmap = true;
        // Settings properties
        sprite.position = { x: actor.x, y: actor.y };
        sprite.width = (existsImage) ? sprite.texture.width * actor.tileX : 50 * actor.tileX;
        sprite.height = (existsImage) ? sprite.texture.height * actor.tileY : 50 * actor.tileY;
        sprite.scale.x = (actor.flipX) ? -actor.scaleX : actor.scaleX;
        sprite.scale.y = (actor.flipY) ? -actor.scaleY : actor.scaleY;
        sprite.angle = actor.angle;
        // Sprite properties
        sprite.visible = actor.spriteOn;
        sprite.anchor.set(0.5);
        sprite.tint = "0x" + String(actor.color).substr(1);
        sprite.alpha = actor.opacity;
        sprite.scroll = { x: actor.scrollX, y: actor.scrollY }; //new properties
        sprite.previousTilePos = { x: 0.0, y: 0.0 };
        this.addChild(sprite);

        // Text properties
        const w = Math.abs(sprite.width * sprite.scale.x);
        const style = new PIXI.TextStyle({
            fontFamily: actor.font,
            fill: actor.fill,
            fontSize: actor.size,
            fontStyle: actor.style,
            align: actor.align.toLowerCase(),
            wordWrap: true,
            wordWrapWidth: w,
            padding: w
        });
        const text = new PIXI.Text(actor.text, style);
        var pivot = { x: 0, y: 0 };
        switch (actor.align) {
            case "Left": pivot = { x: -w / 2, y: text.height / 2 }; break;
            case "Right": pivot = { x: w / 2 - text.width, y: text.height / 2 }; break;
            case "Center": pivot = { x: -text.width / 2, y: text.height / 2 }; break;
        }
        text.position = { x: pivot.x + actor.offsetX, y: pivot.y + actor.offsetY };
        text.scale.y = -1;
        this.addChild(text);

        this.sprite = sprite;
        this.text = text;
        this.previousPos = { x: actor.x, y: actor.y };
    }

    update(deltaTime) {
        this.previousPos.x = this.x;
        this.previousPos.y = this.y;
        if (this.scroll) {
            this.sprite.previousTilePos.x = this.sprite.tilePosition.x;
            this.sprite.previousTilePos.y = this.sprite.tilePosition.y;
            this.sprite.tilePosition.x += this.sprite.scroll.x * deltaTime;
            this.sprite.tilePosition.y += this.sprite.scroll.y * deltaTime;
        }
    }

    draw(lagOffset) {
        
        this.x = this.x * lagOffset + this.previousPos.x * (1 - lagOffset);
        this.y = this.y * lagOffset + this.previousPos.y * (1 - lagOffset);
        if (this.scroll) {
            this.sprite.tilePosition.x = this.sprite.tilePosition.x * lagOffset + this.sprite.previousTilePos.x * (1 - lagOffset);
            this.sprite.tilePosition.y = this.sprite.tilePosition.y * lagOffset + this.sprite.previousTilePos.y * (1 - lagOffset);
           // console.log(lagOffset,this.sprite.previousTilePos.x," ",this.sprite.tilePosition.x);
        }
    }
}
