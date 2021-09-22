class GameObject {

    constructor(actor) {
        this.container = new Container(actor);
        this.rule = new Rule(actor);
        console.log(this);
    }
    get x() { return this.container.x };
    set x(value) { this.container.x = value };

    get y() { return this.container.y };
    set y(value) { this.container.y = value };

    get width() { return Math.abs(this.container.sprite.width * this.container.sprite.scale.x) };
    set width(value) { this.sprite.scale.x = value / this.sprite.width };

    get height() { return Math.abs(this.container.sprite.height * this.container.sprite.scale.y) };
    set height(value) { this.sprite.scale.y = value / this.sprite.height };

    get scaleX() { return this.container.sprite.scale.x };
    set scaleX(value) { this.container.sprite.scale.x = value };

    get scaleY() { return this.container.sprite.scale.y };
    set scaleY(value) { this.container.sprite.scale.y = value };

    get angle() { return this.container.angle };
    set angle(value) { this.container.angle = value };

    get spriteOn() { return this.container.sprite.visible };
    set spriteOn(value) { this.container.sprite.visible = value };

    get image() { return this.container.sprite.image };
    set image(value) {
        const existsImage = Boolean(player.file.loader.resources[value]);
        this.container.sprite.texture = (existsImage) ? player.file.loader.resources[value].texture : PIXI.Texture.WHITE;
    };

    get color() { return PIXI.utils.hex2string(this.container.sprite.tint) };
    set color(value) { this.container.sprite.tint = PIXI.utils.string2hex(value) };

    get opacity() { return this.container.sprite.alpha };
    set opacity(value) { this.container.sprite.alpah = value };

    get flipX() { return (Math.sign(this.container.sprite.scale.x) == 1) ? false : true };
    set flipX(value) { this.container.sprite.scale.x *= (value) ? -1 : 1 };

    get flipY() { return (Math.sign(this.container.sprite.scale.y) == 1) ? false : true };
    set flipY(value) { this.container.sprite.scale.y *= (value) ? -1 : 1 };

    get scrollX() { return this.container.sprite.scrollX };
    set scrollX(value) { this.container.sprite.scrollX = value };

    get scrollY() { return this.container.sprite.scrollY };
    set scrollY(value) { this.container.sprite.scrollY = value }

    get tileX() { return this.container.sprite.tileX };
    set tileX(value) {
        const existsImage = Boolean(player.file.loader.resources[this.container.sprite.image]);
        this.container.sprite.tileX = value;
        this.container.sprite.width = (existsImage) ? sprite.texture.width * value : 50 * value;
    };

    get tileY() { return this.container.sprite.tileY };
    set tileY(value) {
        const existsImage = Boolean(player.file.loader.resources[this.container.sprite.image]);
        this.container.sprite.tileY = value;
        this.container.sprite.height = (existsImage) ? sprite.texture.height * value : 50 * value;
    };

    get textOn() { return this.container.text.visible };
    set textOn(value) { this.container.text.visible = value };

    get text() { return this.container.text.text };
    set text(value) { this.container.text.text = value };

    get font() { return this.container.text.style.fontFamily };
    set font(value) { this.container.text.style.fontFamily = value };

    get size() { return this.container.text.style.fontSize };
    set size(value) { this.container.text.style.fontSize = value };

    get fill() { return this.container.text.style.fill };
    set fill(value) { this.container.text.style.fill = value };

    get style() { return this.container.text.style.fontStyle };
    set style(value) { this.container.text.style.fontStyle = value };

    get align() { return this.container.text.style.align };
    set align(value) { this.container.text.style.align = value.toLowerCase() };

    get offsetX() { return this.container.text.position.x };
    set offsetX(value) { 
        const w = Math.abs(this.container.prite.width * this.container.sprite.scale.x);
        var pivot = { x: 0, y: 0 };
        switch (this.container.text.style.align) {
            case "left": pivot = { x: -w / 2, y: this.container.text.height / 2 }; break;
            case "right": pivot = { x: w / 2 - this.container.text.width, y: this.container.text.height / 2 }; break;
            case "center": pivot = { x: -this.container.text.width / 2, y: this.container.text.height / 2 }; break;
        }
        this.container.text.position.x = pivot.x + value ;
    };

    get offsetY() { return this.container.text.position.y };
    set offsetY(value) { 
        const w = Math.abs(this.container.prite.width * this.container.sprite.scale.x);
        var pivot = { x: 0, y: 0 };
        switch (this.container.text.style.align) {
            case "left": pivot = { x: -w / 2, y: this.container.text.height / 2 }; break;
            case "right": pivot = { x: w / 2 - this.container.text.width, y: this.container.text.height / 2 }; break;
            case "center": pivot = { x: -this.container.text.width / 2, y: this.container.text.height / 2 }; break;
        }
        this.container.text.position.y = pivot.y + value ;
    };

}