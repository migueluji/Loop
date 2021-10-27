class Body {

    constructor(actor) {
        this.bodyDef = {
            type: actor.type.toLowerCase(),
            position: { x: actor.x * Physics.metersPerPixel, y: actor.y * Physics.metersPerPixel },
            angle: actor.angle,
            linearVelocity: { x: actor.velocityX, y: actor.velocityY },
            fixedRotation: actor.fixedAngle, angularVelocity: actor.angularVelocity,
            angularDamping: actor.dampingLinear, linearDamping: actor.dampingAngular,
            bullet: true
        }
        this.fixtureDef = {
            friction: actor.friction, density: actor.density, restitution: actor.restitution,
            shape: [
                planck.Vec2((-actor.width / 2) * Physics.metersPerPixel, (-actor.height / 2) * Physics.metersPerPixel),
                planck.Vec2((actor.width / 2) * Physics.metersPerPixel, (-actor.height / 2) * Physics.metersPerPixel),
                planck.Vec2((actor.width / 2) * Physics.metersPerPixel, (actor.height / 2) * Physics.metersPerPixel),
                planck.Vec2((-actor.width / 2) * Physics.metersPerPixel, (actor.height / 2) * Physics.metersPerPixel),
            ]
        };
        console.log(this.bodyDef, this.fixtureDef);
    }
}
