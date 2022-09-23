class GameObject {

    constructor(engine, actor) {
        console.log(this);
        this.engine = engine;
        this.actor = actor;
        this.name = actor.name;
        // Add gameObject to the engines
        this.container = engine.render.stage.addChild(new Container(actor));
        this.rigidbody = engine.physics.world.createBody({ userData: { name: actor.name, tags: actor.tags } });
        this.audio = new Sound(actor.sound);
        this.rule = new Rule(this);
        // Add actor properties
        Object.assign(this, actor.allProperties);
        // other properties
        this.initialCameraX = engine.gameState.cameraX;
        this.initialCameraY = engine.gameState.cameraY;
        this.debug = new PIXI.Graphics();
        engine.render.stage.addChild(this.debug);
        // this._dead = false; // To be deleted in the fixedUpdate(), in the evaluation of logic
    }

    fixedStep() {
        this.rigidbody.setFixedRotation(false); // posible bug
        this.x = this.rigidbody.getPosition().x * Physics.pixelsPerMeter;
        this.y = this.rigidbody.getPosition().y * Physics.pixelsPerMeter;
        this.angle = Utils.degrees(this.rigidbody.getAngle());
    }

    fixedUpdate(deltaTime) { // logic update
        // if (this.spawned) { // CRUD - CREATE
        //     this.spawned = false; // Do not execute rules the first time the object is spawned
        // }
        // else if (this.dead) { // CRUD - DELETE
        //     if (this.audio) this.audio.source.stop(this.audio.id);
        //     this.engine.render.stage.removeChild(this.container);
        //     if (this.debug) this.engine.render.stage.removeChild(this.debug);
        //     this.engine.physics.world.destroyBody(this.rigidbody);
        //     this.engine.gameObjects.delete(this.name);
        //     delete this.engine.scope[this.name];
        // }
        // else if (!this.sleeping) { // CRUD - UPDATE
        // update logic
        if (this.rule) try { this.rule.eval(this.engine.scope); } catch (error) { console.log(error); }
        // update scrolling
        if (this.scrollX != 0) this.container.sprite.tilePosition.x += this.scrollX * deltaTime;
        if (this.scrollY != 0) this.container.sprite.tilePosition.y += this.scrollY * deltaTime;
        // update text
        if (this.textOn) {
            this.container.spriteText.text = math.print(this.container.spriteText.expression, this.engine.scope, { notation: 'fixed', precision: 0 });
            if (this.align == "Left") this.container.spriteText.position.x = (-this.width / 2 + this.container.spriteText.width / 2) + this.offsetX;
            if (this.align == "Right") this.container.spriteText.position.x = (this.width / 2 - this.container.spriteText.width / 2) + this.offsetX;
        }
        //}
    }

    update() {
        if (this.screen) {
            if (this.engine.gameState.cameraX != this.initialCameraX) this.x = this.actor.x + this.engine.gameState.cameraX;
            if (this.engine.gameState.cameraY != this.initialCameraY) this.y = this.actor.y + this.engine.gameState.cameraY;
        }
        if (this.engine.gameState.debug) {  // debug lines
            this.debug.clear();
            this.debug = Object.assign(this.debug, { x: this.x, y: this.y, angle: this.angle });
            this.debug.lineStyle(1, 0xFF2222, 1, 0.5);
            this.debug.zIndex = this.zIndex;
            var shape = this.rigidbody.getFixtureList().getShape();
            switch (this.collider) {
                case "Box": {
                    this.debug.moveTo(shape.getVertex(0).x * Physics.pixelsPerMeter, shape.getVertex(0).y * Physics.pixelsPerMeter);
                    for (var v = 1; v < shape.m_count; v++) {
                        this.debug.lineTo(shape.getVertex(v).x * Physics.pixelsPerMeter, shape.getVertex(v).y * Physics.pixelsPerMeter);
                    }
                    this.debug.lineTo(shape.getVertex(0).x * Physics.pixelsPerMeter, shape.getVertex(0).y * Physics.pixelsPerMeter); break;
                }
                case "Circle": { this.debug.drawCircle(0, 0, shape.m_radius * Physics.pixelsPerMeter); break; }
            }
        }
    }

    // access to GameObject properties
    get sleeping() { return this._sleeping }
    set sleeping(value) { this._sleeping = value }

    // Settings
    get x() { return this._x }
    set x(value) {
        this._x = this.container.x = value;
        this.rigidbody.setPosition(planck.Vec2(value * Physics.metersPerPixel, this.rigidbody.getPosition().y));
    }

    get y() { return this._y }
    set y(value) {
        this._y = this.container.y = value;
        this.rigidbody.setPosition(planck.Vec2(this.rigidbody.getPosition().x, value * Physics.metersPerPixel));
    }

    get width() { return this._width }
    set width(value) {  // sprite width don't include scale only tile
        this._width = value;
        this.container.sprite.scale.x = value / this.container.sprite.width;
    }

    get height() { return this._height }
    set height(value) {
        this._height = value;
        this.container.sprite.scale.y = value / this.container.sprite.height;
    }

    get scaleX() { return this._scaleX }
    set scaleX(value) {
        this._scaleX = this.container.sprite.scale.x = value;
    }

    get scaleY() { return this._scaleY }
    set scaleY(value) {
        this._scaleY = this.container.sprite.scale.y = value;
    }

    get angle() { return this._angle }
    set angle(value) {
        this._angle = this.container.angle = value;
        this.rigidbody.setAngle(Utils.radians(value));
    }

    get screen() { return this._screen }
    set screen(value) { this._screen = value }

    get collider() { return this._collider }
    set collider(value) {
        this._collider = value;
        if (this.rigidbody.getFixtureList()) this.rigidbody.destroyFixture(this.rigidbody.getFixtureList());
        var collisionShape = (value != "Circle") ? planck.Box((this.width / 2) * Physics.metersPerPixel, (this.height / 2) * Physics.metersPerPixel) :
            planck.Circle((this.width > this.height) ? this.width / 2 * Physics.metersPerPixel : this.height / 2 * Physics.metersPerPixel);
        this.rigidbody.createFixture({ shape: collisionShape });
    }

    get tags() { return this._tags }
    set tags(value) { this._tags = value }

    // Sprite
    get spriteOn() { return this._spriteOn }
    set spriteOn(value) { this._spriteOn = this.container.sprite.visible = value }

    get image() { return this._image }
    set image(value) { this._image = value; if (value) { this.container.sprite.texture = player.file.loader.resources[value].texture } }

    get color() { return this._color }
    set color(value) { this._color = value; this.container.sprite.tint = PIXI.utils.string2hex(value); }

    get opacity() { return this._opacity };
    set opacity(value) { this._opacity = this.container.sprite.alpha = value }

    get flipX() { return this._flipX }
    set flipX(value) {
        this._flipX = value;
        this.container.sprite.scale.x = (value) ? -Math.abs(this.container.sprite.scale.x) : Math.abs(this.container.sprite.scale.x)
    }

    get flipY() { return this._flipY }
    set flipY(value) {
        this._flipY = value;
        this.container.sprite.scale.y = (value) ? -Math.abs(this.container.sprite.scale.y) : Math.abs(this.container.sprite.scale.y)
    }

    get scrollX() { return this._scrollX }
    set scrollX(value) {
        this._scrollX = this.container.sprite.scrollX = value;
        if (value != 0) this.container.sprite.cacheAsBitmap = false;
        else if (this.scrollY == 0) this.container.sprite.cacheAsBitmap = true;
    };

    get scrollY() { return this._scrollY }
    set scrollY(value) {
        this._scrollY = this.container.sprite.scrollY = value;
        if (value != 0) this.container.sprite.cacheAsBitmap = false;
        else if (this.scrollX == 0) this.container.sprite.cacheAsBitmap = true;
    }

    get tileX() { return this._tileX }
    set tileX(value) {
        this._tileX = this.container.sprite.tileX = value;
        const existsImage = Boolean(player.file.loader.resources[this.image]);
        this.container.sprite.width = (existsImage) ? this.container.sprite.texture.width * value : 50 * value;
    }

    get tileY() { return this._tileY }
    set tileY(value) {
        this._tileY = this.container.sprite.tileY = value;
        const existsImage = Boolean(player.file.loader.resources[this.image]);
        this.container.sprite.height = (existsImage) ? this.container.sprite.texture.height * value : 50 * value;
    }

    // Text
    get textOn() { return this._textOn }
    set textOn(value) { this._textOn = this.container.spriteText.visible = value }

    get text() { return this._text }
    set text(value) {
        this._text = value;
        var textExpression = value.replace(/Me./g, this.name + "."); // chage Me by actor's name
        textExpression = textExpression.replace(/{/g, "").replace(/}/g, ""); // delete { and }
        this.container.spriteText.expression = textExpression;
    }

    get font() { return this._font }
    set font(value) { this._font = this.container.spriteText.style.fontFamily = value }

    get size() { return this._size }
    set size(value) { this._size = this.container.spriteText.style.fontSize = value }

    get fill() { return this._fill }
    set fill(value) { this._fill = this.container.spriteText.style.fill = value }

    get style() { return this._style };
    set style(value) { this._style = this.container.spriteText.style.fontStyle = value }

    get align() { return this._align }
    set align(value) { this._align = value; this.container.spriteText.style.align = value.toLowerCase() };

    get offsetX() { return this._offsetX }
    set offsetX(value) {
        this._offsetX = value;
        const w = Math.abs(this.container.sprite.width * this.container.sprite.scale.x);
        var pivot = { x: 0, y: 0 };
        switch (this.container.spriteText.style.align) {
            case "left": pivot = { x: -w / 2 + this.container.spriteText.width / 2 }; break;
            case "right": pivot = { x: w / 2 - this.container.spriteText.width / 2 }; break;
        }
    }

    get offsetY() { return this._offsetY }
    set offsetY(value) { this._offsetY = this.container.spriteText.position.y = value }

    // Sound
    get soundOn() { return this._soundOn }
    set soundOn(value) {
        if (value != this.soundOn) {
            if (value && this.audio.source) this.audio.source.play(this.audio.id);
            else if (this.audio.source) this.audio.source.stop(this.audio.id);
        }
        this._soundOn = value;
    }

    get sound() { return this._sound }
    set sound(value) {
        if (value != this.sound) {
            if (this.audio.source) this.audio.source.stop(this.audio.id);
            this.audio = new Sound(value, { volume: this.volume, loop: this.loop, pan: this.pan, start: this.start });
            if (this.soundOn)
                if (this.audio.source) this.audio.source.play(this.audio.id);
                else if (this.audio.source) this.audio.source.stop(this.audio.id);
        }
        this._sound = value;
    }

    get volume() { return this._volume }
    set volume(value) { this._volume = value; if (this.audio.source) this.audio.source.volume(value) }

    get start() { return this._start }
    set start(value) { this._start = value; if (this.audio.source) this.audio.source.seek(value) }

    get pan() { return this._pan }
    set pan(value) { this._pan = value; if (this.audio.source) this.audio.source.stereo(value) }

    get loop() { return this._loop }
    set loop(value) { this._loop = value; if (this.audio.source) this.audio.source.loop(value) }

    // Physics
    get physicsOn() { return this._physicsOn }
    set physicsOn(value) {
        this._physicsOn = value;
        if (!value) {
            this.rigidbody.setDynamic();
            this.rigidbody.getFixtureList().setSensor(true);
            this.rigidbody.setGravityScale(0);
        }
    }

    get type() { return this._type }
    set type(value) {
        this._type = value;
        switch (value) {
            case "Dynamic": this.rigidbody.setDynamic(); break;
            case "Kinematic": this.rigidbody.setKinematic(); break;
            case "Static": this.rigidbody.setStatic(); break;
        }
    }

    get fixedAngle() { return this._fixedAngle }
    set fixedAngle(value) {
        this._fixedAngle = !value; this.rigidbody.setFixedRotation(!value);
    }

    get velocityX() { return this._velocityX }
    set velocityX(value) {
        this._velocityX = value;
        this.rigidbody.setLinearVelocity(planck.Vec2(value * Physics.metersPerPixel, this.rigidbody.getLinearVelocity().y))
    }

    get velocityY() { return this._velocityY }
    set velocityY(value) {
        this._velocityY = value;
        this.rigidbody.setLinearVelocity(planck.Vec2(this.rigidbody.getLinearVelocity().x, value * Physics.metersPerPixel))
    }

    get angularVelocity() { return this._angularVelocity }
    set angularVelocity(value) { this._angularVelocity = value; this.rigidbody.setAngularVelocity(value) }

    get density() { return this._density }
    set density(value) { this._density = value; this.rigidbody.getFixtureList().setDensity(value) }

    get friction() { return this._friction }
    set friction(value) { this._friction = value; this.rigidbody.getFixtureList().setFriction(value) }

    get restitution() { return this._restitution }
    set restitution(value) { this._restitution = value; this.rigidbody.getFixtureList().setRestitution(value) }

    get dampingLinear() { return this._dampingLinear }
    set dampingLinear(value) { this._dampingLinear = value; this.rigidbody.setLinearDamping(value) }

    get dampingAngular() { return this._dampingAngular }
    set dampingAngular(value) { this._dampingAngular = value; this.rigidbody.setAngularDamping(value) }
}