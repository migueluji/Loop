class Engine {

    constructor(gameModel) {
        this.currentScene= gameModel.sceneList[0];
        this.render = new Render(this.currentScene.actorList, gameModel.properties);
        window.requestAnimationFrame(this.gameLoop.bind(this));
        this.fpsText = document.getElementById("fps");
        this.fps = 30 ;
        this.previous = 0.0;
        this.frameDuration = 1000 / this.fps;
        this.lag = 0.0;
    }

    gameLoop(timestamp) {
        window.requestAnimationFrame(this.gameLoop.bind(this));

        //Calcuate the time that has elapsed since the last frame
        if (!timestamp) timestamp = 0;
        var elapsed = timestamp - this.previous;

        //Optionally correct any unexpected huge gaps in the elapsed time
        if (elapsed > 1000) elapsed = this.frameDuration;

        //Add the elapsed time to the lag counter
        this.lag += elapsed;

        //Update the frame if the lag counter is greater than or equal to the frame duration
        while (this.lag >= this.frameDuration) {
            //Capture the sprites' previous positions
            //capturePreviousPositions(sprites);

            //Update the logic
            this.render.update(this.frameDuration / 1000);

            //Reduce the lag counter by the frame duration
            this.lag -= this.frameDuration;
        }
        //Calculate the lag offset. This tells us how far we are into the next frame
        var lagOffset = this.lag / this.frameDuration;

        //Render the sprites using the `lagOffset` to extrapolate the sprites' positions
        //render(lagOffset);

        //Capture the current time to be used as the previous time in the next frame
        this.previous = timestamp;
        var actualFps = Math.floor(1000 / elapsed);
        this.render.draw(lagOffset);

        this.fpsText.innerHTML = "ms: " + elapsed.toFixed(2) + " fps: " + actualFps + " lag: " + ("0" + Math.floor(this.lag)).slice(-2) + " offset: " + lagOffset.toFixed(2);

    }

    //     resetEngine() {

    //         this.updateScenes();    /** Gestion de los cambios de escena (si fuera necesario). */
    //         this.physics.reset();
    //         this.input.reset();     /** Resetear las propiedades de input (mouse, keys, etc). */
    //         this.logic.reset();     /** Resetear las propiedades de logica (deltaTime, timer, etc). */
    //         this.spawnActors();     /** Spawnear los actores determinados por la lista. */
    //         this.destroyActors();   /** Eliminar los actores determinados por la lista. */
    //     }

    //     /* ----------------------------------------
    //      *  SCENE MANAGEMENT
    //      * ---------------------------------------- */
    //     addScene(scene) {

    //         /** Actualizar la lista de escenas activas y la lista auxiliar de carga de actores. */
    //         this.sceneList[scene.name] = {};

    //         /** Creacion de los actores en la memoria del motor. */
    //         for (var i in scene.actorList) {

    //             this.actorList[scene.actorList[i].ID] = new Actor(scene.actorList[i], this);

    //             /** Si es un actor dormido */
    //             if (scene.actorList[i].sleeping) { this.actorList[scene.actorList[i].ID].sleep(); }

    //             /** Si es un actor a spawnear. */
    //             this.index = this.actorList[scene.actorList[i].ID].spawn ? this.index + 1 : this.index;
    //             this.actorList[scene.actorList[i].ID].index = this.index;
    //             this.game.sceneList[this.game.activeScene].actorList[scene.actorList[i].ID].index = this.index;
    //             this.index = this.actorList[scene.actorList[i].ID].spawn ? this.index + 1 : this.index;

    //             this.sceneList[scene.name][scene.actorList[i].ID] = scene.actorList[i];
    //         }

    //         this.logic.compileExpressions();    /** Compilamos las expresiones logicas de los nuevos actores. */
    //         this.render.compileTexts();         /** Compilamos los textos de los nuevos actores. */
    //     }

    //     addSceneHandler(scene, stop) { this.sceneHandler = { scene: scene, stop: stop }; }
    //     changeSceneHandler(scene) { this.sceneHandler = { scene: scene }; }
    //     removeSceneHandler() { this.sceneHandler = { scene: "" }; }

    //     destroyScene(name, scene) {

    //         for (var i in this.actorList) {

    //             if (this.actorList[i].scene == name) {

    //                 this.addDestroyedActor(this.actorList[i]);
    //             }
    //         }

    //         Util.deepDestroy(scene);
    //         delete this.sceneList[scene.name];
    //     }

    //     destroyAllScenes() {

    //         for (var i in this.sceneList) {

    //             this.destroyScene(i, this.sceneList[i]);
    //         }

    //         this.destroyActors();

    //         Util.deepDestroy(this.actorList);
    //         this.actorList = {};
    //         this.spawnList = [];
    //         this.sceneList = {};
    //         this.index = 0;

    //         // this.clearLists();

    //         this.physics.clearWorld();
    //     }

    //     updateScenes() {

    //         if (this.sceneHandler != null) {

    //             if (this.sceneHandler.scene == "") {             /** Comprobamos si tenemos que eliminar la ultima escena. */

    //                 this.popScene();
    //             }
    //             else {

    //                 if (this.sceneHandler.stop == undefined) {   /** Comprobamos si tenemos que ir a una escena nueva. */

    //                     this.destroyAllScenes();
    //                     this.game.resetCamera();
    //                 }
    //                 else if (this.sceneHandler.stop) {           /** Comprobamos si tenemos que añadir una escena nueva. */

    //                     this.disableScene();
    //                     this.spawnList = [];
    //                     this.destroyList = [];
    //                 }

    //                 this.game.activeScene = this.sceneHandler.scene;
    //                 this.game.activeSceneNumber = this.game.sceneList[this.sceneHandler.scene].number;
    //                 this.clearLists();
    //                 this.addScene(this.game.sceneList[this.sceneHandler.scene]); /** Añadimos la nueva escena. */
    //                 this.game.updateCamera();
    //             }

    //             this.sceneHandler = null;
    //         }
    //     }

    //     popScene() {

    //         this.destroyScene(this.game.activeScene, this.sceneList[this.game.activeScene]);
    //         this.destroyActors();   // eliminar los actores determinados por la lista
    //         delete this.sceneList[this.game.activeScene];
    //         this.game.activeScene = Util.getLastKey(this.sceneList);
    //         this.game.activeSceneNumber = this.game.sceneList[this.game.activeScene].number;
    //         this.enableScene();
    //     }

    //     disableScene() {

    //         for (var i in this.actorList) {

    //             if (this.actorList[i].scene == this.game.activeScene) {

    //                 this.actorList[i].___sleeping = this.actorList[i].sleeping ? true : false;
    //                 this.actorList[i].sleeping = true;
    //             }
    //         }
    //     }

    //     enableScene() {

    //         for (var i in this.actorList) {

    //             if (this.actorList[i].scene == this.game.activeScene) {

    //                 this.actorList[i].sleeping = this.actorList[i].___sleeping ? true : false;
    //                 delete this.actorList[i].___sleeping;
    //             }
    //         }
    //     }

    //     /* ----------------------------------------
    //      *  SPAWN MANAGEMENT
    //      * ---------------------------------------- */
    //     addSpawnedActor(actorName, x, y, angle) {

    //         let _name = "Spawn_of_" + actorName + "_" + Util.random();
    //         let _actor = Object.assign({}, this.game.sceneList[this.game.activeScene].actorList[actorName]);
    //         _actor.sleeping = false;
    //         _actor.name = _name;
    //         _actor.ID = _name;
    //         _actor.x = x;
    //         _actor.y = y;
    //         _actor.angle = angle; /** El angulo del actor original mas el parametro angle, es decir, el angulo del spawner y el determinado nodo spawn. */

    //         this.spawnList.push(_actor);
    //     }

    //     spawnActors() {

    //         for (var i = 0; i < this.spawnList.length; i++) { this.actorList[this.spawnList[i].ID] = new Actor(this.spawnList[i], this); }

    //         this.spawnList = [];                /** Vaciamos la lista de actores a spawnear. */

    //         this.logic.compileExpressions();    /** Compilamos las expresiones logicas de los nuevos actores. */
    //         this.render.compileTexts();         /** Compilamos los textos de los nuevos actores. */
    //     }


    //     /* ----------------------------------------
    //      *  DESTROY MANAGEMENT
    //      * ---------------------------------------- */
    //     addDestroyedActor(actor) { this.destroyList.push(actor); }

    //     destroyActors() {

    //         for (var i = 0; i < this.destroyList.length; i++) {

    //             /** Destruimos las referencias y las estructuras de datos relativas al actor en cada modulo del motor
    //              * --------------------------------------------------------------- * ---------------------------------------- */
    //             this.physics.destroyActor(this.destroyList[i]);     // Eliminar el actor de las fisicas
    //             this.render.destroyActor(this.destroyList[i]);      // Eliminar el actor del render
    //             this.input.destroyActor(this.destroyList[i]);       // Eliminar el actor del input
    //             this.audio.destroyActor(this.destroyList[i]);       // Eliminar el actor del audio
    //             this.logic.destroyActor(this.destroyList[i]);       // Eliminar el actor de la logica

    //             /** Eliminar el actor de la listas del engine 
    //              * --------------------------------------------------------------- * ---------------------------------------- */
    //             Util.destroy(this.actorList, this.destroyList[i].ID);
    //             Util.destroy(this.sceneList[this.game.activeScene], this.destroyList[i].ID);

    //             /** Destruimos todas las propiedades del actor
    //              * --------------------------------------------------------------- * ---------------------------------------- */
    //             this.destroyList[i].destroy();
    //         }

    //         this.destroyList = [];
    //     }

    //     clearLists() {

    //         for (var i = this.physics.rigidbodyList.length - 1; i >= 0; i--) {

    //             if (this.physics.rigidbodyList[i].name == undefined) {

    //                 delete this.physics.rigidbodyList[i];
    //                 this.physics.rigidbodyList.pop();
    //             }
    //         }
    //     }


    //     printf() {

    //         for (var i = 0; i < arguments.length; i++) {

    //             console.log(arguments[i]);
    //         }

    //         console.log("-------------------------");
    //     }
}