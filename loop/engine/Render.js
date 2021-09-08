class Render {

    constructor(cast,gameProperties) {
        this.cast=cast;
        const app = new PIXI.Application({
            width: gameProperties.displayWidth, 
            height: gameProperties.displayHeight, 
            backgroundColor: "0x" + String(gameProperties.backgroundColor).substr(1), 
        });
        document.body.appendChild(app.view);
        this.stage = new PIXI.Container();
        app.stage.addChild(this.stage);      
        this.sprite=[];
        cast.forEach((actor,i)=>{
            var texture = player.file.loader.resources[actor.image].texture;
            this.sprite[i]= new PIXI.Sprite(texture);
            this.sprite[i].x = actor.x;
            this.sprite[i].y = actor.y;
            this.stage.addChild(this.sprite[i]);
        })
    }

    draw(lagOffset) {

        this.cast.forEach((actor,i) => {

            this.sprite[i].x += 2 * lagOffset;
 
        });
    }

    // setActorRender(actor, data) {

    //     if (data.spriteOn) { this.setActorSprite(actor, data); }   /** Creamos el sprite de la textura. */
    //     if (data.textOn) { this.setActorText(actor, data); }       /** Creamos el sprite de la texto. */
    // }

    // setActorSprite(actor, data) {

    //     actor.sprite = new PIXI.TilingSprite(PIXI.Texture.EMPTY);   /** Creamos el sprite de la imagen. */
    //     actor.sprite.anchor.set(0.5001);                            /** Establecemos su origen de coordenadas local en su centro. */
    //     actor.sprite.zIndex = data.index;                           /** Determinamos su orden de visualizacion. */
    //     actor.sprite.alpha = data.opacity;
    //     actor.sprite.cacheAsBitmap = true;                          /** Activamos su cacheo (para mejorar el rendimiento). */
    //     this.spriteList.push(actor);                                /** Añadimos el actor a la lista de actualizacion de sprites. */
    //     this.stage.addChild(actor.sprite);                          /** Añadimos el sprite al contenedor del sprites del actor. */
    // }

    // setActorText(actor, data) {

    //     actor.textStyle = new PIXI.TextStyle({});               /** Definimos el estilo del texto. */
    //     actor.textSprite = new PIXI.Text("", actor.textStyle);  /** Creamos el elemento de texto para el render. */
    //     actor.textSprite.anchor.set(0.5);                       /** Establecemos su origen de coordenadas local en su centro. */
    //     actor.textSprite.zIndex = data.index;                   /** Determinamos su orden de visualizacion. */
    //     this.stage.addChild(actor.textSprite);                  /** Añadimos el texto al sprite contenedor. */
    //     this.textList.push(actor);                              /** Añadimos el actor a la lista de textos. */
    //     this.textCompilationList.push(actor);                   /** Añadimos el actor a la lista auxiliar de compilacion de texto. */
    // }

    // run() {

    //    // this.updateActors();
    //    // this.renderer.render(this.stage);
    // }

    // updateActors() {

    //     let i;
    //     for (i = 0; i < this.textList.length; i++) { this.textList[i].setTextProperties(); }
    //     for (i = 0; i < this.spriteList.length; i++) { this.spriteList[i].setSpriteProperties(); }
    // }

    // compileTexts() {

    //     for (var i = 0; i < this.textCompilationList.length; i++) {

    //         this.textCompilationList[i].text = Util.updateTextToScope(this.textCompilationList[i].text, this.textCompilationList[i]);
    //     }

    //     this.textCompilationList = [];
    // }

    // updateSpriteDimensions(actor) {

    //     if (actor.spriteOn) {

    //         actor.sprite.cacheAsBitmap = false;

    //         if (actor.image != "") {

    //             actor.sprite.width = actor.width * (1 / actor.scaleX);
    //             actor.sprite.height = actor.height * (1 / actor.scaleY);

    //             actor.sprite.scale.x = actor.scaleX * (actor.flipX ? -1 : 1);
    //             actor.sprite.scale.y = actor.scaleY * (actor.flipY ? -1 : 1);
    //         }
    //         else {

    //             actor.sprite.width = actor.width;
    //             actor.sprite.height = actor.height;
    //         }

    //         actor.sprite.cacheAsBitmap = true;
    //     }
    // }

    // updateTextDimensions(actor) {

    //     if (actor.textOn) {

    //         actor.textStyle.wordWrapWidth = actor.width;
    //         actor.textStyle.padding = actor.width;

    //         actor.textStyle.align = actor.align;
    //         actor.textSprite.pivot.y = actor.offsetY;

    //         switch (actor.align) {

    //             case "left":
    //                 actor.textSprite.pivot.x = actor.width / 2 + actor.offsetX;
    //                 actor.textSprite.anchor.x = 0.0;
    //                 break;

    //             case "right":
    //                 actor.textSprite.pivot.x = -actor.width / 2 + actor.offsetX;
    //                 actor.textSprite.anchor.x = 1.0;
    //                 break;

    //             case "center":
    //                 actor.textSprite.pivot.x = 0.0 + actor.offsetX;
    //                 actor.textSprite.anchor.x = 0.5;
    //                 break;
    //         }
    //     }
    // }

    // sleep(actor) {

    //     if (actor.textOn) { actor.textSprite.visible = false; } /** Ocultamos el texto. */
    //     if (actor.spriteOn) { actor.sprite.visible = false; } /** Ocultamos el sprite. */
    // }

    // awake(actor) {

    //     if (actor.textOn) { actor.textSprite.visible = true; } /** Mostramos el texto. */
    //     if (actor.spriteOn) { actor.sprite.visible = true; } /** Mostramos el sprite. */
    // }

    // destroyActor(actor) {

    //     /** Eliminamos el texto. */
    //     if (actor.textOn) {

    //         actor.textSprite.destroy({ children: true, texture: false, baseTexture: false });
    //         Util.destroy(actor, "textSprite");
    //         this.textList = Util.removeByID(this.textList, actor.ID); /** Eliminamos el actor de la lista de texto. */
    //     }

    //     /** Eliminamos el sprite. */
    //     if (actor.spriteOn) {

    //         actor.sprite.destroy({ children: true, texture: false, baseTexture: false });
    //         Util.destroy(actor, "sprite");
    //         this.spriteList = Util.removeByID(this.spriteList, actor.ID); /** Eliminamos el actor de la lista de sprites. */
    //     }

    //     /** Eliminamos el actor de la lista de actores onScreen. */
    //     if (actor.screen) { this.onScreenList = Util.removeByID(this.onScreenList, actor.ID); }
    // }

    // loadFonts(fonts) {

    //     var style = document.getElementsByTagName("style");

    //     for (var i in fonts) {

    //         var css = "@font-face { font-family: '" + i + "'; src: url('" + fonts[i] + "'); };"
    //         style[0].innerHTML = css.concat(style[0].innerHTML);
    //     }
    // }
}