class Physics {

    constructor(engine) {
        this.gameObjects = engine.gameObjects;   
        this.pixelsPerMeter = 50;
        this.metersPerPixel = 1 / this.pixelsPerMeter;
        // create physics world
        this.world = planck.World({
            gravity: planck.Vec2(engine.gameProperties.gravityX,engine.gameProperties.gravityY)
        });
        // add objects
        this.gameObjects.forEach(gameObject =>{
            gameObject.rigidbody = this.world.createBody(gameObject.body.bodyDef);
            gameObject.rigidbody.createFixture(new planck.Polygon(gameObject.body.fixtureDef));
        })
    }

    fixedStep(dt) {
        this.world.step(dt/1000);
        this.gameObjects.forEach(gameObject => {gameObject.fixedStep()});
    }

}