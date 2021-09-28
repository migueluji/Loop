class Text {

    constructor(actor) {
        var textExpression = actor.text.replace(/Me./g, actor.name + "."); // chage Me by actor's name
        textExpression = textExpression.replace(/{/g, ""); // delete {
        textExpression = textExpression.replace(/}/g, ""); // delete }

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
    
        var text = new PIXI.Text(textExpression, style);
        text.visible = actor.textOn;
        switch (actor.align) {
            case "Left": text.anchor.set(1.0,0.5); break;
            case "Right": text.anchor.set(0.0,0.5); break;
            case "Center": text.anchor.set(0.5,0.5); break;
        }
        text.position = { x: actor.offsetX, y: actor.offsetY };
        text.scale.y = -1;
        text.expression = textExpression;
        return (text);
    }
}
