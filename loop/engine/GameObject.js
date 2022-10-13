class GameObject {

    constructor(engine, actor, spawned) {
        this.engine = engine;
        this.actor = actor;
        this.spawned = spawned;
        this.name = (spawned) ? actor.name + Utils.id() : actor.name;
        // Add gameObject to the engines
        this.container = new Container(this);
        this.rigidbody = new Rigidbody(this);
        this.audio = new Sound(actor.sound);
        this.rule = new Rule(this);
        // Add actor properties to gameObject
        Object.keys(actor.allProperties).forEach(property => {
            this["_" + property] = actor.allProperties[property];
        });
        this._physicsOn = undefined;
        Object.assign(this, actor.allProperties);
        // Add gameObject to scope and gameObject list in the engine
        engine.gameObjects.set(this.name, this);
        engine.scope[this.name] = this;
    }

    remove() {
        this.engine.render.stage.removeChild(this.container);
        this.engine.physics.world.destroyBody(this.rigidbody);
        if (this.audio.source) this.audio.source.stop(this.audio.id);
        delete Input.touchObjects[this.name];
        delete this["rule"];
        this.engine.gameObjects.delete(this.name);
        delete this.engine.scope[this.name];
    }

    fixedStep() { // physics update
        this.x = this.rigidbody.getPosition().x * Physics.pixelsPerMeter;
        this.y = this.rigidbody.getPosition().y * Physics.pixelsPerMeter;
        this.angle = Utils.degrees(this.rigidbody.getAngle());
    }

    fixedUpdate(deltaTime) { // logic update
        if (this.spawned) this.spawned = false; // CRUD - CREATE. To avoid executing the rules the first time the object is generated
        else if (this.dead) this.remove();// CRUD - DELETE
        else { // CRUD - UPDATE
            if (this.rule) try { this.rule.eval(this.engine.scope); } catch (error) { console.log(error); }    // update logic
            if (this.textOn) Container.updateText(this.container.spriteText, this.engine.scope, this.align, this.width, this.offsetX);
            Container.updateScroll(this.scrollX, this.scrollY, this.container.sprite, deltaTime);
        }
    }

    update() { // render update
        if (this.screen) {  // render screen gameObject
            this.x = this.actor.x + this.engine.gameState.cameraX;
            this.y = this.actor.y + this.engine.gameState.cameraY;
        }
        if (this.engine.gameState.debug) // render debug lines
            Container.renderDebugLines(this.container, this.rigidbody, this.x, this.y, this.angle, this.collider, this.zIndex);
    }

    // access to GameObject properties
    get sleeping() { return this._sleeping }
    set sleeping(value) { this.rigidbody.setActive(!value); this._sleeping = value; }

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
    set width(value) { // sprite.width = sprite.texture.width * tileX;  this.width = sprite.width * sprite.scale.x 
        this._width = value;
        this.container.sprite.scale.x = (this.flipX) ? value / this.container.sprite.width : -value / this.container.sprite.width;
        this.collider = this._collider; // update collider
    }

    get height() { return this._height }
    set height(value) {
        this._height = value;
        this.container.sprite.scale.y = value / this.container.sprite.height;
        this.collider = this._collider; // update collider
    }

    get scaleX() { return this._scaleX }
    set scaleX(value) {
        if (value != this._scaleX) {
            this._scaleX = value;
            this.container.sprite.scale.x = (this.flipX) ? -value : value;
            this.width = this.container.sprite.width * this.container.sprite.scale.x; // update widht to update collider
        }
    }

    get scaleY() { return this._scaleY }
    set scaleY(value) {
        if (value != this._scaleY) {
            this._scaleY = value;
            this.container.sprite.scale.y = (this.flipY) ? -value : value;
            this.height = this.container.sprite.height * this.container.sprite.scale.y; // update height to update collider
        }
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
        var fixture = this.rigidbody.getFixtureList();
        if (fixture) this.rigidbody.destroyFixture(fixture);
        var collisionShape;
        switch (value) {
            case "Circle":
                var diameter = (this.width > this.height) ? this.width : this.height;
                collisionShape = planck.Circle(diameter / 2 * Physics.metersPerPixel); break;
            default:
                collisionShape = planck.Box(this.width / 2 * Physics.metersPerPixel, this.height / 2 * Physics.metersPerPixel);
        }
        this.rigidbody.createFixture({ density: 1, shape: collisionShape });
    }

    get tags() { return this._tags }
    set tags(value) { this._tags = value }

    // Sprite
    get spriteOn() { return this._spriteOn }
    set spriteOn(value) { this._spriteOn = this.container.sprite.visible = value }

    get image() { return this._image }
    set image(value) {
        if (this._image != value) {
            this._image = value;
            Container.updateSpriteTexture(this.container, value, this.tileX, this.tileY, this.flipX, this.flipY);
            if (this.container.sprite.width * this.container.sprite.scale.x != this._width)  // update width to update collider
                this.width = math.abs(this.container.sprite.width * this.container.sprite.scale.x);
            if (this.container.sprite.height * this.container.sprite.scale.y != this._height) // update height to update collider
                this.height = math.abs(this.container.sprite.height * this.container.sprite.scale.y);
        }
    }

    get color() { return this._color }
    set color(value) { this._color = value; this.container.sprite.tint = PIXI.utils.string2hex(value) }

    get opacity() { return this._opacity }
    set opacity(value) { this._opacity = this.container.sprite.alpha = value }

    get flipX() { return this._flipX }
    set flipX(value) {
        this._flipX = value;
        this.container.sprite.scale.x = (value) ? -math.abs(this.container.sprite.scale.x) : math.abs(this.container.sprite.scale.x);
    }

    get flipY() { return this._flipY }
    set flipY(value) { this._flipY = value; this.container.sprite.scale.y *= (value) ? -1 : 1 }

    get scrollX() { return this._scrollX }
    set scrollX(value) { this._scrollX = value }

    get scrollY() { return this._scrollY }
    set scrollY(value) { this._scrollY = value }

    get tileX() { return this._tileX }
    set tileX(value) { this._tileX = value }

    get tileY() { return this._tileY }
    set tileY(value) { this._tileY = value }

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

    get style() { return this._style }
    set style(value) { this._style = this.container.spriteText.style.fontStyle = value }

    get align() { return this._align }
    set align(value) { this._align = value; this.container.spriteText.style.align = value.toLowerCase() }

    get offsetX() { return this._offsetX }
    set offsetX(value) {
        this._offsetX = value;
    }

    get offsetY() { return this._offsetY }
    set offsetY(value) { this._offsetY = this.container.spriteText.position.y = value }

    // Sound
    get soundOn() { return this._soundOn }
    set soundOn(value) {
        if (value && this.audio.source) this.audio.source.play(this.audio.id);
        else if (this.audio.source) this.audio.source.stop(this.audio.id);
        this._soundOn = value;
    }

    get sound() { return this._sound }
    set sound(value) {
        if (value != this._sound) {
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
        if (value != this._physicsOn) {
            (this.engine.gameState.physicsOn && value) ? Rigidbody.convertToRigidbody(this) : Rigidbody.convertToSensor(this);
            this._physicsOn = value;
        }
    }

    get type() { return this._type.toLowerCase() }
    set type(value) {
        if (value != this._type) {
            this._type = value;
            (this.engine.gameState.physicsOn && this.physicsOn) ? Rigidbody.convertToRigidbody(this) : Rigidbody.convertToSensor(this);
        }
    }

    get fixedAngle() { return this._fixedAngle }
    set fixedAngle(value) { this._fixedAngle = value; this.rigidbody.setFixedRotation(value) }

    get velocityX() { return this.rigidbody.getLinearVelocity().x * Physics.pixelsPerMeter }
    set velocityX(value) {
        this.rigidbody.setLinearVelocity(planck.Vec2(value * Physics.metersPerPixel, this.rigidbody.getLinearVelocity().y));
    }

    get velocityY() { return this.rigidbody.getLinearVelocity().y * Physics.pixelsPerMeter }
    set velocityY(value) {
        this.rigidbody.setLinearVelocity(planck.Vec2(this.rigidbody.getLinearVelocity().x, value * Physics.metersPerPixel))
    }

    get angularVelocity() { return Utils.degrees(this.rigidbody.getAngularVelocity()) }
    set angularVelocity(value) { this.rigidbody.setAngularVelocity(Utils.radians(value)) }

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
