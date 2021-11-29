class Render {

    constructor(gameLevel) {
        this.renderer = new PIXI.Renderer({  // create renderer
            width: gameLevel.displayWidth, height: gameLevel.displayHeight,
            view: document.getElementById('main')
        });
        // create stage
        this.stage = new PIXI.Container();
        this.stage.sortableChildren = true;
        this.stage.interactive = true;
    }

    update(engine, lagOffset) {
        engine.gameLevel.update(this.renderer, this.stage);
        engine.gameObjects.forEach(gameObject => { gameObject.update(lagOffset) });
        this.renderer.render(this.stage);     // render scene
    }
}