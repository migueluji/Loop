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
        this.fixtureDef = {
            friction: actor.friction, density: actor.density, restitution: actor.restitution,
            shape: Body.getCollider(actor.collider,actor.width,actor.height),
        };
    }

    static getCollider (type,width,height){
        switch (type) {
            case "Circle": {
                var radius = (width > height) ? width / 2 * Physics.metersPerPixel : height / 2 * Physics.metersPerPixel;
                return planck.Circle(radius); break;
            }
            case "Box": {
                return planck.Box((width / 2) * Physics.metersPerPixel, (height / 2) * Physics.metersPerPixel); break;
            };
        };
    }
}
