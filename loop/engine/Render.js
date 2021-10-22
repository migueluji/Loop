class Render {

    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        this.gameProperties = engine.gameProperties;
        this.renderer = new PIXI.Renderer({
            width: this.gameProperties.displayWidth,
            height: this.gameProperties.displayHeight,
            view: document.getElementById('main')
        });
        this.stage = new PIXI.Container();
        this.stage.sortableChildren = true;
        this.updateCamera();
        this.gameObjects.forEach(gameObject => { this.stage.addChild(gameObject.container); });
    }

    update(lagOffset) {
        this.updateCamera();
        this.gameObjects.forEach(gameObject => { gameObject.integrate(lagOffset); });
        this.renderer.render(this.stage);
    }

    updateCamera() {
        this.renderer.backgroundColor = PIXI.utils.string2hex(this.gameProperties.backgroundColor);
        this.stage.position = { x: this.gameProperties.displayWidth / 2.0 - this.gameProperties.cameraX, y: this.gameProperties.displayHeight / 2.0 + this.gameProperties.cameraY };
        this.stage.scale = { x: this.gameProperties.cameraZoom, y: -this.gameProperties.cameraZoom };
        this.stage.angle = this.gameProperties.cameraAngle;
    }

}