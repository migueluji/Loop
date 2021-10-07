class Sprite {

    constructor(actor) {
        const existsImage = Boolean(player.file.loader.resources[actor.image]);
        const scroll = Boolean((actor.scrollX != 0) || (actor.scrollY != 0));
        const tile = Boolean((actor.tileX != 1) || (actor.tileY != 1));
      //  const sprite = (scroll || tile) ? new PIXI.TilingSprite() : new PIXI.Sprite();
        const sprite = new PIXI.TilingSprite();
        sprite.visible = actor.spriteOn;
        sprite.image = actor.image;
        if (existsImage) sprite.texture = player.file.loader.resources[actor.image].texture;
        else {
            sprite.texture=PIXI.Texture.WHITE;
            sprite.texture.orig= new PIXI.Rectangle(0,0,50,50);
        }
        sprite.texture.rotate = 8;
        sprite.anchor.set(0.5);
        sprite.tint = PIXI.utils.string2hex(actor.color);
        sprite.alpha = actor.opacity;
        sprite.width = sprite.texture.width * actor.tileX ;
        sprite.height =  sprite.texture.height * actor.tileY ;
        sprite.scale.x = (actor.flipX) ? -actor.scaleX : actor.scaleX;
        sprite.scale.y = (actor.flipY) ? -actor.scaleY : actor.scaleY;
        sprite.scrollX = actor.scrollX;
        sprite.scrollY = actor.scrollY;
        sprite.tileX = actor.tileX;
        sprite.tileY = actor.tileY;
        if (tile && !scroll) sprite.cacheAsBitmap = true;
        return (sprite);
    }
}
