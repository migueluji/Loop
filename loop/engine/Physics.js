class Physics {
    static pixelsPerMeter = 50;
    static metersPerPixel = 1 / this.pixelsPerMeter;
    
    constructor(engine) {
        this.gameObjects = engine.gameObjects;
        // create physics world
        this.world = planck.World({
            gravity: planck.Vec2(engine.gameProperties.gravityX, engine.gameProperties.gravityY)
        });
        // add objects
        this.gameObjects.forEach(gameObject => {
            gameObject.rigidbody = this.world.createBody(gameObject.body.bodyDef);
            gameObject.rigidbody.createFixture(gameObject.body.fixtureDef);
        })

    }

    fixedStep(dt) {
        this.world.step(dt / 1000);
        this.world.on('begin-contact',this.contactHandler.bind(this) );
        this.gameObjects.forEach(gameObject => { gameObject.fixedStep() });
    }

    contactHandler(contact){
        var bodyA= contact.getFixtureA().getBody();
        var bodyB = contact.getFixtureB().getBody();
        var objectA = this.gameObjects.get(bodyA.getUserData().name);
        var objectB = this.gameObjects.get(bodyB.getUserData().name);
        var value=false;
        // if ((bA.getUserData().tags=="block"))
        //     value = true;
        // else value =false;
        console.log(objectA.name,objectB.name, value);
    }
}