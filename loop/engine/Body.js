class Body {
    pixelsPerMeter = 50;
    metersPerPixel = 1 / this.pixelsPerMeter;

    constructor(actor) {
        this.bodyDef = {
            type: actor.type.toLowerCase(),
            position: { x: actor.x * this.metersPerPixel, y: actor.y * this.metersPerPixel },
            angle: actor.angle,
            linearVelocity: { x: actor.velocityX, y: actor.velocityY },
            fixedRotation: actor.fixedRotation, angularVelocity: actor.angularVelocity,
            angularDamping: actor.dampingLinear, linearDamping: actor.dampingAngular
        }
        this.fixtureDef = {
            friction: actor.friction, density: actor.density, restitution: actor.restitution,
            shape: [
                planck.Vec2(-actor.width / 2 * this.metersPerPixel, -actor.height / 2 * this.metersPerPixel),
                planck.Vec2(-actor.width / 2 * this.metersPerPixel, actor.height / 2 * this.metersPerPixel),
                planck.Vec2(actor.width / 2 * this.metersPerPixel, actor.height / 2 * this.metersPerPixel),
                planck.Vec2(actor.width / 2 * this.metersPerPixel, -actor.height / 2 * this.metersPerPixel),
            ]
        };
    }
}
