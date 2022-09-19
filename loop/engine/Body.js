class Body {

    constructor(actor) {
        this.type= actor.type.toLowerCase();
        this.position= { x: actor.x * Physics.metersPerPixel, y: actor.y * Physics.metersPerPixel };
        this.angle= actor.angle * Math.PI / 180;
        this.linearVelocity= { x: actor.velocityX * Physics.metersPerPixel, y: actor.velocityY * Physics.metersPerPixel },
        this.fixedRotation= actor.fixedAngle, 
        this.angularVelocity= actor.angularVelocity,
        this.linearDamping=actor.dampingLinear;
        this.angularDamping= actor.dampingAngular,
        this.userData= { name: actor.name, tags: actor.tags }

        // this.bodyDef = {
        //     type: actor.type.toLowerCase(),
        //     position: { x: actor.x * Physics.metersPerPixel, y: actor.y * Physics.metersPerPixel },
        //     angle: actor.angle * Math.PI / 180,
        //     linearVelocity: { x: actor.velocityX * Physics.metersPerPixel, y: actor.velocityY * Physics.metersPerPixel },
        //     fixedRotation: actor.fixedAngle, angularVelocity: actor.angularVelocity,
        //     linearDamping: actor.dampingLinear, angularDamping: actor.dampingAngular,
        //     userData: { name: actor.name, tags: actor.tags }
        // }
        // this.fixtureDef = {
        //     friction: actor.friction, density: actor.density, restitution: actor.restitution,
        //     //shape: this.getCollider(actor.collider, actor.width, actor.height),
        // };
    }

    // getCollider(type, width, height) {
    //     switch (type) {
    //         case "Circle": {
    //             var radius = (width > height) ? width / 2 * Physics.metersPerPixel : height / 2 * Physics.metersPerPixel;
    //             return planck.Circle(radius); break;
    //         }
    //         case "Box": {
    //             return planck.Box((width / 2) * Physics.metersPerPixel, (height / 2) * Physics.metersPerPixel); break;
    //         };
    //     };
    // }
}
