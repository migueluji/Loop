class GameObject {
    constructor(actor) {
        this.id = actor.id;
        this.sleeping = actor.sleeping;
        this.name = actor.name;
        this.x = actor.x;
        this.y= actor.y;
        this.width=actor.width;
        this.height = actor.height;
        this.scaleX = actor.scaleX;
        this.scaleY = actor.scaleY;
        this.angle =actor.angle;
    }
}