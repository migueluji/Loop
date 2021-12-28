class GameObject {

    constructor(engine, actor, spawnName) {
        this._engine = engine;
        Object.keys(actor.properties).forEach(key => { this["_" + key] = actor[key] });
        this._name = (spawnName) ? spawnName : actor.name;
        this._sleeping = (spawnName) ? false : actor.sleeping;
        this._spawned = false; // to be added
        this._dead = false; // To be deleted in the fixedUpdate(), in the evaluation of logic
        this._actor = actor; // To store the original Object
        // Define get and set functions for new game properties
        var keys = Object.keys(actor.newProperties); // zIndex is included in newProperties
        keys.forEach(key => this["_" + key] = actor[key])
        var otherKeys = ["spawned", "dead", "name", "sleeping", "physicsOn", "soundOn", "collider", "actor",
            "container", "audio", "rigidbody", "engine", "screen"];
        keys.concat(otherKeys).forEach(key => {
            Object.defineProperty(this, key, {
                get() { return this["_" + key] },
                set(value) { this["_" + key] = value }
            });
        })
        // Add audio
        var soundOpt = { volume: actor.volume, loop: actor.loop, pan: actor.pan, start: actor.start }
        if (actor.sound) {
            this._audio = new Sound(actor.sound, soundOpt);
            if (actor.soundOn) this._audio.source.play(this._audio.id);
        }
        // Add container to stage
        this._container = engine.render.stage.addChild(new Container(actor));
        this._previousCameraX = engine.gameLevel.cameraX;
        this._previousCameraY = engine.gameLevel.cameraY;
        // Add rigidbody to world
        var body = new Body(actor);
        this._rigidbody = engine.physics.world.createBody(body.bodyDef);
        this._rigidbody.createFixture(body.fixtureDef);
        if (!this.physicsOn) {
            this._rigidbody.setDynamic();
            this._rigidbody.getFixtureList().setSensor(true);
            this._rigidbody.setGravityScale(0);
        }
        (this._sleeping) ? this._rigidbody.setActive(false) : this._rigidbody.setActive(true);
        // Compile the script if exist for this gameObject
        if (actor.scriptList.length) this.rule = new Rule(this);// this is the gameObject, no the actor
        // add bounding box to debug
        if (engine.debug) {
            this.debug = new PIXI.Graphics();
            engine.render.stage.addChild(this.debug);
        }
    }

    play() {
        if (this.audio) {
            if (this.soundOn) this._audio.source.play(this.audio.id);
            else this.audio.source.stop(this.audio.id);
        }
    }

    stop() {
        if (this.audio) this.audio.source.stop(this.audio.id);
    }

    fixedStep() {
        if (!this.sleeping) {
            this.x = this.rigidbody.getPosition().x * Physics.pixelsPerMeter;
            this.y = this.rigidbody.getPosition().y * Physics.pixelsPerMeter;
            this.angle = this.rigidbody.getAngle() * 180 / Math.PI;
        }
    }

    fixedUpdate(deltaTime, scope) { // logic update
        if (this.spawned) { // CRUD - CREATE
            this.spawned = false; // Do not execute rules the first time the object is spawned
        }
        else if (this.dead) { // CRUD - DELETE
            if (this.audio) this.audio.source.stop(this.audio.id);
            this.engine.render.stage.removeChild(this.container);
            if (this.debug) this.engine.render.stage.removeChild(this.debug);
            this.engine.physics.world.destroyBody(this.rigidbody);
            this.engine.gameObjects.delete(this.name);
            delete this.engine.scope[this.name];
        }
        else if (!this.sleeping) { // CRUD - UPDATE
            // update logic
            if (this.rule) try { this.rule.eval(scope); } catch (error) { console.log(error); }
            // update scrolling
            if (this._scrollX != 0) this.container.sprite.tilePosition.x += this._scrollX * deltaTime;
            if (this._scrollY != 0) this.container.sprite.tilePosition.y += this._scrollY * deltaTime;
            // update text
            if (this.textOn) {
                this.text = math.print(this.container.text.expression, scope);
                if (this.align == "Left") this.container.text.position.x = (-this.width / 2 + this.container.text.width / 2) + this.offsetX;
                if (this.align == "Right") this.container.text.position.x = (this.width / 2 - this.container.text.width / 2) + this.offsetX;
            }
        }
    }

    update() {
        if (this.screen) {
            if (this.engine.gameLevel.cameraX != this._previousCameraX) this.x = this.engine.gameLevel.cameraX + this._actor.x;
            if (this.engine.gameLevel.cameraY != this._previousCameraY) this.y = this.engine.gameLevel.cameraY + this._actor.y;
        }
        if (this.debug) {  // debug lines
            this.debug.clear();
            this.debug = Object.assign(this.debug, { x: this.x, y: this.y, angle: this.angle });
            this.debug.lineStyle(1, 0xFF2222, 1, 0.5);
            this.debug.zIndex = this._zIndex;
            switch (this.collider) {
                case "Box": {
                    var shape = this._rigidbody.getFixtureList().getShape();
                    this.debug.moveTo(shape.getVertex(0).x * Physics.pixelsPerMeter, shape.getVertex(0).y * Physics.pixelsPerMeter);
                    for (var v = 1; v < shape.m_count; v++) {
                        this.debug.lineTo(shape.getVertex(v).x * Physics.pixelsPerMeter, shape.getVertex(v).y * Physics.pixelsPerMeter);
                    }
                    this.debug.lineTo(shape.getVertex(0).x * Physics.pixelsPerMeter, shape.getVertex(0).y * Physics.pixelsPerMeter); break;
                }
                case "Circle": {
                    var radius = this._rigidbody.getFixtureList().getShape().m_radius;
                    this.debug.drawCircle(0, 0, radius * Physics.pixelsPerMeter); break;
                }
            }
        }
    }

    // access to GameObject properties
    get x() { return Math.round(this._x) }
    set x(value) {
        this._x = this._container.x = value;
        this._rigidbody.setPosition(planck.Vec2(value * Physics.metersPerPixel, this._rigidbody.getPosition().y));
    }

    get y() { return Math.round(this._y) }
    set y(value) {
        this._y = this._container.y = value;
        this._rigidbody.setPosition(planck.Vec2(this._rigidbody.getPosition().x, value * Physics.metersPerPixel));
    }

    get width() { return this._width }
    set width(value) {  // sprite width don't include scale only tile
        this._width = value;
        this._container.sprite.scale.x = value / this._container.sprite.width;
        this._rigidbody.getFixtureList().m_shape = planck.Box((this.width / 2) * Physics.metersPerPixel, (this.height / 2) * Physics.metersPerPixel);
    }

    get height() { return this._height }
    set height(value) {
        this._height = value;
        this._container.sprite.scale.y = value / this._container.sprite.height;
        this._rigidbody.getFixtureList().m_shape = planck.Box((this.width / 2) * Physics.metersPerPixel, (this.height / 2) * Physics.metersPerPixel);
    }

    get scaleX() { return this._scaleX.toFixed(2) }
    set scaleX(value) {
        this._scaleX = this._container.sprite.scale.x = value;
        this._rigidbody.getFixtureList().m_shape = planck.Box((this.width / 2) * Physics.metersPerPixel, (this.height / 2) * Physics.metersPerPixel);
    }

    get scaleY() { return this._scaleY.toFixed(2) }
    set scaleY(value) {
        this._scaleY = this._container.sprite.scale.y = value;
        this._rigidbody.getFixtureList().m_shape = planck.Box((this.width / 2) * Physics.metersPerPixel, (this.height / 2) * Physics.metersPerPixel);
    }

    get angle() { return Math.round(this._angle) } /*** investigar porque no es un número */
    set angle(value) {
        this._angle = this._container.angle = value;
        this._rigidbody.setAngle(value * Math.PI / 180);
    }

    get spriteOn() { return this._spriteOn }
    set spriteOn(value) { this._spriteOn = this._container.sprite.visible = value }

    get image() { return this._image }
    set image(value) {
        this._image = value;
        if (value != this._container.sprite.image) {
            this._container.sprite.cacheAsBitmap = false;
            this._container.sprite.image = value;
            this._container.sprite.texture = player.file.loader.resources[value].texture;
            this._container.sprite.texture.rotate = 8;
            this._container.sprite.width = this._container.sprite.texture.width * this._container.sprite.tileX;
            this._container.sprite.height = this._container.sprite.texture.height * this._container.sprite.tileY;
            this._rigidbody.getFixtureList().m_shape = Body.getCollider(this.collider, this.width, this.height);
        }
    }

    get color() { return this._color }
    set color(value) {
        this._color = value;
        this._container.sprite.cacheAsBitmap = false;
        this._container.sprite.tint = PIXI.utils.string2hex(value);
    }

    get opacity() { return this._opacity.toFixed(2) };
    set opacity(value) { this._opacity = this._container.sprite.alpha = value }

    get flipX() { return this._flipX }
    set flipX(value) {
        this._flipX = value;
        this._container.sprite.scale.x = (value) ? -Math.abs(this._container.sprite.scale.x) :
            Math.abs(this._container.sprite.scale.x)
    }

    get flipY() { return this._flipY }
    set flipY(value) {
        this._flipY = valuea;
        this._container.sprite.scale.y = (value) ? - Math.abs(this._container.sprite.scale.y) :
            Math.abs(this._container.sprite.scale.y)
    }

    get scrollX() { return this._scrollX }
    set scrollX(value) { this._scrollX = this._container.sprite.scrollX = value };

    get scrollY() { return this._scrollY }
    set scrollY(value) { this._scrollY = this._container.sprite.scrollY = value }

    get tileX() { return this._tileX.toFixed(1) }
    set tileX(value) {
        this._tileX = value;
        const existsImage = Boolean(player.file.loader.resources[this._container.sprite.image]);
        this._container.sprite.tileX = value;
        this._container.sprite.width = (existsImage) ? this._container.sprite.texture.width * value : 50 * value;
    }

    get tileY() { return this._tileY.toFixed(1) }
    set tileY(value) {
        this.tileY = value;
        const existsImage = Boolean(player.file.loader.resources[this._container.sprite.image]);
        this._container.sprite.tileY = value;
        this._container.sprite.height = (existsImage) ? this._container.sprite.texture.height * value : 50 * value;
    }

    get textOn() { return this._textOn }
    set textOn(value) { this._textOn = this._container.text.visible = value }

    get text() { return this._text }
    set text(value) { this._text = this._container.text.text = value }

    get font() { return this._font }
    set font(value) { this._font = this._container.text.style.fontFamily = value }

    get size() { return this._size }
    set size(value) { this._size = this._container.text.style.fontSize = value }

    get fill() { return this._fill }
    set fill(value) { this._fill = this._container.text.style.fill = value }

    get style() { return this._style };
    set style(value) { this._style = this._container.text.style.fontStyle = value }

    get align() { return this._align }
    set align(value) { this._align = value; this._container.text.style.align = value.toLowerCase() };

    get offsetX() { return this._offsetX }
    set offsetX(value) {
        this._offsetX = value;
        const w = Math.abs(this._container.sprite.width * this._container.sprite.scale.x);
        var pivot = { x: 0, y: 0 };
        switch (this._container.text.style.align) {
            case "left": pivot = { x: -w / 2 + this._container.text.width / 2 }; break;
            case "right": pivot = { x: w / 2 - this._container.text.width / 2 }; break;
        }
        this._container.text.position.x = pivot.x + value;
    }

    get offsetY() { return this._offsetY }
    set offsetY(value) { this._offsetY = this._container.text.position.y = value }

    get sound() { return this._sound }
    set sound(value) {
        this._sound = value;
        if (this._audio.source._src != player.file.playList[value]._src) { // change sound file
            var volume = this.volume; // get previous volume
            this._audio.source.stop(this._audio.id);
            this._audio = new Sound(value);
            this.volume = volume; // update volume
        }
    }

    get volume() { return this._volume }
    set volume(value) { this._volume = value; this._audio.source.volume(value) }

    get start() { return this._start }
    set start(value) { this._start = value; this._audio.source.seek(value) }

    get pan() { return this._pan }
    set pan(value) { this._pan = value; this._audio.source.stereo(value) }

    get loop() { return this._audio.source.loop() }
    set loop(value) { this._audio.source.loop(value) }

    get type() { return this._type }
    set type(value) {
        this._type = value;
        switch (value) {
            case "Dynamic": this._rigidbody.setDynamic(); break;
            case "Kinematic": this._rigidbody.setKinematic(); break;
            case "Static": this._rigidbody.setStatic(); break;
        }
    }

    get fixedAngle() { return this._fixedAngle }
    set fixedAngle(value) { this._fixedAngle = value; this._rigidbody.setFixedRotation(value) }

    get velocityX() {
        this._velocityX = this._rigidbody.getLinearVelocity().x * Physics.pixelsPerMeter;
        return this._velocityX.toFixed(1)
    }
    set velocityX(value) {
        this._velocityX = value;
        this._rigidbody.setLinearVelocity(planck.Vec2(value * Physics.metersPerPixel, this._rigidbody.getLinearVelocity().y))
    }

    get velocityY() {
        this._velocityY = this._rigidbody.getLinearVelocity().y * Physics.pixelsPerMeter;
        return this._velocityY.toFixed(1)
    }
    set velocityY(value) {
        this._velocityY = value;
        this._rigidbody.setLinearVelocity(planck.Vec2(this._rigidbody.getLinearVelocity().x, value * Physics.metersPerPixel))
    }

    get angularVelocity() { return this._angularVelocity.toFixed(1) }
    set angularVelocity(value) { this._angularVelocity = value; this._rigidbody.setAngularVelocity(value) }

    get density() { return this._density.toFixed(1) }
    set density(value) { this._density = value; this._rigidbody.getFixtureList().setDensity(value) }

    get friction() { return this._friction.toFixed(1) }
    set friction(value) { this._friction = value; this._rigidbody.getFixtureList().setFriction(value) }

    get restitution() { return this._restitution.toFixed(1) }
    set restitution(value) { this._restitution = value; this._rigidbody.getFixtureList().setRestitution(value) }

    get dampingLinear() { return this._dampingLinear.toFixed(1) }
    set dampingLinear(value) { this._dampingLinear = value; this._rigidbody.setLinearDamping(value) }

    get dampingAngular() { return this._dampingAngular.toFixed(1) }
    set dampingAngular(value) { this._dampingAngular = value; this._rigidbody.getAngularDamping(value) }
}