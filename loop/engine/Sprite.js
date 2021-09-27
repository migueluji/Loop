class Sprite {

    constructor(actor) {
        const existsImage = Boolean(player.file.loader.resources[actor.image]);
        const scroll = Boolean((actor.scrollX != 0) || (actor.scrollY != 0));
        const tile = Boolean((actor.tileX != 1) || (actor.tileY != 1));
        const sprite = (scroll || tile) ? new PIXI.TilingSprite() : new PIXI.Sprite();
        sprite.visible = actor.spriteOn;
        sprite.image = actor.image;
        sprite.texture = (existsImage) ? player.file.loader.resources[actor.image].texture : PIXI.Texture.WHITE
        sprite.texture.rotate = 8;
        sprite.anchor.set(0.5);
        sprite.tint = PIXI.utils.string2hex(actor.color);
        sprite.alpha = actor.opacity;
        sprite.width = (existsImage) ? sprite.texture.width * actor.tileX : 50 * actor.tileX;
        sprite.height = (existsImage) ? sprite.texture.height * actor.tileY : 50 * actor.tileY;
        sprite.scale.x = (actor.flipX) ? -actor.scaleX : actor.scaleX;
        sprite.scale.y = (actor.flipY) ? -actor.scaleY : actor.scaleY;
        sprite.scrollX = actor.scrollX;
        sprite.scrollY = actor.scrollY;
        sprite.tileX = actor.tileX;
        sprite.tileY = actor.tileY;
        if (tile && !scroll) sprite.cacheAsBitmap = true;
        return(sprite);
    }
}
