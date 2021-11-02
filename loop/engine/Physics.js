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
            if (gameObject.physicsOn) {
                gameObject.rigidbody = this.world.createBody(gameObject.body.bodyDef);
                gameObject.rigidbody.createFixture(gameObject.body.fixtureDef);
            }
            else {
                gameObject.rigidbody = this.world.createBody(gameObject.body.bodySensor);
                gameObject.rigidbody.setGravityScale(0);
                gameObject.rigidbody.createFixture(gameObject.body.fixtureSensor);
            }
        })
    }

    fixedStep(dt) {
        this.world.on('begin-contact', this.collisionBeginHandler.bind(this));
        this.world.on('end-contact', this.collisionEndHandler.bind(this));
        this.world.step(dt / 1000);
        //   this.world.on('pre-solve', this.collisionEndHandler.bind(this));
        //   this.world.on('post-solve', this.collisionBeginHandler.bind(this));
        this.gameObjects.forEach(gameObject => { gameObject.fixedStep() });
    }
    collisionEndHandler(contact) {
        var userDataA = contact.getFixtureA().getBody().getUserData();
        var userDataB = contact.getFixtureB().getBody().getUserData();
        var gameObjectA = this.gameObjects.get(userDataA.name);
        var gameObjectB = this.gameObjects.get(userDataB.name);
        if (userDataB.tags == "player") console.log("End contact...", userDataA.name, userDataB.name);
        if (gameObjectA.collision)
            Object.keys(gameObjectA.collision).forEach(tag => {
                if (userDataB.tags.indexOf(tag) != -1) gameObjectA.collision[tag] = false;
            })
        if (gameObjectB.collision)
            Object.keys(gameObjectB.collision).forEach(tag => {
                if (userDataA.tags.indexOf(tag) != -1) gameObjectB.collision[tag] = false;
            })
    }
    collisionBeginHandler(contact) {
        var userDataA = contact.getFixtureA().getBody().getUserData();
        var userDataB = contact.getFixtureB().getBody().getUserData();
        var gameObjectA = this.gameObjects.get(userDataA.name);
        var gameObjectB = this.gameObjects.get(userDataB.name);
        console.log("Begin contact...", userDataA.name, userDataB.name);
        if (gameObjectA.collision)
            Object.keys(gameObjectA.collision).forEach(tag => {
                if (userDataB.tags.indexOf(tag) != -1) gameObjectA.collision[tag] = true;
            })
        if (gameObjectB.collision)
            Object.keys(gameObjectB.collision).forEach(tag => {
                if (userDataA.tags.indexOf(tag) != -1) gameObjectB.collision[tag] = true;
            })
    }

    // contactHandler(contact) {
    //     var userDataA = contact.getFixtureA().getBody().getUserData();
    //     var userDataB = contact.getFixtureB().getBody().getUserData();
    //     var gameObjectA = this.gameObjects.get(userDataA.name);
    //     var gameObjectB = this.gameObjects.get(userDataB.name);
    //     console.log("Post solve..." ,userDataA,userDataB);
    //     if (gameObjectA.collision)
    //         Object.keys(gameObjectA.collision).forEach(tag => {
    //             gameObjectA.collision[tag] = (userDataB.tags.indexOf(tag) != -1) ? true : false;
    //         })
    //     if (gameObjectB.collision)
    //         Object.keys(gameObjectB.collision).forEach(tag => {
    //             gameObjectB.collision[tag] = (userDataA.tags.indexOf(tag) != -1) ? true : false;
    //         })
    // }
}