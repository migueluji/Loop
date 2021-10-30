class Physics {
    static pixelsPerMeter = 50;
    static metersPerPixel = 1 / this.pixelsPerMeter;

    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        // create physics world
        this.world = planck.World({
            gravity: planck.Vec2(engine.gameProperties.gravityX, engine.gameProperties.gravityY),
            allowSleep: false
        });
        // add objects
        this.gameObjects.forEach(gameObject => {
            gameObject.rigidbody = this.world.createBody(gameObject.body.bodyDef);
            gameObject.rigidbody.createFixture(gameObject.body.fixtureDef);
        })

    }

    fixedStep(dt) {
        this.world.step(dt / 1000);
        this.world.on('post-solve', this.contactHandler.bind(this));
        this.gameObjects.forEach(gameObject => { gameObject.fixedStep() });
    }

    contactHandler(contact) {
        var userDataA = contact.getFixtureA().getBody().getUserData();
        var userDataB = contact.getFixtureB().getBody().getUserData();
        var gameObjectA = this.gameObjects.get(userDataA.name);
        var gameObjectB = this.gameObjects.get(userDataB.name);

        if (gameObjectA.collision)
            Object.keys(gameObjectA.collision).forEach(tag => {
                gameObjectA.collision[tag] = (userDataB.tags.indexOf(tag) != -1) ? true : false;
            })
        if (gameObjectB.collision)
            Object.keys(gameObjectB.collision).forEach(tag => {
                gameObjectB.collision[tag] = (userDataA.tags.indexOf(tag) != -1) ? true : false;
            })
    }
}