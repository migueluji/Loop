class Body {

    constructor(actor) {
        this.type = actor.type.toLowerCase();
        this.position = { x: actor.x * Physics.metersPerPixel, y: actor.y * Physics.metersPerPixel };
        this.angle = Utils.radians(actor.angle);
        this.linearVelocity = { x: actor.velocityX * Physics.metersPerPixel, y: actor.velocityY * Physics.metersPerPixel };
        this.fixedRotation = actor.fixedAngle;
        this.angularVelocity = actor.angularVelocity;
        this.linearDamping = actor.dampingLinear;
        this.angularDamping = actor.dampingAngular;
        this.userData = { name: actor.name, tags: actor.tags };
    }
}
