class Body {
    pixelsPerMeter = 50;
    
    constructor(actor) {
        this.body = new b2BodyDef();
        switch (actor.type) {
            case "Dynamic": this.body.type = b2Body.b2_dynamicBody; break;
            case "Kinematic": this.body.type = b2Body.b2_kinematicBody; break;
            default: this.body.type = b2Body.b2_staticBody;
        }
        this.body.position = { x: actor.x, y: actor.y };
        this.body.angle = actor.angle;
        this.body.linearVelocity = { x: actor.velocityX, y: actor.velocityY };
        this.body.fixedRotation = actor.fixedAngle;
        this.body.angularVelocity = actor.angularVelocity;
        this.body.angularDamping = actor.dampingLinear;
        this.body.linearDamping = actor.dampingAngular;
        this.fixture = new b2FixtureDef();
        this.fixture.friction = actor.friction;
        this.fixture.density = actor.density;
        this.fixture.restitution = actor.restitution;
        var shape;
        switch (actor.collider) {
            case "Box": {
                shape = new b2PolygonShape;
                shape.SetAsBox(actor.width / 2 / this.pixelsPerMeter, actor.height / 2 / this.pixelsPerMeter);
            }
            default: {
                shape = new b2CircleShape;
                shape.m_radius = Math.max(actor.width, actor.height) / 2 / this.pixelsPerMeter;
            }
        }
        this.fixture.shape = shape;
        console.log("Body", actor, this.body,this.fixture);
        // fixture.friction    = data.friction;
        // fixture.density     = data.density;   
        // fixture.restitution = data.restitution;   
        //fixture.shape       = this["set" + data.collider + "Shape"](data, actor); /** Configuracion de la forma geometrica del objeto fisico */
        //return this.world.CreateBody(body).CreateFixture(fixture); 
    }
}
