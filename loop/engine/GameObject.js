class GameObject {

    constructor(engine, actor) {
        this.engine = engine;
        this.actor = actor;
        this.name = actor.name;
        this.spawned = false;
        // Add gameObject to the engines
        this.container = engine.render.stage.addChild(new Container(actor));
        this.rigidbody = engine.physics.world.createBody({ userData: { name: actor.name, tags: actor.tags } });
        this.audio = new Sound(actor.sound);
        this.rule = new Rule(this);
        // Add actor properties
        Object.keys(actor.allProperties).forEach(property => {
            this["_" + property] = actor.allProperties[property];
        });
        Object.assign(this, actor.allProperties);
        // Other properties
        this.initialCameraX = engine.gameState.cameraX;
        this.initialCameraY = engine.gameState.cameraY;
        this.previousPhysicsOn;
        this.originalPhysics = {
            type: this.rigidbody.m_type,
            velocityX: this.rigidbody.getLinearVelocity().x,
            velocityY: this.rigidbody.getLinearVelocity().y,
            angularVelocity: this.rigidbody.getAngularVelocity()
        }
        console.log(this.originalPhysics);
        // debug 
        this.debug = new PIXI.Graphics();
        engine.render.stage.addChild(this.debug);
    }

    remove() {
        this.engine.render.stage.removeChild(this.container);
        this.engine.physics.world.destroyBody(this.rigidbody);
        if (this.audio.source) this.audio.source.stop(this.audio.id);
        delete Input.touchObjects[this.name];
        delete this["rule"];
        this.engine.gameObjects.delete(this.name);
        delete this.engine.scope[this.name];
        this.engine.render.stage.removeChild(this.debug);
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
            // update scrolling
            if (this.scrollX != 0) this.container.sprite.tilePosition.x += this.scrollX * deltaTime;
            if (this.scrollY != 0) this.container.sprite.tilePosition.y += this.scrollY * deltaTime;
            if (this.textOn) {   // update text
                this.container.spriteText.text =
                    math.print(this.container.spriteText.expression, this.engine.scope, { notation: 'fixed', precision: 0 });
                if (this.align == "Left")
                    this.container.spriteText.position.x = (-this.width / 2 + this.container.spriteText.width / 2) + this.offsetX;
                if (this.align == "Right")
                    fthis.container.spriteText.position.x = (this.width / 2 - this.container.spriteText.width / 2) + this.offsetX;
            }
        }
    }

    update() { // render update
        if (this.screen) {
            if (this.engine.gameState.cameraX != this.initialCameraX) this.x = this.actor.x + this.engine.gameState.cameraX;
            if (this.engine.gameState.cameraY != this.initialCameraY) this.y = this.actor.y + this.engine.gameState.cameraY;
        }
        if (this.engine.gameState.debug) {  // render debug lines
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
    set width(value) { // sprite.width = sprite.texture.width * tileX;  this.width = sprite.width * sprite.scale.x 
        this._width = value;
        this.container.sprite.scale.x = value / this.container.sprite.width;
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
        //  this.rigidbody.getFixtureList().setSensor(true);
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
            this.container.updateSprite(value, this.tileX, this.tileY);
            if (this.container.sprite.width * this.container.sprite.scale.x != this._width)  // update width to update collider
                this.width = this.container.sprite.width * this.container.sprite.scale.x;
            if (this.container.sprite.height * this.container.sprite.scale.y != this._height) // update height to update collider
                this.height = this.container.sprite.height * this.container.sprite.scale.y;
        }
    }

    get color() { return this._color }
    set color(value) { this._color = value; this.container.sprite.tint = PIXI.utils.string2hex(value) }

    get opacity() { return this._opacity }
    set opacity(value) { this._opacity = this.container.sprite.alpha = value }

    get flipX() { return this._flipX }
    set flipX(value) { this._flipX = value; this.container.sprite.scale.x *= (value) ? -1 : 1 }

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
        this.previousPhysicsOn = this._physicsOn;
        this._physicsOn = value;
        console.log(this.originalPhysics);
        if (value) {
            if (this.previousPhysicsOn) {
                this.type = this.originalPhysics.type;
                this.velocityX = this.originalPhysics.velocityX;
                this.velocityY = this.originalPhysics.velocityY;
                this.angularVelocity = this.originalPhysics.angularVelocity;
            }
        }
        else {
            this.originalPhysics = {
                type: this.rigidbody.m_type,
                velocityX: this.rigidbody.getLinearVelocity().x,
                velocityY: this.rigidbody.getLinearVelocity().y,
                angularVelocity: this.rigidbody.getAngularVelocity()
            }
            this.rigidbody.setDynamic();
            this.rigidbody.getFixtureList().setSensor(true);
            this.rigidbody.setGravityScale(0);
            this.velocityX = 0;
            this.velocityY = 0;
            this.angularVelocity = 0;
        }
        if (this.name == "star") console.log("start", this.originalPhysic, this.rigidbody.m_type, value);
    }

    get type() { return this._type }
    set type(value) {
        this._type = value;
        if (this.physicsOn) switch (value) { // only changes the type if physics are active
            case "Dynamic": this.rigidbody.setDynamic(); break;
            case "Kinematic": this.rigidbody.setKinematic(); break;
            case "Static": this.rigidbody.setStatic(); break;
        }
    }

    get fixedAngle() { return this._fixedAngle }
    set fixedAngle(value) { this._fixedAngle = value; this.rigidbody.setFixedRotation(value) }

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
