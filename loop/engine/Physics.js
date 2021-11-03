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
            if (!gameObject.physicsOn) {
                gameObject.rigidbody.setDynamic();
                gameObject.rigidbody.getFixtureList().setSensor(true);
                gameObject.rigidbody.setGravityScale(0);
            }
        })
    }

    fixedStep(dt) {
        this.world.on('begin-contact', this.collisionBeginHandler.bind(this));
        this.world.on('end-contact', this.collisionEndHandler.bind(this));
        this.world.step(dt / 1000,10,10);
        this.gameObjects.forEach(gameObject => { gameObject.fixedStep() });
    }

    collisionEndHandler(contact) {
        var userDataA = contact.getFixtureA().getBody().getUserData();
        var userDataB = contact.getFixtureB().getBody().getUserData();
        var gameObjectA = this.gameObjects.get(userDataA.name);
        var gameObjectB = this.gameObjects.get(userDataB.name);
          if (gameObjectA.collision)
            Object.keys(gameObjectA.collision).forEach(tag => {
                if (userDataB.tags.indexOf(tag) != -1) gameObjectA.collision[tag].delete(gameObjectB.name);
            })
        if (gameObjectB.collision)
            Object.keys(gameObjectB.collision).forEach(tag => {
                if (userDataA.tags.indexOf(tag) != -1) gameObjectB.collision[tag].delete(gameObjectA.name);
            })
    }
    
    collisionBeginHandler(contact) {
        var userDataA = contact.getFixtureA().getBody().getUserData();
        var userDataB = contact.getFixtureB().getBody().getUserData();
        var gameObjectA = this.gameObjects.get(userDataA.name);
        var gameObjectB = this.gameObjects.get(userDataB.name);
        if (gameObjectA.collision)
            Object.keys(gameObjectA.collision).forEach(tag => {
                if (userDataB.tags.indexOf(tag) != -1) gameObjectA.collision[tag].add(gameObjectB.name);
            })
        if (gameObjectB.collision)
            Object.keys(gameObjectB.collision).forEach(tag => {
                if (userDataA.tags.indexOf(tag) != -1) gameObjectB.collision[tag].add(gameObjectA.name);
            })
    }
}