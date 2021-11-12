class GameObject {

    constructor(engine, actor, spawnName) {
        this.dead = false;
        this.engine = engine;
        this.actor = actor;
        this.name = (spawnName) ? spawnName : actor.name;
        this.sleeping = actor.sleeping;
        this.physicsOn = actor.physicsOn;
        this.collider = actor.collider;
        for (let key in actor.newProperties) { this[key] = actor[key]; } // add new properties
        // add container to stage
        this.container = engine.render.stage.addChild(new Container(actor));
        // add rigidbody to world
        var body = new Body(actor);
        this.rigidbody = engine.physics.world.createBody(body.bodyDef);
        this.rigidbody.createFixture(body.fixtureDef);
        if (!this.physicsOn) {
            this.rigidbody.setDynamic();
            this.rigidbody.getFixtureList().setSensor(true);
            this.rigidbody.setGravityScale(0);
        }
        // add bounding box to debug
        if (engine.debug) {
            this.debug = new PIXI.Graphics();
            engine.render.stage.addChild(this.debug);
        }
        // compile the script if exist for this gameObject
        if (actor.scriptList.length) this.rule = new Rule(this);// this is the gameObject, no the actor
        // store the previous state for render integration
        this.previousState = { x: actor.x, y: actor.y, angle: actor.angle, tilePositionX: 0, tilePositionY: 0 };
    }

    fixedStep() {
        if (!this.sleeping) {
            this.x = this.rigidbody.getPosition().x * Physics.pixelsPerMeter;
            this.y = this.rigidbody.getPosition().y * Physics.pixelsPerMeter;
            this.angle = this.rigidbody.getAngle() * 180 / Math.PI;
        }
    }

    fixedUpdate(deltaTime, scope) { // logic update
        if (!this.sleeping) {
            // store previous state
            this.previousState = {
                x: this.x, y: this.y, angle: this.angle,
                tilePositionX: (this.scrollX != 0) ? this.container.sprite.tilePosition.x : 0,
                tilePositionY: (this.scrollY != 0) ? this.container.sprite.tilePosition.y : 0,
            }
            // update scrolling
            if (this.scrollX != 0) this.container.sprite.tilePosition.x += this.scrollX * deltaTime;
            if (this.scrollY != 0) this.container.sprite.tilePosition.y += this.scrollY * deltaTime;
            // update text
            if (this.textOn) {
                this.text = math.print(this.container.text.expression, scope, { notation: 'fixed', precision: 1 });
                if (this.align == "left") this.container.text.position.x -= (this.width / 2 - this.container.text.width / 2) + this.offsetX;
                if (this.align == "right") this.container.text.position.x -= (-this.width / 2 + this.container.text.width / 2) + this.offsetX;
            }
            // update logic
            if (this.rule)
                try { this.rule.eval(scope); }
                catch (error) { console.log(error); }
        }
        if (this.dead) {
            this.engine.render.stage.removeChild(this.container);
            if (this.debug) this.engine.render.stage.removeChild(this.debug);
            this.engine.physics.world.destroyBody(this.rigidbody);
            this.engine.gameObjects.delete(this.name);
            delete this.engine.scope[this.name];
        }
    }

    integrate(lagOffset) { // integrate render positions
        if (!this.sleeping) {
            this.x = this.x * lagOffset + this.previousState.x * (1 - lagOffset);
            this.y = this.y * lagOffset + this.previousState.y * (1 - lagOffset);
            this.angle = this.angle * lagOffset + this.previousState.angle * (1 - lagOffset);
            if (this.scrollX != 0) this.container.sprite.tilePosition.x = this.container.sprite.tilePosition.x * lagOffset + this.previousState.tilePositionX * (1 - lagOffset);
            if (this.scrollY != 0) this.container.sprite.tilePosition.y = this.container.sprite.tilePosition.y * lagOffset + this.previousState.tilePositionY * (1 - lagOffset);

        }
        if (this.debug) {  // debug lines
            this.debug.clear();
            this.debug = Object.assign(this.debug, { x: this.x, y: this.y, angle: this.angle });
            this.debug.lineStyle(1, 0xFF0000, 1, 0.5);
            switch (this.collider) {
                case "Box": {
                    var shape = this.rigidbody.getFixtureList().getShape();
                    this.debug.moveTo(shape.getVertex(0).x * Physics.pixelsPerMeter, shape.getVertex(0).y * Physics.pixelsPerMeter);
                    for (var v = 1; v < shape.m_count; v++) {
                        this.debug.lineTo(shape.getVertex(v).x * Physics.pixelsPerMeter, shape.getVertex(v).y * Physics.pixelsPerMeter);
                    }
                    this.debug.lineTo(shape.getVertex(0).x * Physics.pixelsPerMeter, shape.getVertex(0).y * Physics.pixelsPerMeter); break;
                }
                case "Circle": {
                    var radius = this.rigidbody.getFixtureList().getShape().m_radius;
                    this.debug.drawCircle(0, 0, radius * Physics.pixelsPerMeter); break;
                }
            }
        }
    }

    // access to GameObject properties
    get x() { return this.container.x };
    set x(value) {
        this.container.x = value;
        this.rigidbody.setPosition(planck.Vec2(value * Physics.metersPerPixel, this.rigidbody.getPosition().y));
    };

    get y() { return this.container.y };
    set y(value) {
        this.container.y = value;
        this.rigidbody.setPosition(planck.Vec2(this.rigidbody.getPosition().x, value * Physics.metersPerPixel));
    };

    get width() { return Math.abs(this.container.sprite.width * this.container.sprite.scale.x) };
    set width(value) {  // sprite width don't include scale only tile
        this.container.sprite.scale.x = value / this.container.sprite.width;
        this.rigidbody.getFixtureList().m_shape = planck.Box((this.width / 2) * Physics.metersPerPixel, (this.height / 2) * Physics.metersPerPixel);
    };

    get height() { return Math.abs(this.container.sprite.height * this.container.sprite.scale.y) };
    set height(value) {
        this.container.sprite.scale.y = value / this.container.sprite.height;
        this.rigidbody.getFixtureList().m_shape = planck.Box((this.width / 2) * Physics.metersPerPixel, (this.height / 2) * Physics.metersPerPixel);
    };

    get scaleX() { return this.container.sprite.scale.x };
    set scaleX(value) {
        this.container.sprite.scale.x = value;
        this.rigidbody.getFixtureList().m_shape = planck.Box((this.width / 2) * Physics.metersPerPixel, (this.height / 2) * Physics.metersPerPixel);
    };

    get scaleY() { return this.container.sprite.scale.y };
    set scaleY(value) {
        this.container.sprite.scale.y = value;
        this.rigidbody.getFixtureList().m_shape = planck.Box((this.width / 2) * Physics.metersPerPixel, (this.height / 2) * Physics.metersPerPixel);
    };

    get angle() { return this.container.angle };
    set angle(value) {
        this.container.angle = value;
        this.rigidbody.setAngle(value * Math.PI / 180);
    };

    get spriteOn() { return this.container.sprite.visible };
    set spriteOn(value) { this.container.sprite.visible = value };

    get image() { return this.container.sprite.image };
    set image(value) {
        if (value != this.container.sprite.image) {
            this.container.sprite.cacheAsBitmap = false;
            this.container.sprite.image = value;
            this.container.sprite.texture = player.file.loader.resources[value].texture;
            this.container.sprite.texture.rotate = 8;
            this.container.sprite.width = this.container.sprite.texture.width * this.container.sprite.tileX;
            this.container.sprite.height = this.container.sprite.texture.height * this.container.sprite.tileY;
            this.rigidbody.getFixtureList().m_shape = Body.getCollider(this.collider, this.width, this.height);
        }
    };

    get color() { return PIXI.utils.hex2string(this.container.sprite.tint) };
    set color(value) { 
        this.container.sprite.cacheAsBitmap = false;
        this.container.sprite.tint = PIXI.utils.string2hex(value) ;
    }

    get opacity() { return this.container.sprite.alpha };
    set opacity(value) { this.container.sprite.alpha = value };

    get flipX() { return (Math.sign(this.container.sprite.scale.x) == 1) ? false : true };
    set flipX(value) { this.container.sprite.scale.x = (value) ? -Math.abs(this.container.sprite.scale.x) : Math.abs(this.container.sprite.scale.x) };

    get flipY() { return (Math.sign(this.container.sprite.scale.y) == 1) ? false : true };
    set flipY(value) { this.container.sprite.scale.y = (value) ? - Math.abs(this.container.sprite.scale.y) : Math.abs(this.container.sprite.scale.y) };

    get scrollX() { return this.container.sprite.scrollX };
    set scrollX(value) { this.container.sprite.scrollX = value };

    get scrollY() { return this.container.sprite.scrollY };
    set scrollY(value) { this.container.sprite.scrollY = value }

    get tileX() { return this.container.sprite.tileX };
    set tileX(value) {
        const existsImage = Boolean(player.file.loader.resources[this.container.sprite.image]);
        this.container.sprite.tileX = value;
        this.container.sprite.width = (existsImage) ? this.container.sprite.texture.width * value : 50 * value;
    };

    get tileY() { return this.container.sprite.tileY };
    set tileY(value) {
        const existsImage = Boolean(player.file.loader.resources[this.container.sprite.image]);
        this.container.sprite.tileY = value;
        this.container.sprite.height = (existsImage) ? this.container.sprite.texture.height * value : 50 * value;
    };

    get textOn() { return this.container.text.visible };
    set textOn(value) { this.container.text.visible = value };

    get text() { return this.container.text.text };
    set text(value) { this.container.text.text = value };

    get font() { return this.container.text.style.fontFamily };
    set font(value) { this.container.text.style.fontFamily = value };

    get size() { return this.container.text.style.fontSize };
    set size(value) { this.container.text.style.fontSize = value };

    get fill() { return this.container.text.style.fill };
    set fill(value) { this.container.text.style.fill = value };

    get style() { return this.container.text.style.fontStyle };
    set style(value) { this.container.text.style.fontStyle = value };

    get align() { return this.container.text.style.align };
    set align(value) { this.container.text.style.align = value.toLowerCase() };

    get offsetX() { return this.container.text.position.x };
    set offsetX(value) {
        const w = Math.abs(this.container.sprite.width * this.container.sprite.scale.x);
        var pivot = { x: 0, y: 0 };
        switch (this.container.text.style.align) {
            case "left": pivot = { x: -w / 2 + this.container.text.width / 2 }; break;
            case "right": pivot = { x: w / 2 - this.container.text.width / 2 }; break;
        }
        this.container.text.position.x = pivot.x + value;
    };

    get offsetY() { return this.container.text.position.y };
    set offsetY(value) {
        this.container.text.position.y = value;
    };
}