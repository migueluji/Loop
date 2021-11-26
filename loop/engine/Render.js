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

    addStage(scene) {
        this[scene] = new PIXI.Container();
        this[scene].sortableChildren = true;
        this[scene].interactive = true;
        this.stage.addChild(this[scene]);
    }

    removeStage(scene) {
        this.stage.removeChild(this[scene]);
    }

    update(lagOffset) {
        this.gameLevel.update(this.renderer, this.stage);
        this.gameObjects.forEach(gameObject => { gameObject.integrate(lagOffset) });
        // render scene
        this.renderer.render(this.stage);
    }
}