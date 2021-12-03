class Render {

    constructor(gameLevel) {
        this.renderer = new PIXI.Renderer({  // create renderer
            width: gameLevel.displayWidth, height: gameLevel.displayHeight,
            backgroundColor: PIXI.utils.string2hex(gameLevel.backgroundColor),
            view: document.getElementById('main')
        });
        // create stage
        this.stage = new PIXI.Container();
        this.stage.sortableChildren = true;
        this.stage.interactive = true;
        this.stage.position = {
            x: gameLevel.displayWidth / 2.0 - gameLevel.cameraX,
            y: gameLevel.displayHeight / 2.0 + gameLevel.cameraY
        };
        this.stage.scale = { x: gameLevel.cameraZoom, y: -gameLevel.cameraZoom };
    }

    update(engine, lagOffset) {
        engine.gameObjects.forEach(gameObject => { gameObject.update(lagOffset) });
        this.renderer.render(engine.render.stage);     // render scene
    }
}