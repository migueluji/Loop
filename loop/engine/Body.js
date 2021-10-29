class Body {

    constructor(actor) {
        this.bodyDef = {
            type: actor.type.toLowerCase(),
            position: { x: actor.x * Physics.metersPerPixel, y: actor.y * Physics.metersPerPixel },
            angle: actor.angle * Math.PI / 180,
            linearVelocity: { x: actor.velocityX, y: actor.velocityY },
            fixedRotation: actor.fixedAngle, angularVelocity: actor.angularVelocity,
            angularDamping: actor.dampingLinear, linearDamping: actor.dampingAngular,
            userData: { name: actor.name, tags: actor.tags }
        }
        var collider;
        switch (actor.collider) {
            case "Circle": {
                var radius = (actor.widht > actor.height) ? actor.width / 2 * Physics.metersPerPixel :
                    actor.height / 2 * Physics.metersPerPixel;
                collider = planck.Circle(radius); break;
            }
            case "Box": {
                collider = planck.Box((actor.width / 2) * Physics.metersPerPixel, (actor.height / 2) * Physics.metersPerPixel); break;
            };
        };
        this.fixtureDef = {
            friction: actor.friction, density: actor.density, restitution: actor.restitution,
            shape: collider,
        };
        console.log(actor.name, "BodyDef..", this.bodyDef.userData);
    }
}
