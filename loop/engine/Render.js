class Render {

    constructor() {
        this.renderer = new PIXI.Renderer({ view: document.getElementById('main') });
        this.stage = new PIXI.Container();
        this.stage.sortableChildren = true;
        this.stage.interactive = true;
    }

    update(engine) {
        engine.gameObjects.forEach(gameObject => { gameObject.update() });
        this.renderer.render(engine.render.stage); // render scene
    }
}