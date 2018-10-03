var Crowdjump = Crowdjump || {};

// =============================================================================
// globals
// =============================================================================
Crowdjump.Game = function (game) {

    var is_walking = false;
    var is_sprinting = false;
    var second_jump = true;
    var hero_on_wall = false;
    var hero_on_ice = false;
    var hero_bounce_velocity = 0;
    var jumpTimer = 0;
    var lives = CONST_HERO_LIVES;
    var cheat_activated = false;
    var cheat_possible = false

    var lavaConverts = [];
    var newLava = [];
    var oldGround = [];

    var spawnPlattforms = [];

    var level_data;
    var level;
    var last_second = 0;
    var seconds_last_level = 0;
    var pause_time = 0;

    var pu_lavaorb = false;
    var pu_jumpboost = false;
    var pu_doublejump = false;
    var pu_permjumpboost = false;
    var pu_throughwalls = false;
    var pu_timeslow = 1;

    var movespeed_boost = 0;

    var zhonya_activated = false;
    var zhonya_cooldown = false;
    var time_zhonya_activated = 0;
    var time_zhonya_cooldown = 0;

    var nextFire = 0;
    var next_cannon_fire = 0;
    var bulletsprite;
    var bullets;
    var death;
    var bullets_left = CONST_MAGAZINE;


    var tween = null;

    var show_fps = false;
    var first_moved = -1;
    var timeeggs = 0;

    var sizex = 960;
    var sizey = 600;
    var day = false;
}

Crowdjump.Game = {};

// =============================================================================
// sprites
// =============================================================================

//
// hero sprite
//
function Hero(game, x, y) {
    // call Phaser.Sprite constructor
    if (game.character == 0) Phaser.Sprite.call(this, game, x, y, 'c0');
    else Phaser.Sprite.call(this, game, x, y, game.character);
    this.anchor.set(0.5, 0.5);

    // physic properties
    if (CONST_P2_PHYSICS) {
        this.game.physics.p2.enable(this);
        this.body.setMaterial(heroMaterial);
        this.body.fixedRotation = true;

    } else {
        this.game.physics.enable(this);
        this.body.drag.x = CONST_HERO_WEIGHT;
        // this.body.maxVelocity = CONST_MAX_SPEED;
        // this.body.maxAngular = CONST_MAX_SPEED;

    }
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.x = CONST_MAX_SPEED;

    this.animations.add('stop', [0]);
    this.animations.add('run', [1, 2], 8, true); // 8fps looped
    this.animations.add('jump', [3]);
    this.animations.add('fall', [4]);
    this.animations.add('zhonya', [6]);


    this.body.onConveyor = 0;
    this.body.wasConveyor = 0;
    // this.body.slowEmitter = this.game.add.emitter(this.body.sprite.x, this.body.sprite.y, 100);
    // this.body.slowEmitter.makeParticles("white_smoke");
    // this.body.slowEmitter.setYSpeed(-80, -120);
    // this.body.slowEmitter.on = false;
    // this.body.slowEmitter.setScale(0, 1, 0, 1, -300);
    // this.body.slowEmitter.start(false, 500, 10, 0, false);
    // this.body.slowEmitter.particleBringToTop = true;

    // this.onWallLastFrame = false;
    // this.lastWallSlideAt = 0;
    // this.lastWallSide = 0;
    //
    // this.wallslideEmitter = this.game.add.emitter(this.x, this.y, 100);
    // this.wallslideEmitter.makeParticles("white-particle");
    // this.wallslideEmitter.setYSpeed(-80, -120);
    // this.wallslideEmitter.on = false;
    // this.wallslideEmitter.setScale(0, 1, 0, 1, -300);
    // this.wallslideEmitter.start(false, 500, 10, 0, false);

    if (CONST_DEBUG) {
        this.body.debug = true;
    }
}


// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    var movespeed = movespeed_boost;

    if (CONST_USE_ACCELERATION) {
        movespeed += CONST_ACCELERATION;
    } else {
        movespeed += CONST_MOVE_SPEED
    }

    if (CONST_WALK && is_walking) movespeed *= 0.5;
    if (CONST_SPRINT && is_sprinting) movespeed *= 2;


    if ((CONST_USE_ACCELERATION && !CONST_P2_PHYSICS) || hero_on_ice) {
        this.body.acceleration.x = direction * movespeed;

        // update image flipping & animations
        if (this.body.acceleration.x < 0) {
            this.scale.x = -1;
        }
        else if (this.body.acceleration.x > 0) {
            this.scale.x = 1;
        }

    } else {
        if (direction != 0 && this.body.wasConveyor != 0 && direction != this.body.wasConveyor) {
            this.body.wasConveyor = 0;
        }
        if (this.body.onConveyor != 0 && (signum(direction) != signum(this.body.onConveyor))) {
            if (direction > 0) this.body.velocity.x = Math.min(CONST_MAX_SPEED, Math.max(direction * movespeed + this.body.onConveyor, this.body.velocity.x));
            if (direction < 0) this.body.velocity.x = Math.max(-CONST_MAX_SPEED, Math.min(direction * movespeed + this.body.onConveyor, this.body.velocity.x));
            if (direction != 0) this.body.wasConveyor = direction;

        }
        else if (this.body.onConveyor != 0) {
            if (direction > 0) this.body.velocity.x = Math.min(CONST_MAX_SPEED, Math.max(direction * movespeed, this.body.velocity.x));
            if (direction < 0) this.body.velocity.x = Math.max(-CONST_MAX_SPEED, Math.min(direction * movespeed, this.body.velocity.x));

        } else if (this.body.wasConveyor != 0) {

        }
        else {
            this.body.velocity.x = direction * movespeed;
        }


        // update image flipping & animations
        if (this.body.velocity.x < 0) {
            this.scale.x = -1;
        }
        else if (this.body.velocity.x > 0) {
            this.scale.x = 1;
        }
    }
};

Hero.prototype.jump = function () {
    var canJump = cheat_activated;
    var jump_speed = CONST_JUMP_SPEED;
    if (pu_permjumpboost) jump_speed = jump_speed * CONST_POWERUPS_PERMJUMPBOOST;

    Crowdjump.Game.firstMoved();

    if (CONST_P2_PHYSICS) {
        canJump = true;
        second_jump = true;
    } else {
        canJump = (this.body.touching.down || cheat_activated);
        if (this.body.touching.down) {
            second_jump = true;
        }
    }

    if (CONST_LONG_JUMP) {
        if (canJump) jumpTimer = 0;
        if ((Crowdjump.Game.keys.up.isDown || Crowdjump.Game.keys.space.isDown || Crowdjump.Game.wasd.up.isDown) && (jumpTimer > 0)) {
            //jump higher
            this.body.velocity.y = -jump_speed;
            jumpTimer++;
            if (jumpTimer == CONST_MAX_LONG_JUMP) {
                jumpTimer = 0;
            }
            return;
        }
    }

    if (canJump || (hero_on_wall && CONST_WALL_JUMP)) {
        if (pu_jumpboost) {
            this.body.velocity.y = -(CONST_POWERUPS_JUMPBOOST * jump_speed);
            pu_jumpboost = false;
        } else {
            this.body.velocity.y = -jump_speed;
        }
        jumpTimer = 1;
        game.jumps++;
    } else {
        if (second_jump && (CONST_DOUBLE_JUMP || pu_doublejump)) {
            if (pu_jumpboost) {
                this.body.velocity.y = -(1.1 * jump_speed);
                pu_jumpboost = false;
            } else {
                this.body.velocity.y = -(jump_speed * 0.8);
            }
            game.jumps++;
            second_jump = false;
            return true;
        }
    }

    return canJump;
};

Hero.prototype.bounce = function () {
    this.body.velocity.y = -CONST_BOUNCE_SPEED;
};

Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    if (CONST_ANIMATE_CHARACTER) {
        let animationName = this._getAnimationName();
        if (this.animations.name !== animationName) {
            this.animations.play(animationName);
        }
    }
};

Hero.prototype._getAnimationName = function () {
    let name = 'stop'; // default animation

    // jumping
    if (this.body.velocity.y < 0) {
        name = 'jump';
    }
    // falling
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall';
    }
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'run';
    }
    if (zhonya_activated) {
        name = 'zhonya';
    }

    return name;
};

function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');

    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('crawl', [0, 1, 2], 8, true); // 8fps, looped
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
    this.animations.play('crawl');

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    // this.body.velocity.x = CONST_SPIDER_SPEED;
    this.coinDrop = CONST_SPIDER_COINS;


    if (CONST_DEBUG) {
        this.body.debug = true;
    }
}

// inherit from Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -(CONST_SPIDER_SPEED * pu_timeslow); // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = (CONST_SPIDER_SPEED * pu_timeslow); // turn right
    }
};

Spider.prototype.die = function () {
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};

// =============================================================================
// game states
// =============================================================================


//executed per LEVEL
Crowdjump.Game.init = function (data) {
    jumpButton = null;
    this.game.renderer.renderSession.roundPixels = true;

    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        space: Phaser.KeyCode.SPACEBAR,
        up: Phaser.KeyCode.UP,
        down: Phaser.KeyCode.DOWN, //Fix Scrolling Bug
        esc: Phaser.KeyCode.ESC,
        ctrl: Phaser.KeyCode.CONTROL,
        shift: Phaser.KeyCode.SHIFT
    });

    jump = function () {
        let didJump = this.hero.jump();
        if (didJump) {
            this.sfx.jump.play("", 0, 0.2, false, true);
        }
    };

    this.keys.left.onDown.add(this._countMovementInput, this);
    this.keys.right.onDown.add(this._countMovementInput, this);

    if (CONST_SPRINT) {
        this.keys.ctrl.onDown.add(this._activateSprint, this);
        this.keys.ctrl.onUp.add(this._deactivateSprint, this);
    }
    if (CONST_WALK) {
        this.keys.shift.onDown.add(this._activateWalk, this);
        this.keys.shift.onUp.add(this._deactivateWalk, this);
    }

    this.keys.up.onDown.add(jump, this);
    this.keys.space.onDown.add(jump, this);

    this.keys.esc.onDown.add(this.mainMenu);

    this.wasd = {};
    if (CONST_WASD_CONTROLS) {
        this.input.keyboard.addKey(Phaser.KeyCode.W).onDown.add(jump, this);

        this.wasd = {
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
        };
        this.wasd.left.onDown.add(this._countMovementInput, this);
        this.wasd.right.onDown.add(this._countMovementInput, this);
    }
    if (CONST_CONTROLLER) {
    }


    if (typeof  data !== 'undefined') {
        level = data.level;

    } else {
        level = 0;
    }
    if (level == 0 && game.authenticated) {
        switch (game.difficulty) {
            case DIFFICULTY.easy:
                game.gameInfoEasy["rounds_started"] = game.gameInfoEasy["rounds_started"] + 1;
                break;
            case DIFFICULTY.normal:
                game.gameInfoNormal["rounds_started"] = game.gameInfoNormal["rounds_started"] + 1;
                break;
            case DIFFICULTY.hard:
                game.gameInfoHard["rounds_started"] = game.gameInfoHard["rounds_started"] + 1;
                break;
        }
    }
    first_moved = -1;
    second_jump = true;
    hero_on_wall = false;
    hero_on_ice = false;
    hero_bounce_velocity = 0;
    last_second = 0;

    //powerups
    pu_jumpboost = false;
    pu_permjumpboost = false;
    pu_lavaorb = false;
    pu_doublejump = false;
    pu_throughwalls = false;
    pu_timeslow = 1;

    //easeggs
    movespeed_boost = 0;
    timeeggs = 0;

    bullets_left = CONST_MAGAZINE;
    nextFire = 0;

    //cannons
    next_cannon_fire = 0;

    jumpTimer = 0;
    pause_time = 0;
    is_sprinting = false;
    is_walking = false;
    lavaConverts = [];
    oldGround = [];
    newLava = [];

    spawnPlatforms = [];

    show_fps = false;

    sizex = 960;
    sizey = 600;
    day = false;

    try {
        if (level == 0 && (lives == undefined || lives <= 0)) lives = CONST_HERO_LIVES;
    } catch (e) {
        lives = CONST_HERO_LIVES;
    }
    death = false;

    if (CONST_DEBUG) {
        this.game.plugins.add(Phaser.Plugin.DebugArcadePhysics);
        this.game.debug.arcade.on();
    }

};

// load game assets here
Crowdjump.Game.preload = function () {
};

// create game entities and set up world here
Crowdjump.Game.create = function () {
    // create sound entities
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin', 0.8),
        stomp: this.game.add.audio('sfx:stomp'),
        flag: this.game.add.audio('sfx:flag'),
        zhonyas: this.game.add.audio('sfx:zhonya'),
        shoot: this.game.add.audio('sfx:shoot'),
        cannonfire: this.game.add.audio('sfx:cannon_fire'),
        empty_magazine: this.game.add.audio('sfx:empty_magazine'),
        powerup: this.game.add.audio('sfx:powerup'),
        easteregg: this.game.add.audio('sfx:easteregg'),
        open_gate: this.game.add.audio('sfx:open_gate'),
        press_button: this.game.add.audio('sfx:press_button'),
        spawn_platform: this.game.add.audio('sfx:spawn_platform'),
        levelup: this.game.add.audio('sfx:levelup'),
        mystery: this.game.add.audio('sfx:mystery'),
    };


    //Background for Day and Night
    if (CONST_BACKGROUNDIMAGE) {
        var now = new Date();
        var hour = now.getHours();
        var cloud1x = (CONST_CANVAS_X / 2) + 166;
        var cloud2x = (CONST_CANVAS_X / 2) - 33;
        var cloud3x = (CONST_CANVAS_X / 2) - 252;
        var moonSunx = (CONST_CANVAS_X / 2) + 160;
        var cloud1y = 23;
        var cloud2y = 48;
        var cloud3y = 78;
        var moonSuny = 22;

        day = ((hour >= 6 && hour < 18) || false);

        if (day && CONST_DAY_AND_NIGHT) {
            this.game.stage.backgroundColor = '#545d8f';

            this.sky = this.game.add.tileSprite(0,
                this.game.height - this.game.cache.getImage('sky_day').height,
                this.game.width,
                this.game.cache.getImage('sky_day').height,
                'sky_day'
            );
            this.sky.fixedToCamera = true;

            this.moonSun = this.game.add.tileSprite(moonSunx, moonSuny, 42,
                this.game.cache.getImage('sun').height,
                'sun'
            );
            this.moonSun.fixedToCamera = true;

            this.clouds1 = this.game.add.tileSprite(cloud1x, cloud1y,
                this.game.cache.getImage('cloud1_day').width,
                this.game.cache.getImage('cloud1_day').height,
                'cloud1_day'
            );
            this.clouds1.fixedToCamera = true;

            this.clouds2 = this.game.add.tileSprite(cloud2x, cloud2y,
                this.game.cache.getImage('cloud2_day').width,
                this.game.cache.getImage('cloud2_day').height,
                'cloud2_day'
            );
            this.clouds2.fixedToCamera = true;

            this.clouds3 = this.game.add.tileSprite(cloud3x, cloud3y,
                this.game.cache.getImage('cloud3_day').width,
                this.game.cache.getImage('cloud3_day').height,
                'cloud3_day'
            );
            this.clouds3.fixedToCamera = true;

            this.hillsBack = this.game.add.tileSprite(0,
                this.game.height - this.game.cache.getImage('hillsBack_day').height,
                this.game.width,
                this.game.cache.getImage('hillsBack_day').height,
                'hillsBack_day'
            );
            this.hillsBack.fixedToCamera = true;

            this.hillsMiddle = this.game.add.tileSprite(0,
                this.game.height - this.game.cache.getImage('hillsMiddle_day').height,
                this.game.width,
                this.game.cache.getImage('hillsMiddle_day').height,
                'hillsMiddle_day'
            );
            this.hillsMiddle.fixedToCamera = true;

            this.hillsFore = this.game.add.tileSprite(0,
                this.game.height - this.game.cache.getImage('hillsFore_day').height,
                this.game.width,
                this.game.cache.getImage('hillsFore_day').height,
                'hillsFore_day'
            );
            this.hillsFore.fixedToCamera = true;

        } else {
            this.game.stage.backgroundColor = '#545d8f';

            this.sky = this.game.add.tileSprite(0,
                this.game.height - this.game.cache.getImage('sky').height,
                this.game.width,
                this.game.cache.getImage('sky').height,
                'sky'
            );
            this.sky.fixedToCamera = true;

            this.moonSun = this.game.add.tileSprite(moonSunx, moonSuny, 42,
                this.game.cache.getImage('moon').height,
                'moon'
            );
            this.moonSun.fixedToCamera = true;

            this.clouds1 = this.game.add.tileSprite(cloud1x, cloud1y,
                this.game.cache.getImage('cloud1_night').width,
                this.game.cache.getImage('cloud1_night').height,
                'cloud1_night'
            );
            this.clouds1.fixedToCamera = true;

            this.clouds2 = this.game.add.tileSprite(cloud2x, cloud2y,
                this.game.cache.getImage('cloud2_night').width,
                this.game.cache.getImage('cloud2_night').height,
                'cloud2_night'
            );
            this.clouds2.fixedToCamera = true;

            this.clouds3 = this.game.add.tileSprite(cloud3x, cloud3y,
                this.game.cache.getImage('cloud3_night').width,
                this.game.cache.getImage('cloud3_night').height,
                'cloud3_night'
            );
            this.clouds3.fixedToCamera = true;

            this.hillsBack = this.game.add.tileSprite(0,
                this.game.height - this.game.cache.getImage('hillsBack').height,
                this.game.width,
                this.game.cache.getImage('hillsBack').height,
                'hillsBack'
            );
            this.hillsBack.fixedToCamera = true;

            this.hillsMiddle = this.game.add.tileSprite(0,
                this.game.height - this.game.cache.getImage('hillsMiddle').height,
                this.game.width,
                this.game.cache.getImage('hillsMiddle').height,
                'hillsMiddle'
            );
            this.hillsMiddle.fixedToCamera = true;

            this.hillsFore = this.game.add.tileSprite(0,
                this.game.height - this.game.cache.getImage('hillsFore').height,
                this.game.width,
                this.game.cache.getImage('hillsFore').height,
                'hillsFore'
            );
            this.hillsFore.fixedToCamera = true;
        }
    }
    else {
        var c = Phaser.Color.getRandomColor(255, 255, 255);
        this.game.stage.backgroundColor = c;
    }

    zhonya_activated = false;
    zhonya_cooldown = false;
    time_zhonya_activated = 0;
    time_zhonya_cooldown = 0;
    selected_level += 0;
    if (selected_level >= 0) {
        level_data = this.game.cache.getJSON(`level:${selected_level}:${game.difficulty}`);
    } else {
        level_data = this.game.cache.getJSON(`level:${level}:${game.difficulty}`);
    }

    cheat_activated = false;
    cheat_possible = false
    if (account != null) {
        cheat_possible = (CONST_CHEAT && account.username == 'admin')
    }

    this._loadLevel(level_data);

    this._createHud();
    this._createTimerHud();
    this._createLivesHud();

    if (CONST_FPS) {
        game.time.advancedTiming = true;
        fpsText = this.game.add.text(CONST_CANVAS_X - 60, 10, '', {font: '16px Arial', fill: '#ff0000'});
        fpsText.fixedToCamera = true;
    }

    if (CONST_PAUSE) {
        this.input.keyboard.addKey(Phaser.KeyCode.P).onUp.add(this.togglePause, this);
        //
        // this.pausedIndicator = this.add.text(CONST_WORLD_CENTER_X, 0, 'paused', {
        //     fill: 'black',
        //     font: '48px san    s-serif'
        // });
        // this.pausedIndicator.anchor.set(0.5,0.5);
        // this.pausedIndicator.fixedToCamera = true;
        // // this.pausedIndicator.alignIn(this.world.bounds, Phaser.CENTER);
        // this.pausedIndicator.exists = false;
        //
        // // We place this on the Stage, above the World, so we can toggle the World alpha in `paused`/`resumed`.
        // this.stage.addChild(this.pausedIndicator);
    }

    if (CONST_SHOOTING) {
        // this.game.physics.startSystem(Phaser.Physics.ARCADE);
        // this.game.physics.enable(bullets, Phaser.Physics.ARCADE);
        bullets = this.game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        bullets.createMultiple(50, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
        if (!CONST_BULLETDROP) {
            bullets.setAll('body.allowGravity', false);
        }
    }

    if (CONST_CANNONS) {
        cannonballs = this.game.add.group();
        cannonballs.enableBody = true;
        cannonballs.physicsBodyType = Phaser.Physics.ARCADE;

        cannonballs.createMultiple(50, 'cannonball');
        cannonballs.setAll('checkWorldBounds', true);
        cannonballs.setAll('collideWorldBounds', true);
        cannonballs.setAll('outOfBoundsKill', true);
        cannonballs.setAll('body.allowGravity', false);
    }

    if (CONST_ZHONYA) {
        this.input.keyboard.addKey(Phaser.KeyCode.F).onUp.add(this.activate_Zhonyas, this);
    }

    this.input.keyboard.addKey(Phaser.KeyCode.R).onUp.add(this.restart, this);

    if (CONST_MUTE) {
        this.input.keyboard.addKey(Phaser.KeyCode.M).onUp.add(this.toggleMute, this);
        this.input.keyboard.addKey(Phaser.KeyCode.O).onUp.add(this.stopMusic, this);
    }

    if (CONST_FPS) this.input.keyboard.addKey(Phaser.KeyCode.F).onUp.add(this.toggleFPS, this);
    if (CONST_CHEAT) this.input.keyboard.addKey(Phaser.KeyCode.I).onUp.add(this.toggleCheat, this);

    // this.roundTimer = game.time.events.loop(Phaser.Timer.SECOND, this.updateTimer, this);
    this.game.camera.follow(this.hero);
    try {
        if (time_last_level == undefined || time_last_level <= 1) time_last_level = 0;
    } catch (e) {
        time_last_level = 0;
    }
    try {
        if (time_last_level_or_restart == undefined || time_last_level_or_restart <= 1) time_last_level = 0;
    } catch (e) {
        time_last_level_or_restart = 0;
    }

};

Crowdjump.Game.update = function () {

    if (CONST_BACKGROUNDIMAGE) {
        // this.sky.tilePosition.x = game.camera.x*-0.02;
        this.hillsBack.tilePosition.x = game.camera.x * -0.02;
        this.hillsMiddle.tilePosition.x = game.camera.x * -0.1 + 300;
        this.hillsFore.tilePosition.x = game.camera.x * -0.2 + 150;
    }


    if (CONST_P2_PHYSICS) {
        this._handleCollisionsP2();
    } else {
        this._handleCollisions();
    }
    this._handleInput();
    try {
        if (CONST_MOVINGPLATFORMS) this.movingPlatforms.forEach(this._movePlatforms, this);
    } catch (e) {
    }

    var seconds = 0;
    var coins_this_round = (game.coinPickupCount - coins_last_level);

    if (CONST_SAVE_LEVEL_TIME) {
        seconds = (game.time.totalElapsedSeconds().toFixed(3) / 1) - Math.abs(time_last_level_or_restart / 1);
        seconds += time_overall;
        if (time_overall != 0) {

        }
    } else if (first_moved > 0) {
        // seconds = Math.floor(game.time.totalElapsedSeconds().toFixed(3) - first_moved) + time_finished;
        var seconds_this_level = parseFloat(game.time.totalElapsedSeconds().toFixed(3)) - first_moved - (timeeggs);
        seconds = ((seconds_this_level / 1) + parseFloat(time_overall)).toFixed(3);
        // seconds = seconds.toFixed(0);
    } else {
        seconds = (parseFloat(time_overall)).toFixed(3);
        /* - ((CONST_COIN_TIME_REDUCTION / 1000) * game.coinPickupCount);*/
    }
    seconds = Math.floor(seconds);
    if (seconds != last_second) {
        if (level_data.repeats) {
            this._newSpawns({spiders: level_data.repeat_spiders});
        }
        if (CONST_CANNONS && seconds > next_cannon_fire) {
            this._newCannonballs(seconds);
        }
    }
    if (CONST_COIN_SHOW_TIMEREDUCTION) seconds -= ((CONST_COIN_TIME_REDUCTION / 1000) * game.coinPickupCount);
    seconds = Math.floor(seconds);
    if (seconds != last_second) {
        last_second = seconds;
    }

    this.livesFont.text = `${lives}x`;
    this.timeFont.text = `${seconds}`;
    this.coinFont.text = `x${game.coinPickupCount}`;

    if (CONST_FPS && this.game.time.fps !== 0 && show_fps) {
        fpsText.setText(this.game.time.fps + ' FPS');

    }

    if (CONST_LAVASWITCHINGPLATFORM) {
        for (var i = 0; i < lavaConverts.length; i++) {
            if (lavaConverts[i].end <= game.time.totalElapsedSeconds()) {
                var oldTile = lavaConverts[i].groundObject.lavaObject;
                oldGround.push(oldGround);
                var lavaImage = "lava:" + oldTile.image.split(":")[1];

                var newTile = {};
                newTile.x = oldTile.x;
                newTile.y = oldTile.y;
                newTile.image = lavaImage;
                this._spawnLava(newTile);
                lavaConverts[i].groundObject.destroy();
                lavaConverts.splice(i, 1);
                i--;

            }
        }
    }

    if (CONST_BOUNCINGPLATFORMS) {
        if (this.hero.body.velocity.y < hero_bounce_velocity) hero_bounce_velocity = this.hero.body.velocity.y;
    }

    if (CONST_SAWBLADES) {
        for (var i = 0; i < this.sawblades; i++) {
            this.sawblades[i].angle += 6.5;
            this.sawbladesBases[i].angle += 6.5;
        }
    }

    if (CONST_SHOOTING && this.game.input.activePointer.isDown && (!CONST_ZHONYA || CONST_SHOOT_IN_ZHONYA)) {
        this.fire_Bullet();
    }

    if (CONST_ZHONYA) {
        if (zhonya_activated) {
            // var zhonya_time = CONST_ZHONYA_DURATION - Math.abs(Math.floor((game.timeElapsed - time_zhonya_activated) / 1));
            var zhonya_time = CONST_ZHONYA_DURATION - (Math.round(game.timeElapsed / 1) - Math.round(time_zhonya_activated / 1));
            // console.log(game.timeElapsed +  ' (' + Math.round(game.timeElapsed / 1) + ')   ' + time_zhonya_activated +  ' (' + Math.round(time_zhonya_activated / 1) + ')   ' + '  -->  ' + zhonya_time);
            this.zhonyaFont.text = `${zhonya_time}`;
            this.zhonyaFont.setStyle({fill: '#bda73b'});
        }
        if (zhonya_cooldown) {
            // var zhonya_time = CONST_ZHONYA_COOLDOWN - Math.abs(Math.floor((game.timeElapsed - time_zhonya_cooldown) / 1));
            var zhonya_time = CONST_ZHONYA_COOLDOWN - (Math.round(game.timeElapsed / 1) - Math.round(time_zhonya_cooldown / 1));
            // console.log(game.timeElapsed +  ' (' + Math.round(game.timeElapsed / 1) + ')   ' + time_zhonya_cooldown +  ' (' + Math.round(time_zhonya_cooldown / 1) + ')   ' + '  -->  ' + zhonya_time);
            this.zhonyaFont.text = `${zhonya_time}`;
            this.zhonyaFont.setStyle({fill: '#364bbd'});
        }
        if (!zhonya_activated && !zhonya_cooldown) {
            this.zhonyaFont.text = 'ready!';
            this.zhonyaFont.setStyle({fill: '#000000'});
        }
    }
};

Crowdjump.Game._setupPhysicsP2 = function () {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.setImpactEvents(true);
    this.game.physics.defaultRestitution = 0;
    this.game.physics.p2.gravity.y = CONST_GRAVITY;
    this.game.world.enableBodySleeping = true;  //allow bodies to not get calculated when there is nothing to do
    this.game.stage.smoothed = false;  // no antialiasing

    iceMaterial = game.physics.p2.createMaterial('ice');
    heroMaterial = game.physics.p2.createMaterial('hero');
    groundMaterial = game.physics.p2.createMaterial('ground');
    bounceMaterial = game.physics.p2.createMaterial('bounce');

    this.game.physics.p2.createContactMaterial(heroMaterial, groundMaterial, {friction: 2.0, restitution: 0.0});
    this.game.physics.p2.createContactMaterial(heroMaterial, iceMaterial, {friction: 0.1, restitution: 0.0});
    this.game.physics.p2.createContactMaterial(heroMaterial, bounceMaterial, {friction: 0.1, restitution: 5.0});
}

Crowdjump.Game._setupPhysicsArcade = function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = CONST_GRAVITY;
}

Crowdjump.Game._handleCollisions = function () {

    if (CONST_ENEMIES) {
        this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
        this.game.physics.arcade.collide(this.spiders, this.platforms);

    }

    //allow powerup to jump through walls
    if (!pu_throughwalls || this.hero.body.velocity.y >= 0) {
        this.game.physics.arcade.collide(this.hero, this.platforms, this._onHeroVsSpecialPlatform, null, this);

        if (CONST_CANNONS) this.game.physics.arcade.collide(this.hero, this.cannons);
        if (CONST_BUTTONS_AND_GATES) {
            this.game.physics.arcade.collide(this.hero, this.buttons, this._onHeroVsButton, null, this);
            this.game.physics.arcade.collide(this.hero, this.spawns);
        }

    } else {
    }


    if (CONST_MOVINGPLATFORMS) {
        this.game.physics.arcade.collide(this.movingPlatforms, this.platforms);
        this.game.physics.arcade.collide(this.movingPlatforms, this.movingPlatforms);
        this.game.physics.arcade.collide(this.spiders, this.movingPlatforms);
        this.game.physics.arcade.collide(this.hero, this.movingPlatforms, this._onHeroVsSpecialPlatform, null, this);

        //lock the entitys on the platform
        if (CONST_LOCKPLATFORM) {
            this.game.physics.arcade.collide(this.hero, this.movingPlatforms, this.lockPlatform, null, this);
            if (this.hero.locked) {
                if (this.hero.body.right < this.hero.lockedTo.body.x || this.hero.body.x > this.hero.lockedTo.body.right) {
                    this.hero.locked = false;
                    this.hero.lockedTo = null;
                } else {
                    // this.hero.x += this.hero.lockedTo.deltaX;
                    this.hero.y += this.hero.lockedTo.deltaY;
                }
            }
        } else {
            this.game.physics.arcade.collide(this.hero, this.movingPlatforms);
        }
    }

    if (CONST_SLIPPERYPLATFORMS) {
        if (!this.hero.body.touching.down) {
            hero_on_ice = false;
        }
    }

    if (CONST_BOUNCINGPLATFORMS) {
        if (this.hero.body.touching.down) {
            hero_bounce_velocity = 0;
        }
    }

    if (CONST_COINS) this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this);

    if (CONST_POWERUPS) this.game.physics.arcade.overlap(this.hero, this.powerups, this._onHeroVsPowerup,
        null, this);

    if (CONST_EASTEREGGS) this.game.physics.arcade.overlap(this.hero, this.eastereggs, this._onHeroVsEasteregg,
        null, this);

    if (CONST_SAWBLADES) {
        this.game.physics.arcade.overlap(this.hero, this.sawblades, this._onHeroVsSawblade,
            null, this);
        this.game.physics.arcade.collide(this.hero, this.sawbladesBases);
    }

    if (CONST_WALL_JUMP) {
        if (this.hero.body.touching.down) {

            // hero not on the wall
            hero_on_wall = false;
        }
        else if (this.hero.body.touching.right) {

            // hero on a wall
            hero_on_wall = true;
        }
        else if (this.hero.body.touching.left) {
            hero_on_wall = true;
        } else hero_on_wall = false;
    }

    if (CONST_LAVA && !pu_lavaorb && !death) {
        this.game.physics.arcade.overlap(this.hero, this.lava, this._onHeroVsLava,
            null, this);
    }

    if (CONST_SPIKES) {
        // this.game.physics.arcade.overlap(this.hero, this.spikes, this._onHeroVsSpikes,
        //     null, this);
        this.game.physics.arcade.collide(this.hero, this.spikes, this._onHeroVsSpikes, null, this);
    }
    if (CONST_CRATES) {
        this.game.physics.arcade.collide(this.hero, this.crates);
        this.game.physics.arcade.collide(this.crates, this.platforms);
        this.game.physics.arcade.collide(this.spiders, this.crates);
    }

    if (CONST_SHOOTING) {
        // this.game.physics.arcade.collide(this.spiders, bullets);
        // this.game.physics.arcade.collide(bullets, this.platforms);
        this.game.physics.arcade.overlap(bullets, this.spiders, this._onBulletVsEnemy,
            null, this);
        this.game.physics.arcade.overlap(bullets, this.platforms, this._onBulletVsPlatform,
            null, this);
    }

    if (CONST_CANNONS) {
        this.game.physics.arcade.overlap(cannonballs, this.spiders, this._onCannonballVsEnemy,
            null, this);
        this.game.physics.arcade.overlap(cannonballs, this.platforms, this._onCannonballVsPlatform,
            null, this);
        this.game.physics.arcade.overlap(cannonballs, this.cannons, this._onCannonballVsPlatform,
            null, this);
        this.game.physics.arcade.overlap(cannonballs, this.hero, this._onHeroVsCannonball,
            null, this);
        if (CONST_BUTTONS_AND_GATES) {
            this.game.physics.arcade.overlap(cannonballs, this.spawns, this._onCannonballVsPlatform,
                null, this);
            this.game.physics.arcade.overlap(cannonballs, this.gates, this._onCannonballVsPlatform,
                null, this);
        }
    }

    if (CONST_BUTTONS_AND_GATES) {
        this.game.physics.arcade.collide(this.hero, this.gates);
    }

    if (CONST_MYSTERYBOX) {
        this.game.physics.arcade.collide(this.hero, this.mystery, this._onHeroVsMysterybox, null, this);
    }

    if (!CONST_ZHONYA || !zhonya_activated || CONST_KILL_IN_ZHONYA) {
        this.game.physics.arcade.overlap(this.hero, this.spiders,
            this._onHeroVsEnemy, null, this);
    }

    this.game.physics.arcade.overlap(this.hero, this.flags, this._onHeroVsFlag, null, this);
};

Crowdjump.Game._handleCollisionsP2 = function () {
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.hero, this.platforms);


    if (CONST_MOVINGPLATFORMS) {
        this.game.physics.arcade.collide(this.spiders, this.movingPlatforms);
        this.game.physics.arcade.collide(this.movingPlatforms, this.platforms);
        this.game.physics.arcade.collide(this.movingPlatforms, this.movingPlatforms);

        //lock the entitys on the platform
        if (CONST_LOCKPLATFORM) {
            this.game.physics.arcade.collide(this.hero, this.movingPlatforms, this.lockPlatform, null, this);
            if (this.hero.locked) {
                if (this.hero.body.right < this.hero.lockedTo.body.x || this.hero.body.x > this.hero.lockedTo.body.right) {
                    this.hero.locked = false;
                    this.hero.lockedTo = null;
                } else {
                    // this.hero.x += this.hero.lockedTo.deltaX;
                    this.hero.y += this.hero.lockedTo.deltaY;
                }
            }
        } else {
            this.game.physics.arcade.collide(this.hero, this.movingPlatforms);
        }
    }

    if (CONST_SLIPPERYPLATFORMS) {
        if (!this.hero.body.touching.down) {
            hero_on_ice = false;
        }
    }

    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this);

    this.game.physics.arcade.overlap(this.hero, this.powerups, this._onHeroVsPowerup,
        null, this);

    if (CONST_WALL_JUMP) {
        //     if (this.hero.body.touching.down) {
        //
        //         // hero not on the wall
        //         hero_on_wall = false;
        //     }
        //     else if (this.hero.body.touching.right) {
        //
        //         // hero on a wall
        //         hero_on_wall = true;
        //     }
        //     else if (this.hero.body.touching.left) {
        //         hero_on_wall = true;
        //     } else hero_on_wall = false;
    }

    if (CONST_LAVA && !pu_lavaorb && !death) {
        this.game.physics.arcade.overlap(this.hero, this.lava, this._onHeroVsLava,
            null, this);
    }

    if (CONST_CRATES) {
        this.game.physics.arcade.collide(this.hero, this.crates);
        this.game.physics.arcade.collide(this.crates, this.platforms);
        this.game.physics.arcade.collide(this.spiders, this.crates);
    }

    if (CONST_SHOOTING) {
        // this.game.physics.arcade.collide(this.spiders, bullets);
        // this.game.physics.arcade.collide(bullets, this.platforms);
        this.game.physics.arcade.overlap(bullets, this.spiders, this._onBulletVsEnemy,
            null, this);
        this.game.physics.arcade.overlap(bullets, this.platforms, this._onBulletVsPlatform,
            null, this);
    }

    if (CONST_CANNONS) {
        this.game.physics.arcade.overlap(cannonballs, this.spiders, this._onCannonballVsEnemy,
            null, this);
        this.game.physics.arcade.overlap(cannonballs, this.platforms, this._onCannonballVsPlatform,
            null, this);
        this.game.physics.arcade.overlap(cannonballs, this.hero, this._onHeroVsCannonball,
            null, this);
    }

    if (!CONST_ZHONYA || !zhonya_activated || CONST_KILL_IN_ZHONYA) {
        this.game.physics.arcade.overlap(this.hero, this.spiders,
            this._onHeroVsEnemy, null, this);
    }

    this.game.physics.arcade.overlap(this.hero, this.flags, this._onHeroVsFlag, null, this);
}

Crowdjump.Game._handleInput = function () {
    if (this.keys.left.isDown) { // move hero left
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // move hero right
        this.hero.move(1);
    }
    else if (CONST_WASD_CONTROLS) {
        if (this.wasd.left.isDown) {
            this.hero.move(-1);

        } else if (this.wasd.right.isDown) {
            this.hero.move(1);
        } else { // stop
            this.hero.move(0);
        }
    }
    else { // stop
        this.hero.move(0);
    }
    if (CONST_LONG_JUMP) {
        if (this.keys.space.isDown || this.keys.up.isDown) {
            this.hero.jump();
        } else if (CONST_WASD_CONTROLS) {
            if (this.wasd.up.isDown) {
                this.hero.jump();

            }
        }
        if (this.keys.space.isUp && this.keys.up.isUp) {
            if (CONST_WASD_CONTROLS) {
                if (this.wasd.up.isUp) {
                    jumpTimer = 0;
                }
            } else {
                jumpTimer = 0;
            }
        }

    }

    if (CONST_CONTROLLER) {
        if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
            this.hero.move(-1);
        }
        else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
            this.hero.move(1);
        } else {
            this.hero.move(0);
        }

        if (pad1.justPressed(Phaser.Gamepad.XBOX360_A) || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
            this.hero.jump();
        }
        else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
        }

        if (pad1.justPressed(Phaser.Gamepad.XBOX360_START)) {
            this.mainMenu();
        }
        if (pad1.justPressed(Phaser.Gamepad.XBOX360_BACK, CONST_CONTROLLER_PRESSDURATION)) {
            this.toggleMute();
        }
        if (pad1.justPressed(Phaser.Gamepad.XBOX360_RIGHT_BUMPER, CONST_CONTROLLER_PRESSDURATION)) {
            console.log("cheat");
            this.toggleCheat();
        }

        if (pad1.justPressed(Phaser.Gamepad.XBOX360_B)) {
            this.restart();
        }

        if (pad1.connected) {
            var rightStickX = pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
            var rightStickY = pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);

            if (rightStickX) {
            }

            if (rightStickY) {
            }

        }
    }
};

Crowdjump.Game._movePlatforms = function (platform) {
    if (platform.body.x >= platform.body.maxx || platform.body.x <= platform.body.minx) {
        platform.body.velocity.x *= -1;
    }
    if (platform.body.y >= platform.body.maxy || platform.body.y <= platform.body.miny) {
        platform.body.velocity.y *= -1;
    }
}

Crowdjump.Game._countMovementInput = function () {
    this.firstMoved();
    game.movement_inputs += 1;
};

Crowdjump.Game.firstMoved = function () {
    if (first_moved == -1 && CONST_TIME_WHEN_MOVED) {
        first_moved = game.time.totalElapsedSeconds().toFixed(3);
        this.startSpiders();
    }
};

Crowdjump.Game._loadLevel = function (data) {

    if (CONST_P2_PHYSICS) {
        this._setupPhysicsP2();
    } else {
        this._setupPhysicsArcade();
    }


    // spawn the rest of the platforms
    this.platforms = this.game.add.group();
    data.platforms.forEach(this._spawnPlatform, this);

    this.fakePlatforms = this.game.add.group();
    data.fakePlatforms.forEach(this._spawnFakePlatform, this);

    if (CONST_MOVINGPLATFORMS) {
        this.movingPlatforms = this.game.add.group();
    }

    if (CONST_ENEMIES) {
        this.spiders = this.game.add.group();

        this.enemyWalls = this.game.add.group();
        data.enemyWalls.forEach(this._spawnEnemyWall, this);

    }

    if (CONST_LAVA) {
        this.lava = this.game.add.group();
        data.lava.forEach(this._spawnLava, this);
    }

    //spawn spikes and similar
    if (CONST_SPIKES) {
        this.spikes = this.game.add.group();
        data.spikes.forEach(this._spawnSpikes, this);
    }

    //spawn Buttons, gates, spawnable platforms
    if (CONST_BUTTONS_AND_GATES) {
        this.buttons = this.game.add.group();
        data.buttons.forEach(this._spawnButton, this);
        this.gates = this.game.add.group();
        data.gates.forEach(this._spawnGate, this);

        this.spawns = this.game.add.group();
        data.spawns.forEach(this._spawnSpawn, this);

    }

    if (CONST_CANNONS) {
        this.cannons = this.game.add.group();
        data.cannons.forEach(this._spawnCannon, this);
    }

    if (CONST_POWERUPS) {
        this.powerups = this.game.add.group();
        data.powerups.forEach(this._spawnPowerup, this);
    }

    if (CONST_EASTEREGGS) {
        this.eastereggs = this.game.add.group();
        data.eastereggs.forEach(this._spawnEasteregg, this);
    }

    if (CONST_COINS) {
        this.coins = this.game.add.group();
        data.coins.forEach(this._spawnCoin, this);
        this.collectedCoin = this.game.add.group();
    }

    if (CONST_CRATES) {
        this.crates = this.game.add.group();
        data.crates.forEach(this._spawnCrate, this);
    }

    //spawn sawblades + bases
    if (CONST_SAWBLADES) {
        this.sawblades = this.game.add.group();
        data.sawblades.forEach(this._spawnSawblade, this);
        this.sawbladesBases = this.game.add.group();
    }

    if (CONST_MYSTERYBOX) {
        this.mystery = this.game.add.group();
        data.mystery.forEach(this._spawnMystery, this);
    }

    //spawn all deco
    if (CONST_DECO) {
        this.deco = this.game.add.group();
        data.deco.forEach(this._spawnDeco, this);
    }


    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero, enemies: data.enemies});

    //+30/+45 for correction
    this.flags = this.game.add.group();
    data.flags.forEach(this._spawnFlag, this);

    if (CONST_P2_PHYSICS) var platformCollisionGroup = game.physics.p2.createCollisionGroup();

    if (CONST_SHOWLEVEL) {
        showlevel = this.game.add.text(20, 10, 'Level ' + level, {font: '25px Arial', fill: '#4352ff'});
        showlevel.fixedToCamera = true;
    }

    seconds_last_level = Math.abs(Math.floor(game.timeElapsed / 1));
    setInfoLastLevel();
    sizex = data.size.x;
    sizey = data.size.y;
    this.world.resize(sizex, sizey);
};

Crowdjump.Game._spawnPlatform = function (platform) {
    //von unten durch plattform : sprite.body.checkCollision.down = false;
    var sprite;
    var already_moving = false;
    var already_slippery = false;
    var already_bouncing = false;
    var types = [];

    var newx = platform.x;
    var newy = platform.y;

    if (CONST_P2_PHYSICS) {
        var width = game.cache.getImage(platform.image).width;
        var height = game.cache.getImage(platform.image).height;
        newx += width / 2;
        newy += height / 2;
        log(platform.x, width, newx);
        log(platform.y, height, newy);
        width % 2 == 1 ? newx -= 1 : newx;
        height % 2 == 1 ? newy += 1 : newy;
        log(newx, newy);
    }

    if (platform.p_types != undefined) {
        types = platform.p_types.split(",");
    }
    if ((platform.xmove != 0 || platform.ymove != 0) && CONST_MOVINGPLATFORMS) {
        sprite = this.movingPlatforms.create(newx, newy, platform.image);
        already_moving = true;
    } else {
        sprite = this.platforms.create(newx, newy, platform.image);
    }
    sprite.p_types = platform.p_types;

    if (CONST_P2_PHYSICS) {
        this.game.physics.p2.enable(sprite);
        sprite.body.kinematic = true;
    } else {
        this.game.physics.enable(sprite);
        sprite.body.friction.y = 0;
        sprite.body.friction.x = 1;
    }

    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    sprite.body.slippery = false;
    sprite.converted_to_lava = false;
    sprite.body.conveyor_direction = 0;

    for (var i = 0; i < types.length; i++) {
        switch (types[i]) {
            case "slippery":
                if (CONST_SLIPPERYPLATFORMS) {
                    if (!CONST_P2_PHYSICS) {
                        sprite.body.friction.x = 0;
                    }
                    if (already_moving) {

                    } else {
                    }
                    sprite.body.slippery = true;
                    already_slippery = true;
                }
                break;
            case "bouncing":
                if (CONST_BOUNCINGPLATFORMS) {
                    if (!CONST_P2_PHYSICS) {
                        sprite.body.bounce.set(0.8);
                    }
                    sprite.body.bouncing = true;
                    already_bouncing = true;
                }
                break;
            case "slide":
                if (CONST_SLIDEPLATFORMS) {
                }
                break;
            case "falling":
                if (CONST_FALLINGPLATFORMS) {
                }
                break;
            case "lavaswitch":
                if (CONST_LAVASWITCHINGPLATFORM) {
                    sprite.lavaObject = platform;
                }
                break;
            case "con_r":
                if (CONST_CONVEYORPLATFORMS) {
                    sprite.body.conveyor_direction = 10;
                }
                break;
            case "con_l":
                if (CONST_CONVEYORPLATFORMS) {
                    sprite.body.conveyor_direction = -10;
                }
                break;
            case "undefined":
                break;
            default:
                if (types[i] != '') console.log("unknown platform type: " + types[i]);
        }
    }


    if (already_moving) {
        if (CONST_MOVINGPLATFORMS) {
            sprite.body.velocity.x = platform.xmove;
            sprite.body.velocity.y = platform.ymove;
            sprite.body.minx = platform.x - platform.minx;
            sprite.body.miny = platform.y - platform.miny;
            sprite.body.maxx = platform.x + platform.maxx;
            sprite.body.maxy = platform.y + platform.maxy;
            if (!CONST_P2_PHYSICS) {
                sprite.body.bounce.set(0);
            }
            sprite.body.collideWorldBounds = true;
            sprite.bounceTimer = 0;
        }
    }
    if (CONST_P2_PHYSICS) {
        if (already_slippery) {
            sprite.body.setMaterial(iceMaterial);
        } else if (already_bouncing) {
            sprite.body.setMaterial(bounceMaterial);
        }
        else {
            sprite.body.setMaterial(groundMaterial);
        }
    }


    sprite.p_types = types;

    // this._spawnEnemyWall(platform.x, platform.y, 'left');
    // this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

Crowdjump.Game._spawnFakePlatform = function (platform) {

    var sprite;
    var newx = platform.x;
    var newy = platform.y;

    if (platform.image == "fakelava:1x1" && CONST_ANIMATE_LAVA) {
        newy += 4;
    }

    sprite = this.fakePlatforms.create(newx, newy, platform.image);

    if (platform.image == "fakelava:1x1" && CONST_ANIMATE_LAVA) {
        sprite.animations.add('animate_lava', [0, 1, 2, 3, 4, 5, 6, 7], 5, true);
        sprite.animations.play('animate_lava');
    }

};

Crowdjump.Game.lockPlatform = function (hero, platform) {
    if (!hero.locked) {
        hero.locked = true;
        hero.lockedTo = platform;
        hero.body.velocity.y = 0;
    }
}

Crowdjump.Game._spawnLava = function (lava) {
    var newx = lava.x;
    var newy = lava.y;
    if (CONST_P2_PHYSICS) {
        // log(newx,newy);
        var width = game.cache.getImage(lava.image).width;
        var height = game.cache.getImage(lava.image).height;
        newx += width / 2;
        newy += height / 2;
    }

    //4 pixel down because of collision, not for baseblock
    switch (lava.image) {
        case 'lava:1x1':
        case 'lava:2x1':
            newy += 4;
            break
    }

    let sprite = this.lava.create(
        newx, newy, lava.image); //for chest +8

    if (CONST_P2_PHYSICS) {
        this.game.physics.p2.enable(sprite);
        sprite.body.kinematic = true;
    } else {
        this.game.physics.enable(sprite);
    }
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;


    if (CONST_ANIMATE_LAVA) {
        newy += 4;
        sprite.animations.add('animate_lava', [0, 1, 2, 3, 4, 5, 6, 7], 5, true);
        sprite.animations.play('animate_lava');

    }
};

Crowdjump.Game._spawnSpikes = function (spike) {
    var newx = spike.x;
    var newy = spike.y;
    if (CONST_P2_PHYSICS) {
        // log(newx,newy);
        var width = game.cache.getImage(spike.image).width;
        var height = game.cache.getImage(spike.image).height;
        newx += width / 2;
        newy += height / 2;
    }

    //4 pixel away because of collision
    switch (spike.image) {
        case 'spikes:1x1':
            newy += 4;
            break;
        case 'spikesLeft:1x1':
            newx -= 4;
            break;
        case 'spikesRight:1x1':
            newx += 4;
            break;
    }

    let sprite = this.spikes.create(
        newx, newy, spike.image);

    if (CONST_P2_PHYSICS) {
        this.game.physics.p2.enable(sprite);
        sprite.body.kinematic = true;
    } else {
        this.game.physics.enable(sprite);
    }
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    // sprite.body.anchor = (0.5, 0.5);
    // sprite.angle = spike.angle;
    // sprite.body.rotation = spike.angle;
    // sprite.scale.set(spike.scalex, spike.scaley);
    // sprite.scale.set(-1.0, -3.0);
};

Crowdjump.Game._spawnSawblade = function (sawblade) {
    var newx = sawblade.x;
    var newy = sawblade.y;
    if (CONST_P2_PHYSICS) {
        // log(newx,newy);
        var width = game.cache.getImage(sawblade.image).width;
        var height = game.cache.getImage(sawblade.image).height;
        newx += width / 2;
        newy += height / 2;
    }

    let sprite = this.sawblades.create(
        newx, newy, sawblade.image);

    let basesprite = this.sawbladesBases.create(
        newx, newy, sawblade.base);


    if (CONST_P2_PHYSICS) {
        this.game.physics.p2.enable(sprite);
        sprite.body.kinematic = true;
    } else {
        this.game.physics.enable(sprite);
    }
    sprite.orientation = sawblade.orientation;
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

    switch (this.orientation) {
        case "up":
            sprite.body.setSize(42, 42, 21, 0);
            sprite.x = sawblade.x;
            sprite.y = sawblade.y - 21;
            break;
        case "left":
            sprite.body.setSize(42, 42, 0, 21);
            sprite.x = sawblade.x - 21;
            sprite.y = sawblade.y;
            basesprite.angle = -90;
            break;
        case "right":
            sprite.body.setSize(42, 42, 42, 21);
            sprite.x = sawblade.x + 21;
            sprite.y = sawblade.y;
            basesprite.angle = 90;
            break;
        case "down":
            sprite.body.setSize(42, 42, 21, 42);
            sprite.x = sawblade.x;
            sprite.y = sawblade.y + 21;
            basesprite.angle = 180;
            break;
    }
    sprite.anchor.set(0.5);
    basesprite.anchor.set(0.5);

};

Crowdjump.Game._spawnCannon = function (cannon) {
    var newx = cannon.x;
    var newy = cannon.y;

    if (CONST_P2_PHYSICS) {
        // log(newx,newy);
        var width = game.cache.getImage(cannon.image).width;
        var height = game.cache.getImage(cannon.image).height;
        newx += width / 2;
        newy += height / 2;
    }

    let sprite = this.cannons.create(
        newx, newy, cannon.image);


    if (CONST_P2_PHYSICS) {
        this.game.physics.p2.enable(sprite);
        sprite.body.kinematic = true;
    } else {
        this.game.physics.enable(sprite);
    }
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    // sprite.scale = (cannon.scalex, cannon.scaley);


};

Crowdjump.Game._spawnButton = function (button) {
    var newx = button.x;
    var newy = button.y + 37; //5px height

    let sprite = this.buttons.create(
        newx, newy, button.image);

    this.game.physics.enable(sprite);

    sprite.animations.add('button_pressed', [1]);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    sprite.body.checkCollision.right = false;
    sprite.body.checkCollision.left = false;
    sprite.pressed = false;
    sprite.buttonnr = button.buttonnr;

};

Crowdjump.Game._spawnMystery = function (mystery) {
    var newx = mystery.x;
    var newy = mystery.y;

    let sprite = this.mystery.create(
        newx, newy, mystery.image);


    //see Ref Random Items
    var powerupList = ["pu_permjump", "pu_throughwalls", "pu_time", "pu_doublejump"];
    var eastereggList = ["ea_time", "ea_specialname", "ea_money", "ea_movementspeed"];
    var coinList = ["coin"];
    var moreCoinsList = ["coin","coin2","coin3","coin4","coin5","coin6","coin7","coin8","coin9","coin10",];
    var weaponsList = [];
    var enemyList = ["spider"];
    var moreEnemiesList = ["spider", "spider2", "spider3", "spider4", "spider5"];

    var collectibleList = powerupList.concat(eastereggList, coinList);
    var noEnemies = powerupList.concat(eastereggList, coinList);
    var allList = powerupList.concat(eastereggList, coinList, enemyList);

    var itemList = [];
    var types = mystery.types.split(",");

    for (var i = 0; i < types.length; i++) {
        switch (types[i]) {
            case 'all':
                itemList = itemList.concat(allList);
                break;
            case 'noEnemies':
                itemList = itemList.concat(noEnemies);
                break;
            case 'moreEnemies':
                itemList = itemList.concat(moreEnemiesList);
                break;
            case 'collectibles':
                itemList = itemList.concat(collectibleList);
                break;
            case 'powerups':
                itemList = itemList.concat(powerupList);
                break;
            case 'eastereggs':
                itemList = itemList.concat(eastereggList);
                break;
            case 'coins':
                itemList = itemList.concat(coinList);
                break;
            case 'moreCoins':
                itemList = itemList.concat(moreCoinsList);
                break;
            case 'enemies':
                itemList = itemList.concat(enemyList);
                break;
            case 'weapons':
                itemList = itemList.concat(weaponsList);
                break;
            default:
                itemList.push(types[i]);
        }
    }

    var uniqueItems = [];
    $.each(itemList, function (i, el) {
        if ($.inArray(el, uniqueItems) === -1) uniqueItems.push(el);
    });


    this.game.physics.enable(sprite);

    sprite.animations.add('activate', [1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 3, 0], 30);
    sprite.animations.add('activateLast', [1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5], 30);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    sprite.uses = mystery.uses;
    sprite.items = uniqueItems;

};

Crowdjump.Game._spawnSpawn = function (spawn) {
    var newx = spawn.x;
    var newy = spawn.y; //5px height

    let sprite = this.spawns.create(
        newx, newy, spawn.image);

    // this.game.physics.enable(sprite);

    this.game.physics.enable(sprite);
    sprite.animations.add('spawn', [0, 1, 2, 3, 4, 5], 9);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    sprite.body.enable = false;
    // sprite.body.
    sprite.needs_buttonnr = spawn.needs_buttonnr;
    //p_types and co

};

Crowdjump.Game._spawnGate = function (gate) {
    var newx = gate.x;
    var newy = gate.y;

    let sprite = this.gates.create(
        newx, newy, gate.image);

    this.game.physics.enable(sprite);

    sprite.animations.add('open', [0, 0, 1, 2, 3, 3, 3, 4, 5, 6, 7, 8, 9], 6);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    sprite.needs_buttonnr = gate.needs_buttonnr;

};

Crowdjump.Game._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);

    // physic properties
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};
//does not need side
Crowdjump.Game._spawnEnemyWall = function (wall) {
    let sprite = this.enemyWalls.create(wall.x, wall.y, wall.image);

    // physic properties
    this.game.physics.enable(sprite);
    if (CONST_P2_PHYSICS) this.game.physics.p2.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};

Crowdjump.Game._spawnCharacters = function (data) {

    if (CONST_ENEMIES) {
        // spawn spiders
        data.enemies.forEach(function (enemy) {
            switch (enemy.type) {
                case "spider":
                    let spriteSpider = new Spider(this.game, enemy.x, enemy.y);
                    // sprite.anchor.set(0.5,0.5);
                    this.spiders.add(spriteSpider);
                    break;
                default:
                    let sprite = new Spider(this.game, enemy.x, enemy.y);
                    // sprite.anchor.set(0.5,0.5);
                    this.spiders.add(sprite);

            }
        }, this);
    }
    // spawn hero //+size/2 on each side because anchor 0.5
    this.hero = new Hero(this.game, data.hero.x + 21, data.hero.y + 21);
    this.game.add.existing(this.hero);
};

Crowdjump.Game._newSpawns = function (data) {
    if (CONST_ENEMIES) {
        // spawn spiders
        var seconds_this_game = last_second - seconds_last_level;
        data.enemies.forEach(function (spider) {
            // console.error(seconds_this_game + " offset " + spider.offset + " spawns " + spider.spawns + " interval " + spider.interval);
            if (seconds_this_game >= spider.offset) {
                if (spider.spawns * spider.interval + spider.offset > seconds_this_game) {
                    if ((seconds_this_game + spider.offset) % spider.interval == 0) {
                        let sprite = new Spider(this.game, spider.x, spider.y);
                        this.spiders.add(sprite);
                    }
                }
            }

        }, this);
    }
};

Crowdjump.Game._newCannonballs = function (seconds) {
    if (CONST_CANNONS) {
        // spawn cannonballs for each cannon
        var firerate = (CONST_CANNON_FIRERATE / 1000) * (1 / pu_timeslow);
        next_cannon_fire = seconds + firerate;
        this.cannons.forEach(function (cannon) {
            this.sfx.cannonfire.play();

            var cannonball = cannonballs.getFirstDead();

            var xgoal = 0;
            if (cannon.key == 'cannonRight') {
                xgoal = sizex;
                cannonball.reset(cannon.position.x + 82, cannon.position.y + 5);
            } else {
                cannonball.reset(cannon.position.x - 28, cannon.position.y + 5);
            }

            this.game.physics.arcade.moveToXY(cannonball, xgoal, cannon.position.y, (CONST_CANNON_BULLETSPEED * pu_timeslow));

        }, this);
    }
};

Crowdjump.Game._spawnCrate = function (platform) {
    var newx = platform.x;
    var newy = platform.y;

    if (CONST_P2_PHYSICS) {
        var width = game.cache.getImage(platform.image).width;
        var height = game.cache.getImage(platform.image).height;
        newx += width / 2;
        newy += height / 2;
    }

    let sprite = this.crates.create(
        newx, newy, platform.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = true;
    sprite.body.immovable = false;
    sprite.body.friction.x = 1;
    sprite.body.drag.x = 700;
};

Crowdjump.Game._spawnCoin = function (coin) {
    //+21, 38x38 tile
    let sprite = this.coins.create(coin.x + 21, coin.y + 21, 'coin');
    sprite.anchor.set(0.5, 0.5);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;

    if (CONST_COIN_ANIMATE) {
        sprite.animations.add('rotate', [0, 1, 2, 3, 4, 5, 6], 6, true); // 6fps, looped
        sprite.animations.play('rotate');
    }
};

Crowdjump.Game._spawnPowerup = function (powerup) {
    //+21, 38x38 tile
    let sprite = this.powerups.create(powerup.x + 21, powerup.y + 21, powerup.image);
    sprite.anchor.set(0.5, 0.5);

    if (CONST_P2_PHYSICS) {
        this.game.physics.p2.enable(sprite);
    } else {
        this.game.physics.enable(sprite);
    }

    sprite.body.allowGravity = false;
};

Crowdjump.Game._spawnEasteregg = function (easteregg) {
    //+21, 42x42 tile
    if (easteregg == undefined) return;
    let sprite = this.eastereggs.create(easteregg.x + 21, easteregg.y + 21, easteregg.image);
    sprite.anchor.set(0.5, 0.5);

    if (CONST_P2_PHYSICS) {
        this.game.physics.p2.enable(sprite);
    } else {
        this.game.physics.enable(sprite);
    }

    sprite.body.allowGravity = false;
};

Crowdjump.Game._spawnDeco = function (deco) {
    var daytime = '_night';
    if (CONST_DAY_AND_NIGHT && day) daytime = '_day';

    let sprite = this.deco.create(deco.x, deco.y, deco.image + daytime);
    // sprite.anchor.set(0.5);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;

};

Crowdjump.Game.powerup_lavaorb = function () {
    pu_lavaorb = true;
}

Crowdjump.Game.powerup_jumpboost = function () {
    pu_jumpboost = true;
}

Crowdjump.Game.powerup_permjumpboost = function () {
    pu_permjumpboost = true;
    this.showPowerupMessage('Jumpboost');
}

Crowdjump.Game.powerup_throughwalls = function () {
    pu_throughwalls = true;
    this.showPowerupMessage('Jump through walls');
}

Crowdjump.Game.powerup_time = function () {
    pu_timeslow = CONST_POWERUPS_TIMESLOW;
    cannonballs.forEach(this.slowCannonball, this, true);
    this.spiders.forEach(this.slowSpider, this, true);
    this.showPowerupMessage('Slooooow');
}

Crowdjump.Game.powerup_doublejump = function () {
    pu_doublejump = true;
    this.showPowerupMessage('Double Jump!');
}

Crowdjump.Game.easteregg_time = function () {
    timeeggs += CONST_EASTEREGGS_TIME_TIMESECONDS;
    this.showEastereggMessage("more time");
}

Crowdjump.Game.easteregg_money = function () {
    game.coinPickupCount += CONST_EASTEREGGS_MONEY_COINAMOUNT;
    this.showEastereggMessage("$$$");
}

Crowdjump.Game.easteregg_movementspeed = function () {
    movespeed_boost = CONST_EASTEREGGS_MOVEMENTSPEED;
    this.showEastereggMessage("be fast!");
}

Crowdjump.Game.easteregg_specialname = function () {
    game.specialName++;
    switch (game.specialName) {
        case 1:
            this.showEastereggMessage("First steps");
            break;
        case 2:
            this.showEastereggMessage("I'm blue");
            break;
        case 3:
            this.showEastereggMessage("Getting dark");
            break;
        case 4:
            this.showEastereggMessage("Big Purple");
            break;
        case 5:
            this.showEastereggMessage("Lust for blood");
            break;
        case 6:
            this.showEastereggMessage("Red Pill");
            break;
        case 7:
            this.showEastereggMessage("Red Pill");
            break;
        default:
            break;
    }
}

Crowdjump.Game._onHeroVsEnemy = function (hero, enemy) {
    if (CONST_ZHONYA && zhonya_activated) {
        if (!CONST_KILL_IN_ZHONYA) {
            return;
        }
        if (CONST_KILL_ENEMIES) {
            this._killEnemy(enemy, false);
        }

    }
    if (((hero.body.velocity.y > 0 && hero.body.position.y + 5 < enemy.body.position.y) || hero.body.position.y + 12 < enemy.body.position.y) && CONST_KILL_ENEMIES) {
        this._killEnemy(enemy, true);
    }
    else { // game over -> restart the game
        this.sfx.stomp.play("", "", 0.6);
        this.killHero("killed by " + enemy.key);
    }
};

Crowdjump.Game._killEnemy = function (enemy, bounce) {
    if (bounce) {
        this.hero.bounce("", "", 0.6);
        this.sfx.stomp.play();
    }
    if (enemy.coinDrop > 0) {
        this.enemyDropsCoin(enemy.coinDrop, enemy.body.position.x, enemy.body.position.y);
    }
    enemy.die();
    game.enemiesDefeatedCount++;

};

Crowdjump.Game._onHeroVsLava = function (hero, platform) {
    // game over -> restart the game
    this.killHero("death by lava");
};

Crowdjump.Game._onHeroVsSpikes = function (hero, spike) {
    // game over -> restart the game
    this.killHero("death by spikes");
};

Crowdjump.Game._onHeroVsSawblade = function (hero, sawblade) {
    // game over -> restart the game
    this.killHero("death by a chainsaw");
};

Crowdjump.Game._onHeroVsSpecialPlatform = function (hero, platform) {
    if (CONST_SLIPPERYPLATFORMS) hero_on_ice = platform.body.slippery;

    if (platform.body.bouncing && CONST_BOUNCINGPLATFORMS) {
        hero.body.velocity.y = hero_bounce_velocity * 0.7;
        hero_bounce_velocity = 0;
    }

    if (CONST_CONVEYORPLATFORMS && platform.body.conveyor_direction != 0) {
        hero.body.velocity.x += platform.body.conveyor_direction;
        hero.body.onConveyor = platform.body.conveyor_direction;
    } else {
        hero.body.onConveyor = 0;
    }

    if (!platform.converted_to_lava && arrayContains(platform.p_types, "lavaswitch") && CONST_LAVASWITCHINGPLATFORM) {
        platform.converted_to_lava = true;
        var object = {};
        object.end = game.time.totalElapsedSeconds() + 1;
        object.groundObject = platform;
        lavaConverts.push(object);
    }

}

Crowdjump.Game._onHeroVsFlag = function (hero, flag) {
    this.sfx.flag.play();
    if (zhonya_activated) {
        this.sfx.zhonyas.stop();
    }

    //dont set time_finished in the last level to avoid double time in last frame


    game.highest_level = Math.max(game.highest_level, level + 1);

    //manually selected level
    if (selected_level >= 0) {
        time_finished = game.time.totalElapsedSeconds() - first_moved;
        time_finished = parseFloat(time_finished.toFixed(3));
        time_overall = parseFloat(time_overall) + game.time.totalElapsedSeconds() - parseFloat(time_last_level_or_restart);
        time_overall = parseFloat(parseFloat(time_overall).toFixed(3));

        this.state.start('Endscreen');

    }
    //not the last level
    else if (level < CONST_LEVEL - 1) {

        if (CONST_SAVE_LEVEL_TIME) {

            time_overall = parseFloat(time_overall) + game.time.totalElapsedSeconds() - parseFloat(time_last_level_or_restart);
            time_overall = parseFloat(parseFloat(time_overall).toFixed(3));

            time_last_level_or_restart = game.time.totalElapsedSeconds().toFixed(3);
            // time_finished = game.time.totalElapsedSeconds() - first_moved;
            // time_finished = parseFloat(time_finished.toFixed(3));
        } else {
            time_overall = parseFloat(time_overall) + (game.time.totalElapsedSeconds() - first_moved);
            time_overall = parseFloat(parseFloat(time_overall).toFixed(3));

            time_finished = parseFloat(game.time.totalElapsedSeconds().toFixed(3)) - first_moved;

            time_finished = parseFloat(time_finished.toFixed(3));

        }
        setLevelInfo(level + 1, "completed", false);
        first_moved = -1;
        this.game.state.restart(true, false, {level: level + 1});
    }
    //last level
    else {
        // setLevelInfo(level + 1, "completed"); do this after highscore calculation
        if (CONST_SAVE_LEVEL_TIME) {
            time_overall = parseFloat(time_overall) + (game.time.totalElapsedSeconds() - first_moved) - parseFloat(time_last_level_or_restart);
            time_overall = parseFloat(parseFloat(time_overall).toFixed(3));
        } else {
            time_overall = parseFloat(time_overall) + (game.time.totalElapsedSeconds() - first_moved - (timeeggs * 5));
            time_overall = parseFloat(parseFloat(time_overall).toFixed(3));

        }
        this.state.start('Endscreen');
    }

};

Crowdjump.Game._onHeroVsCoin = function (hero, coin) {
    this.sfx.coin.play("", "", 0.4);
    coin.kill();
    game.coinPickupCount++;

    if (CONST_COIN_ANIMATE) this.coinIcon.animations.play('rotate');
    if (game.coinPickupCount % 30 == 0) this.increaseLives();
};

Crowdjump.Game._onHeroVsEasteregg = function (hero, easteregg) {
    this.sfx.easteregg.play();

    switch (easteregg.key) {
        case "easteregg:time":
            this.easteregg_time()
            break;
        case "easteregg:movementspeed":
            this.easteregg_movementspeed();
            break;
        case "easteregg:specialname":
            this.easteregg_specialname();
            break;
        case "easteregg:money":
            this.easteregg_money();
            break;
        default:
            console.log(easteregg.key);
        //do nothing
    }

    easteregg.kill();

    game.eastereggPickupCount++;

}

Crowdjump.Game._onHeroVsPowerup = function (hero, powerup) {
    this.sfx.powerup.play();

    switch (powerup.key) {
        case "powerup:lavaorb":
            this.powerup_lavaorb();
            break;
        case "powerup:jumpboost":
            this.powerup_jumpboost();
            break;
        case "powerup:throughwalls":
            this.powerup_throughwalls();
            break;
        case "powerup:permjumpboost":
            this.powerup_permjumpboost();
            break;
        case "powerup:time":
            this.powerup_time();
            break;
        case "powerup:doublejump":
            this.powerup_doublejump();
            break;
        default:
            console.log(powerup.key);
        //do nothing
    }

    powerup.kill();

    game.powerupPickupCount++;
};

Crowdjump.Game._onHeroVsCannonball = function (hero, cannonball) {
    // game over -> restart the game
    cannonball.kill();
    this.killHero("death by cannonball");
};

Crowdjump.Game._onHeroVsButton = function (hero, button) {
    if (!button.pressed) {
        button.animations.play("button_pressed");
        this.sfx.press_button.play();
        this.checkButtonPress(button.buttonnr);
        button.pressed = true;
    }
};

Crowdjump.Game._onHeroVsMysterybox = function (hero, mystery) {
    if (mystery.uses > 0 && mystery.body.touching.down) {
        var animationTime = Phaser.Timer.SECOND * 0.6;
        if (mystery.uses <= 1) mystery.animations.play("activateLast");
        else mystery.animations.play("activate");

        this.sfx.mystery.play();
        var rand = Math.floor(Math.random() * mystery.items.length);

        var oXPos = mystery.body.position.x;
        var oYPos = mystery.body.position.y - 42; //spawn on top of box

        game.time.events.add(animationTime, function () {

            //Ref Random Items
            switch (mystery.items[rand]) {
                case 'coin':
                case 'coin2':
                case 'coin3':
                case 'coin4':
                case 'coin5':
                case 'coin6':
                case 'coin7':
                case 'coin8':
                case 'coin9':
                case 'coin10':
                    var object = {};
                    object.x = oXPos;
                    object.y = oYPos;
                    this._spawnCoin(object);
                    break;
                case 'pu_permjump':
                    var object = {};
                    object.x = oXPos;
                    object.y = oYPos;
                    object.image = "powerup:permjumpboost";
                    this._spawnPowerup(object);
                    break;
                case 'pu_throughwalls':
                    var object = {};
                    object.x = oXPos;
                    object.y = oYPos;
                    object.image = "powerup:throughwalls";
                    this._spawnPowerup(object);
                    break;
                case 'pu_time':
                    var object = {};
                    object.x = oXPos;
                    object.y = oYPos;
                    object.image = "powerup:time";
                    this._spawnPowerup(object);
                    break;
                case 'pu_doublejump':
                    var object = {};
                    object.x = oXPos;
                    object.y = oYPos;
                    object.image = "powerup:doublejump";
                    this._spawnPowerup(object);
                    break;
                case 'ea_time':
                    var object = {};
                    object.x = oXPos;
                    object.y = oYPos;
                    object.image = "easteregg:time";
                    this._spawnEasteregg(object);
                    break;
                case 'ea_specialname':
                    var object = {};
                    object.x = oXPos;
                    object.y = oYPos;
                    object.image = "easteregg:specialname";
                    this._spawnEasteregg(object);
                    break;
                case 'ea_money':
                    var object = {};
                    object.x = oXPos;
                    object.y = oYPos;
                    object.image = "easteregg:money";
                    this._spawnEasteregg(object);
                    break;
                case 'ea_movementspeed':
                    var object = {};
                    object.x = oXPos;
                    object.y = oYPos;
                    object.image = "easteregg:movementspeed";
                    this._spawnEasteregg(object);
                    break;
                case "spider":
                case "spider2":
                case "spider3":
                case "spider4":
                case "spider5":
                    let spriteSpider = new Spider(this.game, oXPos, oYPos);
                    // sprite.anchor.set(0.5,0.5);
                    spriteSpider.body.velocity.x = CONST_SPIDER_SPEED
                    this.spiders.add(spriteSpider);
                    break;

            }
        }, this);
        mystery.uses--;
    }
};

Crowdjump.Game._onBulletVsPlatform = function (bullet, platform) {
    bullet.reset();
};

Crowdjump.Game._onBulletVsEnemy = function (bullet, enemy) {
    this._killEnemy(enemy, false);
    bullet.reset();
};

Crowdjump.Game._onCannonballVsPlatform = function (cannonball, platform) {
    cannonball.kill();
};

Crowdjump.Game._onCannonballVsEnemy = function (cannonball, enemy) {
    this._killEnemy(enemy, false);
    cannonball.kill();
};

Crowdjump.Game._createHud = function () {

    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);
    // this.zhonyaFont = this.game.add.retroFont('font:numbers', 20, 26,
    //     TEXT_STR + NUMBERS_STR, 6);
    // this.zhonyaFont.fixedToCamera = true;

    this.coinIcon = this.game.make.image(0, 0, 'icon:coin');
    if (CONST_COIN_ANIMATE) {
        this.coinIcon.animations.add('rotate', [0, 1, 2, 3, 4, 5, 6, 0], 12);
    }

    let coinScoreImg = this.game.make.image(this.coinIcon.x + this.coinIcon.width,
        this.coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);

    this.hud = this.game.add.group();
    if (CONST_COINS) {
        this.hud.add(this.coinIcon);
        this.hud.add(coinScoreImg);
    }

    if (CONST_ZHONYA) {
        var y_distance = (CONST_COINS ? coinIcon.height : 5) + 5;
        this.zhonyaFont = this.game.add.text(20, y_distance, '');
        // let zhonyaImg = this.game.make.image(10, y_distance, this.zhonyaFont);
        // zhonyaImg.anchor.set(0.5, 0.5);

        this.hud.add(this.zhonyaFont);
    }

    this.hud.position.set(10, 10);
    this.hud.fixedToCamera = true;
};

Crowdjump.Game._createLivesHud = function () {

    this.livesFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);

    let heartIcon = this.game.make.image(CONST_CANVAS_X - 36, 10, 'icon:heart');
    let livesRemainingImg = this.game.make.image(CONST_CANVAS_X - 80, 19, this.livesFont);
    livesRemainingImg.anchor.set(0, 0.5);

    this.livesHud = this.game.add.group();
    if (CONST_HERO_LIVES > 1) {
        this.livesHud.add(livesRemainingImg);
        this.livesHud.add(heartIcon);
    }

    // this.livesHud.position.set(CONST_CANVAS_X-80, 10);
    this.livesHud.fixedToCamera = true;
};

Crowdjump.Game._createTimerHud = function () {

    this.timeFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);

    this.timehud = this.game.add.group();
    if (CONST_TIME) {
        let timeImg = this.game.make.image(466, 20, this.timeFont);
        timeImg.anchor.set(0.5, 0);

        this.timehud.add(timeImg);
        this.timehud.fixedToCamera = true;
        // this.timehud.position.set(200, 5);

    }
};

Crowdjump.Game.updateTimer = function () {

    game.timeElapsed = this.game.time.totalElapsedSeconds().toFixed(3);

};

Crowdjump.Game._spawnFlag = function (flagspawn) {
    //old flag 20,45
    //new flag 21,42
    this.flag = this.flags.create(flagspawn.x + 20, flagspawn.y + 45, 'flag');
    this.flag.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.flag);
    this.flag.body.allowGravity = false;
};

Crowdjump.Game._activateSprint = function () {
    is_walking = false;
    is_sprinting = true;
};

Crowdjump.Game._deactivateSprint = function () {
    is_sprinting = false;
};

Crowdjump.Game._activateWalk = function () {
    is_walking = true;
    is_sprinting = false;
};

Crowdjump.Game._deactivateWalk = function () {
    is_walking = false;
};

Crowdjump.Game.paused = function () {
    if (CONST_PAUSE) {
        // this.pausedIndicator.exists = true;
        if (first_moved > 0) {
        }
        game.elapsedTime = this.game.time;
        this.world.alpha = 0.5;
        this.game.time.gamePaused();
        this.game.time.events.pause();
    }
};

Crowdjump.Game.resumed = function () {
    if (CONST_PAUSE) {
        // this.pausedIndicator.exists = false;
        if (first_moved > 0) {
            pause_time += this.game.time.pauseDuration;
        }
        this.world.alpha = 1;
        this.game.time.gameResumed();
        this.game.time.events.resume();
    }

};

Crowdjump.Game.activate_Zhonyas = function () {
    if (zhonya_activated || zhonya_cooldown) {
        return;
    }
    this.sfx.zhonyas.play();

    zhonya_activated = true;
    // Phaser.Sprite.call(this.hero, game, x, y, 'hero_zhonya');
    // this.hero.texture.loadTexture('hero_zhonya');
    this.game.time.events.add(Phaser.Timer.SECOND * CONST_ZHONYA_DURATION, this.cooldown_Zhonyas, this);
    time_zhonya_activated = game.timeElapsed;

};

Crowdjump.Game.cooldown_Zhonyas = function () {

    zhonya_activated = false;
    zhonya_cooldown = true;
    this.game.time.events.add(Phaser.Timer.SECOND * CONST_ZHONYA_COOLDOWN, this.ready_Zhonyas, this);
    time_zhonya_cooldown = game.timeElapsed;

};

Crowdjump.Game.ready_Zhonyas = function () {

    zhonya_cooldown = false;

};

Crowdjump.Game.checkButtonPress = function (nr) {
    this.gates.forEach(this.openGate, this, true, nr);
    this.spawns.forEach(this.setSpawn, this, true, nr);
};

Crowdjump.Game.setSpawn = function (spawn, nr) {
    if (spawn.needs_buttonnr == nr) {
        spawn.animations.play('spawn');
        this.sfx.spawn_platform.play();
        spawn.body.enable = true;
    }
};

Crowdjump.Game.openGate = function (gate, nr) {
    if (gate.needs_buttonnr == nr) {
        this.sfx.open_gate.play();
        gate.animations.play('open').onComplete.addOnce(function () {
            gate.kill();
        }, this);
    }
};

Crowdjump.Game.fire_Bullet = function () {

    if (CONST_ZHONYA && zhonya_activated && !CONST_SHOOT_IN_ZHONYA) {
        return;
    }
    if (!CONST_SHOOTING) {
        return;
    }
    if (this.game.time.now > nextFire && bullets_left == 0) {
        this.sfx.empty_magazine.play();
        nextFire = this.game.time.now + CONST_FIRERATE;
        return;
    }
    if (this.game.time.now > nextFire && bullets.countDead() > 0) {
        this.sfx.shoot.play();
        nextFire = this.game.time.now + CONST_FIRERATE;

        var bullet = bullets.getFirstDead();

        bullet.reset(this.hero.position.x - 8, this.hero.position.y - 8);

        this.game.physics.arcade.moveToPointer(bullet, CONST_BULLETSPEED);
        bullets_left -= 1;
    }

};

Crowdjump.Game.slowCannonball = function (cannonball) {
    cannonball.body.velocity.x *= pu_timeslow;
};

Crowdjump.Game.slowSpider = function (spider) {
    spider.body.velocity.x *= pu_timeslow;
};

Crowdjump.Game.startSpiders = function () {
    this.spiders.forEach(function (spider) {
        spider.body.velocity.x = CONST_SPIDER_SPEED
    }, this);
};

Crowdjump.Game.killHero = function (reason) {
    if (death) return; //else you can die twice!
    death = true;
    game.deaths++;
    this.hero.kill();

    this.timeFont.text = '0';
    time_finished = game.time.totalElapsedSeconds() - first_moved;
    time_finished = parseFloat(time_finished.toFixed(3));

    setLevelInfo(level + 1, reason, false, true);

    lives -= 1;

    log("you died because of " + reason, lives + " lives left");

    if (CONST_REPLAY_LEVEL) {
        time_last_level_or_restart = this.game.time.totalElapsedSeconds().toFixed(3);
        this.game.state.restart(true, false, {level: level});
        return;
    }

    if (lives <= 0) {
        // reset?
        this.game.time.reset();
        game.timeElapsed = 0;

        last_second = 0;
        first_moved = 0;
        time_finished = 0;
        time_overall = 0;
        time_last_level_or_restart = 0;
        resetStats();

        this.state.start('Gameover');
    } else {
        if (CONST_SAVE_LEVEL_TIME) {

            time_overall = parseFloat(time_overall) + game.time.totalElapsedSeconds() - parseFloat(time_last_level_or_restart);
            time_overall = parseFloat(parseFloat(time_overall).toFixed(3));

            time_last_level_or_restart = game.time.totalElapsedSeconds().toFixed(3);
            // time_finished = game.time.totalElapsedSeconds() - first_moved;
            // time_finished = parseFloat(time_finished.toFixed(3));
        } else {
            time_overall = parseFloat(time_overall) + (game.time.totalElapsedSeconds() - first_moved);
            time_overall = parseFloat(parseFloat(time_overall).toFixed(3));
            // console.log(time_overall);
            time_finished = parseFloat(game.time.totalElapsedSeconds().toFixed(3)) - first_moved;

            time_finished = parseFloat(time_finished.toFixed(3));

        }
        first_moved = -1;
        this.game.state.restart(true, false, {level: level});
    }

};

Crowdjump.Game.increaseLives = function (amount) {

    this.sfx.levelup.play();
    if (amount != undefined) lives += amount;
    else lives++;
};

Crowdjump.Game.showMessage = function (message, time, fill, font) {
    message_image = this.add.text(CONST_WORLD_CENTER_X, 200, message, {fill: fill, font: font, align: "center"});
    message_image.anchor.set(0.5);
    message_image.fixedToCamera = true;
    tween = game.add.tween(message_image).to({alpha: 0}, time, Phaser.Easing.Linear.None, true);

};

Crowdjump.Game.showImage = function (imageName, time) {
    message_image = this.add.sprite(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y, imageName);
    message_image.anchor.set(0.5);
    message_image.fixedToCamera = true;
    tween = game.add.tween(message_image).to({alpha: 0}, time, Phaser.Easing.Linear.None, true);

};

Crowdjump.Game.showEastereggMessage = function (message) {
    this.showMessage(message, 3000, '#000000', '')
};

Crowdjump.Game.showPowerupMessage = function (message) {
    this.showMessage('You found a powerup!\n' + message, 3000, '#000000', '')
};

Crowdjump.Game.restart = function () {
    time_finished = game.time.totalElapsedSeconds() - first_moved;
    time_finished = parseFloat(time_finished.toFixed(3));
    if (first_moved == 0) time_finished = 0;


    setLevelInfo(level + 1, "restart", false);
    // updateInfo(false);

    last_second = 0;
    first_moved = 0;
    time_finished = 0;
    time_overall = 0;
    time_last_level_or_restart = 0;
    resetStats();
    lives = CONST_HERO_LIVES;

    resetStats();

    this.state.restart();
    this.game.time.reset();
};

Crowdjump.Game.enemyDropsCoin = function (coins, enemyXPos, enemyYPos) {
    var droptime = Phaser.Timer.SECOND * 0.97;
    if (account != null) if (account.username == 'PirateDragon') droptime = 0;
    game.time.events.add(droptime, function () {
        var xPosArr = [];
        var coinYPos = enemyYPos - 12;
        switch (coins) {
            case 1:
                xPosArr.push(enemyXPos);
                break;
            case 2:
                xPosArr.push(enemyXPos - 16);
                xPosArr.push(enemyXPos + 16);
                break;
            case 3:
                xPosArr.push(enemyXPos - 16);
                xPosArr.push(enemyXPos);
                xPosArr.push(enemyXPos + 16);
                break;
            case 4:
                xPosArr.push(enemyXPos - 24);
                xPosArr.push(enemyXPos - 8);
                xPosArr.push(enemyXPos + 8);
                xPosArr.push(enemyXPos + 24);
                break;
        }
        for (var i = 0; i < coins; i++) {
            var object = {};
            object.x = xPosArr[i];
            object.y = coinYPos;
            this._spawnCoin(object);

        }
    }, this);

};

Crowdjump.Game.toggleMute = function () {
    if (this.game.sound.mute) {
        this.game.sound.mute = false;
        this.showImage('unmute', 1500);
    } else {
        this.game.sound.mute = true;
        this.showImage('mute', 1500);
    }
};

Crowdjump.Game.stopMusic = function () {
    levelmusic.stop();
};

Crowdjump.Game.toggleCheat = function () {
    if (!cheat_possible) return;
    cheat_activated = !cheat_activated;

    if (cheat_activated) {
        pu_lavaorb = true;
        pu_throughwalls = true;
        // lives++;

    } else {
        pu_lavaorb = false;
        pu_throughwalls = false;
    }
};

Crowdjump.Game.togglePause = function () {
    this.showEastereggMessage('Paused');
    if (this.game.paused) {
        this.game.paused = false;
    } else {
        this.game.paused = true;
    }
};

Crowdjump.Game.toggleFPS = function () {
    show_fps = !show_fps;
};

Crowdjump.Game.mainMenu = function () {
    lives = CONST_HERO_LIVES;
    backToMainMenu();
}