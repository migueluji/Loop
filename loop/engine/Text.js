class Text {

    constructor(actor) {
        var textExpression = actor.text.replace(/Me./g, actor.name + "."); // chage Me by actor's name
        textExpression = textExpression.replace(/{/g, "").replace(/}/g, ""); // delete { and }
        const style = new PIXI.TextStyle({
            wordWrap: true,
            wordWrapWidth: actor.width,
            padding: actor.width
        });
        var text = new PIXI.Text(textExpression, style);
        text.anchor.set(0.5);
        text.position = { x: actor.offsetX, y: actor.offsetY };
        text.scale.y = -1;
        text.expression = textExpression;
        return (text);
    }
}
