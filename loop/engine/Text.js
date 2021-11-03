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
        text.anchor.set(0.5);
        var pivot = { x: 0, y: 0 };
        switch (actor.align) {
            case "Left": pivot.x = - actor.width / 2 + text.width / 2; break;
            case "Right": pivot.x =  actor.width / 2 - text.width / 2; break;
        }
        text.position = { x: pivot.x + actor.offsetX, y: pivot.y + actor.offsetY };
        text.scale.y = -1;
        text.expression = textExpression;
        return (text);
    }
}
