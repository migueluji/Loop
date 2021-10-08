class Render {

    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        // Create View
        this.gameProperties = engine.scope["Game"];
        this.app = new PIXI.Application({
            width: this.gameProperties.displayWidth,
            height: this.gameProperties.displayHeight,
        });
        document.body.appendChild(this.app.view);
        // Create stage
        this.stage = new PIXI.Container();
        this.updateCamera();
        this.app.stage.addChild(this.stage);
        // Add Actors to stage
        this.gameObjects.forEach(gameObject => {
            this.stage.addChild(gameObject.container);
        });
    }

    integrate(lagOffset) {
        this.updateCamera();
        this.gameObjects.forEach(gameObject => {
            gameObject.integrate(lagOffset);
        });
    }

    updateCamera() {
        this.app.renderer.backgroundColor = PIXI.utils.string2hex(this.gameProperties.backgroundColor);
        this.stage.position = { x: this.gameProperties.displayWidth / 2.0 - this.gameProperties.cameraX, y: this.gameProperties.displayHeight / 2.0 + this.gameProperties.cameraY };
        this.stage.scale = { x: this.gameProperties.cameraZoom, y: -this.gameProperties.cameraZoom };
        this.stage.angle = this.gameProperties.cameraAngle;
    }
}