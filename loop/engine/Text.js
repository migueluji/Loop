class Text {

    constructor(actor) {
        const style = new PIXI.TextStyle({
            fontFamily: actor.font,
            fill: actor.fill,
            fontSize: actor.size,
            fontStyle: actor.style,
            align: actor.align.toLowerCase(),
            wordWrap: true,
            wordWrapWidth: actor.width,
            padding: actor.width
        });
        const text = new PIXI.Text(this.convertText(actor.text), style);
        text.visible = actor.textOn;
        var pivot = { x: 0, y: 0 };
        switch (actor.align) {
            case "Left": pivot = { x: -w / 2, y: text.height / 2 }; break;
            case "Right": pivot = { x: w / 2 - text.width, y: text.height / 2 }; break;
            case "Center": pivot = { x: -text.width / 2, y: text.height / 2 }; break;
        }
        text.position = { x: pivot.x + actor.offsetX, y: pivot.y + actor.offsetY };
        text.scale.y = -1;
        text.variables = ["this.x"];
        return (text);
    }

    convertText(text){

        text = "position $this.x: ";
        return(text);
    }
}
