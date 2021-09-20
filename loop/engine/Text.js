class Text {

    constructor(actor) {
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

    }

    draw(lagOffset) {

    }
}
