class Render {

    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        this.gameProperties = engine.gameProperties;
        // create renderer
        this.renderer = new PIXI.Renderer({
            width: this.gameProperties.displayWidth,
            height: this.gameProperties.displayHeight,
            view: document.getElementById('main')
        });
        // create stage
        this.stage = new PIXI.Container();
        this.stage.sortableChildren = true;
        this.stage.interactive = true;
    }

    update(lagOffset) {
        this.renderer.backgroundColor = PIXI.utils.string2hex(this.gameProperties.backgroundColor);
        this.stage.position = { x: this.gameProperties.displayWidth / 2.0 - this.gameProperties.cameraX, y: this.gameProperties.displayHeight / 2.0 + this.gameProperties.cameraY };
        this.stage.scale = { x: this.gameProperties.cameraZoom, y: -this.gameProperties.cameraZoom };
        this.stage.angle = this.gameProperties.cameraAngle;
        // update gameObjects
        this.gameObjects.forEach(gameObject => { gameObject.integrate(lagOffset) });
        // render scene
        this.renderer.render(this.stage);
    }
}