class Render {

    constructor(gameLevel) {
        this.renderer = new PIXI.Renderer({  // Create renderer
            width: gameLevel.displayWidth, height: gameLevel.displayHeight,
            backgroundColor: PIXI.utils.string2hex(gameLevel.backgroundColor),
            view: document.getElementById('main')
        });
        // Create stage
        this.stage = new PIXI.Container();
        this.stage.sortableChildren = true;
        this.stage.interactive = true;
        this.stage.position = {
            x: gameLevel.displayWidth / 2.0 - gameLevel.cameraX,
            y: gameLevel.displayHeight / 2.0 + gameLevel.cameraY
        };
        this.stage.scale = { x: gameLevel.cameraZoom, y: -gameLevel.cameraZoom };
        this.stage.angle = gameLevel.cameraAngle;
        // Stage for world objects
        this.stageWorld = new PIXI.Container();
        this.stageWorld.sortableChildren = true;
        this.stage.addChild(this.stageWorld);
        // Stage for screen objects
        this.stageScreen = new PIXI.Container();
        this.stageScreen.sortableChildren = true;
        this.stage.addChild(this.stageScreen);
    }

    update(engine) {
        engine.gameObjects.forEach(gameObject => { gameObject.update() });
        this.renderer.render(engine.render.stage);     // render scene
    }
}