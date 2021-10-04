class Render {

    constructor(gameObjects, gameProperties) {
        // Create View
        const app = new PIXI.Application({
            width: gameProperties.displayWidth,
            height: gameProperties.displayHeight,
            backgroundColor: PIXI.utils.string2hex(gameProperties.backgroundColor),
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
        gameObjects.forEach(gameObject => {
            this.stage.addChild(gameObject.container);
        });
        this.gameObjects=gameObjects;
    }

    integrate(lagOffset) {
        this.app.renderer.backgroundColor= "#ff00ff";
        this.gameObjects.forEach(gameObject => {
            gameObject.integrate(lagOffset);
        });
    }
}