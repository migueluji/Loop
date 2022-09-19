class Fixture {

    constructor(actor) {
        this.friction = actor.friction;
        this.density = actor.density;
        this.restitution = actor.restitution
        this.shape = this.setFixtureShape(actor.collider, actor.width, actor.height);

        // this.fixtureDef = {
        //     friction: actor.friction, density: actor.density, restitution: actor.restitution,
        //     //shape: this.getCollider(actor.collider, actor.width, actor.height),
        // };
    }

    setFixtureShape(type, width, height) {
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
