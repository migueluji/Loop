class Fixture {

    constructor(actor) {
        console.log(actor, actor.collider,this.shape);
        this.friction = actor.friction;
        this.density = actor.density;
        this.restitution = actor.restitution
        this.shape = (actor.collider == "Box") ?
            planck.Box((actor.width / 2) * Physics.metersPerPixel, (actor.height / 2) * Physics.metersPerPixel) :
            planck.Circle((actor.width > actor.height) ? actor.width / 2 * Physics.metersPerPixel : actor.height / 2 * Physics.metersPerPixel);
        console.log(actor, actor.collider,this.shape);
    }
}
