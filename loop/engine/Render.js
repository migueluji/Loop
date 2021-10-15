class Render {

    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        // Create View
        this.gameProperties = engine.scope["Game"];
        // this.app = new PIXI.Application({
        //     width: this.gameProperties.displayWidth,
        //     height: this.gameProperties.displayHeight,
        // });
        this.renderer = new PIXI.Renderer({
            width: this.gameProperties.displayWidth,
            height: this.gameProperties.displayHeight,
            view: document.getElementById('main')
        });
        //document.body.appendChild(this.app.view);
        //document.body.appendChild(this.renderer.view);
        // Create stage
        this.stage = new PIXI.Container();
        this.updateCamera();
        // add stage to app
        //this.app.stage.addChild(this.stage);
        // Add Actors to stage
        this.gameObjects.forEach(gameObject => {
            this.stage.addChild(gameObject.container);
        });
    }

    update(lagOffset) {
        this.updateCamera();
        this.gameObjects.forEach(gameObject => {
            gameObject.integrate(lagOffset);
        });
        this.renderer.render(this.stage);
    }

    updateCamera() {
       // this.app.renderer.backgroundColor = PIXI.utils.string2hex(this.gameProperties.backgroundColor);
        this.renderer.backgroundColor = PIXI.utils.string2hex(this.gameProperties.backgroundColor);
        this.stage.position = { x: this.gameProperties.displayWidth / 2.0 - this.gameProperties.cameraX, y: this.gameProperties.displayHeight / 2.0 + this.gameProperties.cameraY };
        this.stage.scale = { x: this.gameProperties.cameraZoom, y: -this.gameProperties.cameraZoom };
        this.stage.angle = this.gameProperties.cameraAngle;
    }
}