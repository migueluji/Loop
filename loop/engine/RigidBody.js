class Rigidbody {
    pixelsPerMeter = 50;
    metersPerPixel = 1 / this.pixelsPerMeter;

    constructor(actor) {
        this.body = { position: { x: actor.x * this.metersPerPixel, y: actor.y * this.metersPerPixel }, angle: actor.angle };
        this.shape =  [
            planck.Vec2(-actor.width/2*this.metersPerPixel, -actor.height/2*this.metersPerPixel),
            planck.Vec2(-actor.width/2*this.metersPerPixel, actor.height/2*this.metersPerPixel),
            planck.Vec2(actor.width/2*this.metersPerPixel, actor.height/2*this.metersPerPixel),
            planck.Vec2(actor.width/2*this.metersPerPixel, -actor.height/2*this.metersPerPixel),
        ];
        this.fixtureOpt = { friction: actor.friction, density: actor.density, restitution: actor.restitution };
        //console.log(this.body);
        // switch (actor.type) {
        //     case "Dynamic": this.body.setDynamic(); break;
        //     case "Kinematic": this.body.setKinematic(); break;
        //     default: this.body.setStatic();
        // }
        // this.body = {
        //     position: { x: actor.x * this.metersPerPixel, y: actor.y * this.metersPerPixel },
        //     angle: actor.angle,
        //     linearVelocity: { x: actor.velocityX, y: actor.velocityY },
        //     fixedRotation: actor.fixedRotation, angularVelocity: actor.angularVelocity,
        //     angularDamping: actor.dampingLinear, linearDamping: actor.dampingAngular
        // }
        //this.fixture = new planck.Fixture();
        //console.log(this.fixture);


        //this.body.createFixture(this.fixture);
        //console.log("Body", actor, this.body, this.fixture);
    }
}
