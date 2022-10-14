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
        console.log("physics", this.engine.gameState.physicsOn);
        if ((this.engine.gameState.physicsOn != this.physicsOn)) { // if the game physics change 
            this.physicsOn = this.engine.gameState.physicsOn;
            this.gameObjects.forEach(gameObject => {
                if (this.physicsOn && gameObject.physicsOn) Rigidbody.convertToRigidbody(gameObject);
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
            Object.keys(gameObjectA.collision).forEach(tag => {
                if (userDataB.tags.indexOf(tag) != -1) gameObjectA.collision[tag].add(gameObjectB.name);
            })
        }
        if (gameObjectB.collision) {
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
            Object.keys(gameObjectA.collision).forEach(tag => {
                if (userDataB.tags.indexOf(tag) != -1) gameObjectA.collision[tag].delete(gameObjectB.name);
            })
        }
        if (gameObjectB.collision) {
            Object.keys(gameObjectB.collision).forEach(tag => {
                if (userDataA.tags.indexOf(tag) != -1) gameObjectB.collision[tag].delete(gameObjectA.name);
            })
        }
    }
}