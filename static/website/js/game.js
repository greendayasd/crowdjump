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
    var hero_on_bounce = false;
    var jumpTimer = 0;
    var lives = CONST_HERO_LIVES;

    var level_data;
    var last_second = 0;
    var seconds_last_level = 0;
    var pu_lavaorb = false;
    var pu_jumpboost = false;

    var zhonya_activated = false;
    var zhonya_cooldown = false;
    var time_zhonya_activated = 0;
    var time_zhonya_cooldown = 0;

    var nextFire = 0;
    var bulletsprite;
    var bullets;
    var death;
    var bullets_left = CONST_MAGAZINE;
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
    Phaser.Sprite.call(this, game, x, y, 'hero');
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

    this.animations.add('stop', [0]);
    this.animations.add('run', [1, 2], 8, true); // 8fps looped
    this.animations.add('jump', [3]);
    this.animations.add('fall', [4]);
    this.animations.add('zhonya', [6]);

    if (CONST_DEBUG) {
        this.body.debug = true;
    }
}


// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    var movespeed = 0;

    if (CONST_USE_ACCELERATION) {
        movespeed = CONST_ACCELERATION;
    } else {
        movespeed = CONST_MOVE_SPEED
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
        this.body.velocity.x = direction * movespeed;

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
    var canJump;
    if (CONST_P2_PHYSICS) {
        canJump = true;
        second_jump = true;
    } else {
        canJump = this.body.touching.down;
        if (this.body.touching.down) {
            second_jump = true;
        }
    }


    if (CONST_LONG_JUMP) {
        if (canJump) jumpTimer = 0;
        if ((Crowdjump.Game.keys.up.isDown || Crowdjump.Game.keys.space.isDown || Crowdjump.Game.wasd.up.isDown) && (jumpTimer > 0)) {
            //jump higher
            this.body.velocity.y = -CONST_JUMP_SPEED;
            jumpTimer++;
            if (jumpTimer == CONST_MAX_LONG_JUMP) {
                jumpTimer = 0;
            }
            return;
        }

    }


    if (canJump || (hero_on_wall && CONST_WALL_JUMP)) {
        if (pu_jumpboost) {
            this.body.velocity.y = -(1.4 * CONST_JUMP_SPEED);
            pu_jumpboost = false;
        } else {
            this.body.velocity.y = -CONST_JUMP_SPEED;
        }
        jumpTimer = 1;
        game.jumps++;
    } else {
        if (second_jump && CONST_DOUBLE_JUMP) {
            if (pu_jumpboost) {
                this.body.velocity.y = -(1.1 * CONST_JUMP_SPEED);
                pu_jumpboost = false;
            } else {
                this.body.velocity.y = -(CONST_JUMP_SPEED * 0.8);
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
    this.body.velocity.x = CONST_SPIDER_SPEED;


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
        this.body.velocity.x = -CONST_SPIDER_SPEED; // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = CONST_SPIDER_SPEED; // turn right
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


Crowdjump.Game.init = function (data) {
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
            this.sfx.jump.play("", 0, 0.3, false, true);
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

    this.keys.esc.onDown.add(backToMainMenu);

    this.wasd = {};
    if (CONST_WASD_CONTROLS) {
        this.input.keyboard.addKey(Phaser.KeyCode.W).onDown.add(jump, this);

        this.wasd = {
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
        };

    }

    if (typeof  data !== 'undefined') {
        this.level = data.level;

    } else {
        this.level = 0;
    }

    if (this.level == 0 && game.authenticated) {
        game.gameInfo["rounds_started"] = game.gameInfo["rounds_started"] + 1;
        // console.error("started " + game.gameInfo["rounds_started"]);
    }
    second_jump = true;
    hero_on_wall = false;
    hero_on_ice = false;
    hero_on_bounce = false;
    last_second = 0;
    nextFire = 0;
    pu_jumpboost = false;
    pu_lavaorb = false;
    bullets_left = CONST_MAGAZINE;
    jumpTimer = 0;
    is_sprinting = false;
    is_walking = false;

    try {
        if (this.level == 0 && (lives == undefined || lives <= 0)) lives = CONST_HERO_LIVES;
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
        coin: this.game.add.audio('sfx:coin'),
        stomp: this.game.add.audio('sfx:stomp'),
        flag: this.game.add.audio('sfx:flag'),
        zhonyas: this.game.add.audio('sfx:zhonya'),
        shoot: this.game.add.audio('sfx:shoot'),
        empty_magazine: this.game.add.audio('sfx:empty_magazine'),
        powerup: this.game.add.audio('sfx:powerup'),
    };

    // this.game.physics.startSystem(Phaser.Physics.P2);

    // this.game.add.image(0, 0, 'background');
    var c = Phaser.Color.getRandomColor(255, 255, 255);

    this.game.stage.backgroundColor = c;
    zhonya_activated = false;
    zhonya_cooldown = false;
    time_zhonya_activated = 0;
    time_zhonya_cooldown = 0;
    if (selected_level >= 0) {
        level_data = this.game.cache.getJSON(`level:${selected_level}`);
    } else {
        level_data = this.game.cache.getJSON(`level:${this.level}`);
    }
    this._loadLevel(level_data);

    this._createHud();
    this._createTimerHud();

    if (CONST_FPS) {
        game.time.advancedTiming = true;
        fpsText = this.game.add.text(CONST_CANVAS_X - 60, 10, '', {font: '16px Arial', fill: '#ff0000'});
        fpsText.fixedToCamera = true;
    }

    if (CONST_PAUSE) {
        this.pausedIndicator = this.add.text(0, 0, 'paused', {fill: 'black', font: '48px san    s-serif'});
        this.pausedIndicator.alignIn(this.world.bounds, Phaser.CENTER);
        this.pausedIndicator.exists = false;

        // We place this on the Stage, above the World, so we can toggle the World alpha in `paused`/`resumed`.
        this.stage.addChild(this.pausedIndicator);
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

    if (CONST_ZHONYA) {
        this.input.keyboard.addKey(Phaser.KeyCode.F).onUp.add(this.activate_Zhonyas, this);
    }

    this.input.keyboard.addKey(Phaser.KeyCode.R).onUp.add(this.restart, this);
    this.roundTimer = game.time.events.loop(Phaser.Timer.SECOND, this.updateTimer, this);
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
    if (CONST_P2_PHYSICS) {
        this._handleCollisionsP2();
    } else {
        this._handleCollisions();
    }
    this._handleInput();
    try {
        if (CONST_MOVINGPLATFORMS) this.movingPlatforms.forEach(this._movePlatforms, this);
    } catch (e) {
        console.log(e);
    }

    // var elapsedTime = Math.floor(this.game.time.totalElapsedSeconds());
    // console.error(this.roundTimer.seconds);
    var seconds = 0;

    if (CONST_SAVE_LEVEL_TIME) {
        seconds = (Math.abs(Math.floor(game.time.totalElapsedSeconds().toFixed(3) / 1)) - Math.abs(Math.floor(time_last_level_or_restart / 1))) + Math.floor(time_overall / 1);
        if (time_overall != 0) {

        }
    } else {
        seconds = Math.abs(Math.floor(game.timeElapsed / 1));
    }
    if (seconds != last_second) {
        last_second = seconds;
        if (level_data.repeats) {
            this._newSpawns({spiders: level_data.repeat_spiders});
        }

    }
    this.timeFont.text = `${seconds}`;
    this.coinFont.text = `x${this.coinPickupCount}`;

    if (CONST_FPS && this.game.time.fps !== 0) {
        fpsText.setText(this.game.time.fps + ' FPS');

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
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.hero, this.platforms, this._onHeroVsSpecialPlatform, null,this);


    if (CONST_MOVINGPLATFORMS) {
        this.game.physics.arcade.collide(this.movingPlatforms, this.platforms);
        this.game.physics.arcade.collide(this.movingPlatforms, this.movingPlatforms);
        this.game.physics.arcade.collide(this.spiders, this.movingPlatforms);

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
        if (!this.hero.body.touching.down) {
            hero_on_bounce = false;
        }
    }

    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this);

    this.game.physics.arcade.overlap(this.hero, this.powerups, this._onHeroVsPowerup,
        null, this);


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
    game.movement_inputs += 1;
}

Crowdjump.Game._loadLevel = function (data) {

    if (CONST_P2_PHYSICS) {
        this._setupPhysicsP2();
    } else {
        this._setupPhysicsArcade();
    }

    this.bgDecoration = this.game.add.group();

    if (CONST_ENEMIES) {
        this.spiders = this.game.add.group();

        this.enemyWalls = this.game.add.group();
        data.enemyWalls.forEach(this._spawnEnemyWall, this);

    }


    if (CONST_MOVINGPLATFORMS) {
        this.movingPlatforms = this.game.add.group();
    }


    if (CONST_CRATES) {
        this.crates = this.game.add.group();
        data.crates.forEach(this._spawnCrate, this);
    }

    //spawn lava
    if (CONST_LAVA) {
        this.lava = this.game.add.group();
        data.lava.forEach(this._spawnLava, this);
    }

    //spawn powerups
    if (CONST_POWERUPS) {
        this.powerups = this.game.add.group();
        data.powerups.forEach(this._spawnPowerup, this);
    }

    // spawn coins
    if (CONST_COINS) {
        this.coins = this.game.add.group();
        data.coins.forEach(this._spawnCoin, this);
    }


    // spawn athe rest of the platforms
    this.platforms = this.game.add.group();
    data.platforms.forEach(this._spawnPlatform, this);
    if (CONST_P2_PHYSICS) var platformCollisionGroup = game.physics.p2.createCollisionGroup();

    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero, enemies: data.enemies});

    //+30/+45 for correction
    this.flags = this.game.add.group();
    data.flags.forEach(this._spawnFlag, this);


    if (CONST_SHOWLEVEL) {
        showlevel = this.game.add.text(20, 10, 'Level ' + this.level, {font: '25px Arial', fill: '#4352ff'});
        showlevel.fixedToCamera = true;
    }

    seconds_last_level = Math.abs(Math.floor(game.timeElapsed / 1));
    setInfoLastLevel();
    this.world.resize(data.size.x, data.size.y);
};

Crowdjump.Game._spawnPlatform = function (platform) {

    var sprite;
    var already_moving = false;
    var already_slippery = false;
    var already_bouncing = false;
    var types = [];

    var newx = platform.x;
    var newy = platform.y;

    if (CONST_P2_PHYSICS) {
        // log(newx,newy);
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
                }
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

Crowdjump.Game.lockPlatform = function (hero, platform) {
    if (!hero.locked) {
        hero.locked = true;
        hero.lockedTo = platform;
        hero.body.velocity.y = 0;
    }
}

Crowdjump.Game._spawnCrate = function (platform) {
    var newx = platform.x;
    var newy = platform.y;

    if (CONST_P2_PHYSICS) {
        // log(newx,newy);
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

    //4 pixel down because of collision
    newy += 4;

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
}

Crowdjump.Game._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;

    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
};

Crowdjump.Game._onHeroVsCoin = function (hero, coin) {
    this.sfx.coin.play();
    coin.kill();
    this.coinPickupCount++;
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

Crowdjump.Game._onHeroVsPowerup = function (hero, powerup) {
    this.sfx.powerup.play();

    switch (powerup.key) {
        case "powerup:lavaorb":
            pu_lavaorb = true;
            break;
        case "powerup:jumpboost":
            pu_jumpboost = true;
            break;
        default:
            console.log(powerup.key);
        //do nothing
    }

    powerup.kill();

    // this.powerupPickupCount++;
};

Crowdjump.Game._onHeroVsEnemy = function (hero, enemy) {
    if (CONST_ZHONYA && zhonya_activated) {
        if (!CONST_KILL_IN_ZHONYA) {
            return;
        }
        if (CONST_KILL_ENEMIES) {
            this._killEnemy(enemy, false);
        }

    }
    if (((hero.body.velocity.y > 0 && hero.body.position.y + 5 < enemy.body.position.y) || hero.body.position.y + 10 < enemy.body.position.y) && CONST_KILL_ENEMIES) {
        this._killEnemy(enemy, true);
    }
    else { // game over -> restart the game
        this.sfx.stomp.play();
        this.killHero("killed by " + enemy.key);
    }
};

Crowdjump.Game._killEnemy = function (enemy, bounce) {
    if (bounce) {
        this.game.hero.bounce();
        this.sfx.stomp.play();
    }
    enemy.die();
    game.enemiesDefeatedCount++;

}

Crowdjump.Game._onHeroVsLava = function (hero, platform) {
    // game over -> restart the game
    this.killHero("death by lava");
};

Crowdjump.Game._onBulletVsEnemy = function (bullet, enemy) {
    this._killEnemy(enemy, false);
    bullet.reset();
};

Crowdjump.Game._onBulletVsPlatform = function (bullet, platform) {
    bullet.reset();
};

Crowdjump.Game._onHeroVsFlag = function (hero, flag) {
    this.sfx.flag.play();
    if (zhonya_activated) {
        this.sfx.zhonyas.stop();
    }
    if (selected_level >= 0) {
        time_overall += game.time.totalElapsedSeconds().toFixed(3) - time_last_level_or_restart;
        time_overall = time_overall.toFixed(3);
        setLevelInfo(selected_level + 1, "completed");
        this.state.start('Endscreen');

    }
    else if (this.level < CONST_LEVEL - 1) {
        setLevelInfo(this.level + 1, "completed");

        if (CONST_SAVE_LEVEL_TIME) {
            time_overall += game.time.totalElapsedSeconds().toFixed(3) - time_last_level_or_restart;
            time_overall = time_overall.toFixed(3);
            time_last_level_or_restart = game.time.totalElapsedSeconds().toFixed(3);
        }
        this.game.state.restart(true, false, {level: this.level + 1});
    } else {
        setLevelInfo(this.level + 1, "completed");
        if (CONST_SAVE_LEVEL_TIME) {
            time_overall += game.time.totalElapsedSeconds().toFixed(3) - time_last_level_or_restart;
            time_overall = time_overall.toFixed(3);
        }
        this.state.start('Endscreen');
    }

};


Crowdjump.Game._onHeroVsSpecialPlatform = function (hero, platform) {
    hero_on_ice = platform.body.slippery;

    if (arrayContains(platform.types, "lavaswitch")){

    }

}

Crowdjump.Game._createHud = function () {
    const NUMBERS_STR = '0123456789X ';
    // const TEXT_STR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!?,:';

    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);
    // this.zhonyaFont = this.game.add.retroFont('font:numbers', 20, 26,
    //     TEXT_STR + NUMBERS_STR, 6);
    // this.zhonyaFont.fixedToCamera = true;

    let coinIcon = this.game.make.image(0, 0, 'icon:coin');
    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
        coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);

    this.hud = this.game.add.group();
    if (CONST_COINS) {
        this.hud.add(coinIcon);
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
};

Crowdjump.Game._createTimerHud = function () {
    const NUMBERS_STR = '0123456789X ';

    this.timeFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);

    this.timehud = this.game.add.group();
    if (CONST_TIME) {
        let timeImg = this.game.make.image(480, 20, this.timeFont);
        timeImg.anchor.set(0.5, 0);

        this.timehud.add(timeImg);
        this.timehud.fixedToCamera = true;
        // this.timehud.position.set(200, 5);

    }
};

Crowdjump.Game.updateTimer = function () {

    game.timeElapsed = game.time.totalElapsedSeconds().toFixed(3);

};

Crowdjump.Game._spawnFlag = function (flagspawn) {
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
        this.pausedIndicator.exists = true;
        this.world.alpha = 0.5;
        //roundTimer.pause();
    }
};

Crowdjump.Game.resumed = function () {
    if (CONST_PAUSE) {
        this.pausedIndicator.exists = false;
        this.world.alpha = 1;
        //roundTimer.resume();
    }

};

Crowdjump.Game.powerup_lavaorb = function () {
    pu_lavaorb = true;
}

Crowdjump.Game.powerup_jumpboost = function () {
    pu_jumpboost = true;
}

Crowdjump.Game.activate_Zhonyas = function () {
    if (zhonya_activated || zhonya_cooldown) {
        return;
    }
    this.sfx.zhonyas.play();

    zhonya_activated = true;
    // Phaser.Sprite.call(this.hero, game, x, y, 'hero_zhonya');
    // this.hero.texture.loadTexture('hero_zhonya');
    game.time.events.add(Phaser.Timer.SECOND * CONST_ZHONYA_DURATION, this.cooldown_Zhonyas, this);
    time_zhonya_activated = game.timeElapsed;

};

Crowdjump.Game.cooldown_Zhonyas = function () {

    zhonya_activated = false;
    zhonya_cooldown = true;
    game.time.events.add(Phaser.Timer.SECOND * CONST_ZHONYA_COOLDOWN, this.ready_Zhonyas, this);
    time_zhonya_cooldown = game.timeElapsed;

};

Crowdjump.Game.ready_Zhonyas = function () {

    zhonya_cooldown = false;

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

Crowdjump.Game.killHero = function (reason) {
    if (death) return; //else you can die twice!
    death = true;
    game.deaths++;
    this.hero.kill();
    console.log("you died because of " + reason);
    this.timeFont.text = '0';
    setLevelInfo(this.level + 1, reason);
    lives -= 1;

    if (CONST_REPLAY_LEVEL) {
        time_last_level_or_restart = game.time.totalElapsedSeconds().toFixed(3);
        log(time_overall);
        this.game.state.restart(true, false, {level: this.level});
        return;
    }

    if (lives <= 0) {
        updateInfo(false);
        this.game.time.reset();
        game.timeElapsed = 0;
        this.state.start('Gameover');
    } else {
        this.game.state.restart(true, false, {level: this.level});
    }

}

Crowdjump.Game.restart = function () {
    // game.gameInfo["rounds_started"] = game.gameInfo["rounds_started"] + 1;
    game.restarts++;
    setLevelInfo(this.level + 1, "restart");
    updateInfo(false);
    last_second = 0;
    game.timeElapsed = 0;
    time_overall = 0;
    time_last_level_or_restart = 0;
    lives = CONST_HERO_LIVES;

    this.state.restart();
    this.game.time.reset();
};