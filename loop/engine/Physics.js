class Physics {
    static pixelsPerMeter = 50;
    static metersPerPixel = 1 / this.pixelsPerMeter;

    constructor(engine, gameObjects) {
        this.engine = engine;
        this.gameObjects = gameObjects;
        this.physicsOn;
        this.world = planck.World({ allowSleep: false });
        this.world.on('begin-contact', this.collisionBeginHandler.bind(this));
        this.world.on('end-contact', this.collisionEndHandler.bind(this));
    }

    fixedStep(dt) {
        if (this.engine.gameState.physicsOn != this.physicsOn) { // if the game physics change 
            this.physicsOn = this.engine.gameState.physicsOn;
            this.gameObjects.forEach(gameObject => {
                if (this.physicsOn) (gameObject.physicsOn) ? Rigidbody.convertToRigidbody(gameObject) : Rigidbody.convertToSensor(gameObject);
                else Rigidbody.convertToSensor(gameObject);
            })
        }
        this.world.step(dt);
        this.gameObjects.forEach(gameObject => {
            gameObject.fixedStep();
        })
    }

    collisionBeginHandler(contact) {
        var userDataA = contact.getFixtureA().getBody().getUserData();
        var userDataB = contact.getFixtureB().getBody().getUserData();
        var gameObjectA = this.gameObjects.get(userDataA.name);
        var gameObjectB = this.gameObjects.get(userDataB.name);
        if (gameObjectA.collision) {
            //  console.log("collision BEGIN A");
            Object.keys(gameObjectA.collision).forEach(tag => {
                if (userDataB.tags.indexOf(tag) != -1) gameObjectA.collision[tag].add(gameObjectB.name);
            })
        }
        if (gameObjectB.collision) {
            //   console.log("collision BEGIN B");
            Object.keys(gameObjectB.collision).forEach(tag => {
                if (userDataA.tags.indexOf(tag) != -1) gameObjectB.collision[tag].add(gameObjectA.name);
            })
        }
    }

    collisionEndHandler(contact) {
        var userDataA = contact.getFixtureA().getBody().getUserData();
        var userDataB = contact.getFixtureB().getBody().getUserData();
        var gameObjectA = this.gameObjects.get(userDataA.name);
        var gameObjectB = this.gameObjects.get(userDataB.name);
        if (gameObjectA.collision) {
            //     console.log("collision END A");
            Object.keys(gameObjectA.collision).forEach(tag => {
                if (userDataB.tags.indexOf(tag) != -1) gameObjectA.collision[tag].delete(gameObjectB.name);
            })
        }
        if (gameObjectB.collision) {
            //    console.log("collision END B");
            Object.keys(gameObjectB.collision).forEach(tag => {
                if (userDataA.tags.indexOf(tag) != -1) gameObjectB.collision[tag].delete(gameObjectA.name);
            })
        }
    }
}