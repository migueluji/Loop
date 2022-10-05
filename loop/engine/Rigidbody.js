class Rigidbody {

    constructor(gameObject) {
        var actor = gameObject.actor;
        var rigidbody = gameObject.engine.physics.world.createBody({ userData: { name: gameObject.name, tags: actor.tags } });
        rigidbody._currentPhysics = {
            physicsOn: actor.physicsOn,
            type: actor.type.toLowerCase(),
            velocityX: actor.velocityX,
            velocityY: actor.velocityY,
            angularVelocity: actor.angularVelocity
        }
        return (rigidbody);
    }

    static convertToSensor(gameObject) {
        gameObject.rigidbody._currentPhysics = { // save current physic properties
            type: gameObject.rigidbody.m_type,
            velocityX: gameObject.rigidbody.getLinearVelocity().x,
            velocityY: gameObject.rigidbody.getLinearVelocity().y,
            angularVelocity: gameObject.rigidbody.getAngularVelocity()
        }
        gameObject.rigidbody.setDynamic();
        gameObject.rigidbody.getFixtureList().setSensor(true);
        gameObject.rigidbody.setGravityScale(0);
        gameObject.velocityX = gameObject.velocityY = gameObject.angularVelocity = 0;
    }

    static convertToRigidbody(gameObject) {
        gameObject.type = gameObject.rigidbody._currentPhysics.type;
        gameObject.rigidbody.getFixtureList().setSensor(false);
        gameObject.rigidbody.setGravityScale(1);
        gameObject.velocityX = gameObject.rigidbody._currentPhysics.velocityX;
        gameObject.velocityY = gameObject.rigidbody._currentPhysics.velocityY;
        gameObject.angularVelocity = gameObject.rigidbody._currentPhysics.angularVelocity;
    }
}
