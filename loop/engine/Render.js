class Render {

    constructor(gameObjects, gameProperties) {
        // Create View
        const app = new PIXI.Application({
            width: gameProperties.displayWidth,
            height: gameProperties.displayHeight,
            backgroundColor: "0x" + String(gameProperties.backgroundColor).substr(1),
        });
        document.body.appendChild(app.view);
        this.app=app;
        // Create Stage
        this.stage = new PIXI.Container();
        this.stage.position = { x: gameProperties.displayWidth / 2.0, y: gameProperties.displayHeight / 2.0 };
        this.stage.scale = { x: gameProperties.cameraZoom, y: -gameProperties.cameraZoom };
        this.stage.angle = gameProperties.cameraAngle;
        app.stage.addChild(this.stage);
        // Add Actors to stage
        gameObjects.forEach((go,i) => {
            gameObjects[i].spriteText = new SpriteText(go);
            this.stage.addChild(gameObjects[i].spriteText);
        });
        this.gameObjects=gameObjects;
    }

    draw(lagOffset) {
        this.gameObjects.forEach(gameObject => {
            gameObject.spriteText.draw(lagOffset);
        });
    }

}