class Container extends PIXI.Container {

    constructor(actor) {
        super();
        const existsImage = Boolean(player.file.loader.resources[actor.image]);
        const scroll = Boolean((actor.scrollX != 0) || (actor.scrollY != 0));
        const tile = Boolean((actor.tileX != 1) || (actor.tileY != 1));
        // Settings properties
        this.x = actor.x;
        this.y = actor.y;
        this.angle = actor.angle;
        // Sprite properties
        const sprite = (scroll || tile) ? new PIXI.TilingSprite() : new PIXI.Sprite();
        sprite.visible = actor.spriteOn;
        sprite.image = actor.image;
        sprite.texture = (existsImage) ? player.file.loader.resources[actor.image].texture : PIXI.Texture.WHITE;
        sprite.texture.rotate = 8;
        sprite.anchor.set(0.5);
        if (tile && !scroll) sprite.cacheAsBitmap = true;
        sprite.tint = PIXI.utils.string2hex(actor.color);
        sprite.alpha = actor.opacity;
        sprite.width = (existsImage) ? sprite.texture.width * actor.tileX : 50 * actor.tileX;
        sprite.height = (existsImage) ? sprite.texture.height * actor.tileY : 50 * actor.tileY;
        sprite.scale.x = (actor.flipX) ? -actor.scaleX : actor.scaleX;
        sprite.scale.y = (actor.flipY) ? -actor.scaleY : actor.scaleY;
        sprite.scrollX = actor.scrollX;
        sprite.scrollY = actor.scrollY;
        sprite.tileX = actor.tileX;
        sprite.tileY = actor.tileY;
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
        text.visible = actor.textOn;
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
    }

    saveState() {
        // this.previous = {
        //     x: this.position.x,
        //     y: this.position.y,
        //     angle: this.angle
        // };
        // const scroll = Boolean((this.actor.scrollX != 0) || (this.actor.scrollY != 0));
        // if (scroll) {
        //     this.previous.sprite = { tilePositionX: this.sprite.tilePosition.x, tilePositionY: this.sprite.tilePosition.y };
        // }
    }

    update(deltaTime) {
        // this.saveState();
        // const scroll = Boolean((this.actor.scrollX != 0) || (this.actor.scrollY != 0));
        // if (scroll) {
        //     this.sprite.tilePosition.x += this.sprite.scroll.x * deltaTime;
        //     this.sprite.tilePosition.y += this.sprite.scroll.y * deltaTime;
        // }
    }

    draw(lagOffset) {
        // this.x = this.x * lagOffset + this.previous.x * (1 - lagOffset);
        // this.y = this.y * lagOffset + this.previous.y * (1 - lagOffset);
        // if (this.scroll) {
        //     this.sprite.tilePosition.x = this.sprite.tilePosition.x * lagOffset + this.previous.sprite.tilePositionX * (1 - lagOffset);
        //     this.sprite.tilePosition.y = this.sprite.tilePosition.y * lagOffset + this.previous.sprite.tilePositionY * (1 - lagOffset);
        // }
    }
}
