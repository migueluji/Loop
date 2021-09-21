class SpriteText extends PIXI.Container {

    constructor(gameObject) {
        super();
        const existsImage = Boolean(player.file.loader.resources[gameObject.image]);
        const scroll = Boolean((gameObject.scrollX != 0) || (gameObject.scrollY != 0));
        const tile = Boolean((gameObject.tileX != 1) || (gameObject.tileY != 1));

        const texture = (existsImage) ? player.file.loader.resources[gameObject.image].texture : PIXI.Texture.WHITE;
        texture.rotate = 8
        const sprite = (scroll || tile) ? new PIXI.TilingSprite(texture, gameObject.width, gameObject.height) : new PIXI.Sprite(texture);
        this.texture = texture;

        if (tile && !scroll) sprite.cacheAsBitmap = true;
        // Settings properties
        this.position = { x: gameObject.x, y: gameObject.y };
        this.width = (existsImage) ? sprite.texture.width * gameObject.tileX : 50 * gameObject.tileX;
        this.height = (existsImage) ? sprite.texture.height * gameObject.tileY : 50 * gameObject.tileY;
        this.angle = gameObject.angle;
        // Sprite properties
        sprite.visible = gameObject.spriteOn;
        sprite.anchor.set(0.5);
        sprite.tint = "0x" + String(gameObject.color).substr(1);
        sprite.alpha = gameObject.opacity;
        sprite.scroll = { x: gameObject.scrollX, y: gameObject.scrollY }; //new properties
        sprite.scale.x = (gameObject.flipX) ? -gameObject.scaleX : gameObject.scaleX;
        sprite.scale.y = (gameObject.flipY) ? -gameObject.scaleY : gameObject.scaleY;
        // sprite.previousTilePos = { x: 0.0, y: 0.0 };
        this.addChild(sprite);
        // Text properties
        const w = Math.abs(sprite.width * sprite.scale.x);
        const style = new PIXI.TextStyle({
            fontFamily: gameObject.font,
            fill: gameObject.fill,
            fontSize: gameObject.size,
            fontStyle: gameObject.style,
            align: gameObject.align.toLowerCase(),
            wordWrap: true,
            wordWrapWidth: w,
            padding: w
        });
        const text = new PIXI.Text(gameObject.text, style);
        text.visible = gameObject.textOn;
        var pivot = { x: 0, y: 0 };
        switch (gameObject.align) {
            case "Left": pivot = { x: -w / 2, y: text.height / 2 }; break;
            case "Right": pivot = { x: w / 2 - text.width, y: text.height / 2 }; break;
            case "Center": pivot = { x: -text.width / 2, y: text.height / 2 }; break;
        }
        text.position = { x: pivot.x + gameObject.offsetX, y: pivot.y + gameObject.offsetY };
        text.scale.y = -1;
        this.addChild(text);

        this.sprite = sprite;
        this.text = text;
        this.gameObject = gameObject;
        //this.previousPos = { x: gameObject.x, y: gameObject.y };
        this.saveState()
    }

    saveState() {
        this.previous = {
            x: this.position.x,
            y: this.position.y,
            angle: this.angle
        };
        const scroll = Boolean((this.gameObject.scrollX != 0) || (this.gameObject.scrollY != 0));
        if (scroll) {
            this.previous.sprite = { tilePositionX: this.sprite.tilePosition.x, tilePositionY: this.sprite.tilePosition.y };
        }
    }

    update(deltaTime) {
        this.saveState();
        const scroll = Boolean((this.gameObject.scrollX != 0) || (this.gameObject.scrollY != 0));
        if (scroll) {
            this.sprite.tilePosition.x += this.sprite.scroll.x * deltaTime;
            this.sprite.tilePosition.y += this.sprite.scroll.y * deltaTime;
        }
    }

    draw(lagOffset) {
        this.x = this.x * lagOffset + this.previous.x * (1 - lagOffset);
        this.y = this.y * lagOffset + this.previous.y * (1 - lagOffset);
        if (this.scroll) {
            this.sprite.tilePosition.x = this.sprite.tilePosition.x * lagOffset + this.previous.sprite.tilePositionX * (1 - lagOffset);
            this.sprite.tilePosition.y = this.sprite.tilePosition.y * lagOffset + this.previous.sprite.tilePositionY * (1 - lagOffset);
        }
    }
}
