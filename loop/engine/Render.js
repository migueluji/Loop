class Render {

    constructor(engine) {
        this.gameLevel = engine.gameLevel;
        this.gameObjects = engine.gameObjects;
        // create renderer
        this.renderer = new PIXI.Renderer({
            width: this.gameLevel.displayWidth,
            height: this.gameLevel.displayHeight,
            view: document.getElementById('main')
        });
        // create stage
        this.stage = new PIXI.Container();
        this.stage.sortableChildren = true;
        this.stage.interactive = true;
    }

    update(lagOffset) {
        this.gameLevel.update(this.renderer,this.stage);
        this.gameObjects.forEach(gameObject => { gameObject.integrate(lagOffset) });
        // render scene
        this.renderer.render(this.stage);
    }
}