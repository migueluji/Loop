class Render {

    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        // Create View
        this.gameProperties = engine.scope["Game"];
        const app = new PIXI.Application({
            width: this.gameProperties.displayWidth,
            height: this.gameProperties.displayHeight,
            backgroundColor: PIXI.utils.string2hex(this.gameProperties.backgroundColor),
        });
        document.body.appendChild(app.view);
        this.app=app;
        // Create Stage
        this.stage = new PIXI.Container();
        this.stage.position = { x: this.gameProperties.displayWidth / 2.0, y: this.gameProperties.displayHeight / 2.0 };
        this.stage.scale = { x: this.gameProperties.cameraZoom, y: -this.gameProperties.cameraZoom };
        this.stage.angle = this.gameProperties.cameraAngle;
        app.stage.addChild(this.stage);
        // Add Actors to stage
        this.gameObjects.forEach(gameObject => {
            this.stage.addChild(gameObject.container);
        });
    }

    integrate(lagOffset) {
        this.app.renderer.backgroundColor=  PIXI.utils.string2hex(this.gameProperties.backgroundColor);
        this.gameObjects.forEach(gameObject => {
            gameObject.integrate(lagOffset);
        });
    }
}