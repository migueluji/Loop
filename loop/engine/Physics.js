class Physics {
    static pixelsPerMeter = 50;
    static metersPerPixel = 1 / this.pixelsPerMeter;

    constructor(gameObjects) {
        this.gameObjects = gameObjects;
        this.world = planck.World({
            allowSleep: false
        });
        this.world.on('begin-contact', this.collisionBeginHandler.bind(this));
        this.world.on('end-contact', this.collisionEndHandler.bind(this));
    }

    fixedStep(engine, dt) {
        if (engine.physicsOn) {
            this.world.step(dt);
            if (engine.gameState.physicsOn) engine.gameObjects.forEach(gameObject => { gameObject.fixedStep() });
        }
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
}