class Engine {

    constructor(gameModel) {
        this.ffps = 100;
        this.fps = 60;
        this.currentTime=0.0;
        this.accumulator = 0.0;
        this.dt = 1000 / this.ffps;
        this.t = 0.0;
        this.frameTime = 0.0;

        this.gameObjects = this.createGameObjects(gameModel);
        this.scope = this.createScope(this.gameObjects, gameModel.allProperties);
        console.log(this.scope);
        this.render = new Render(this);
        this.logic = new Logic(this);
        (function() {
            var lastTime = 0,
                vendors = ['ms', 'moz', 'webkit', 'o'],
                x,
                length,
                currTime,
                timeToCall;
        
            for(x = 0, length = vendors.length; x < length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
                window.cancelAnimationFrame = 
                  window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
            }
        
            if (!window.requestAnimationFrame)
                window.requestAnimationFrame = function(callback, element) {
                    currTime = new Date().getTime();
                    timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    lastTime = currTime + timeToCall;
                    return window.setTimeout(function() { callback(currTime + timeToCall); }, 
                      timeToCall);
                };
        
            if (!window.cancelAnimationFrame)
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                };
        }());
        this.gameLoop();
    } ;

    gameLoop(newTime) {
        //var newTime = Date.now();
        //setTimeout(this.gameLoop.bind(this),1000/this.fps);
       // setTimeout(() => {window.requestAnimationFrame(this.gameLoop.bind(this));}, 1000 / this.fps);
        window.requestAnimationFrame(this.gameLoop.bind(this));
        if (this.currentTime) {
            this.frameTime = newTime - this.currentTime;
            if (this.frameTime > 250) this.frameTime = 250;
            this.accumulator += this.frameTime;
            while (this.accumulator >= this.dt) {
                this.scope["Game"].deltaTime = this.dt / 1000;
                this.scope["Game"].time = this.t / 1000;
                this.logic.fixedUpdate(this.dt / 1000);
                this.t += this.dt;
                this.accumulator -= this.dt;
            }
            this.render.integrate(this.accumulator / this.dt);
            this.scope["Game"].FPS = 1000 / this.frameTime;
        }
        this.currentTime = newTime;
        
    }

    createGameObjects(gameModel) {
        var gameObjects = new Map();
        gameModel.sceneList[0].actorList.forEach(actor => {
            var gameObject = new GameObject(actor);
            gameObjects.set(actor.name, gameObject);
        });
        return gameObjects;
    }

    createScope(gameObjects, gameProperties) {
        var scope = new Object({ "Game": gameProperties });
        gameObjects.forEach((gameObject, actorName) => {
            scope[actorName] = gameObject;
        });
        return scope;
    }
}
