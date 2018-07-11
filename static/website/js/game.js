var Crowdjump = Crowdjump || {};

// =============================================================================
// globals
// =============================================================================
Crowdjump.Game = function (game) {

    var second_jump = true;
    var level_data;
    var last_second = 0;
    var seconds_last_level = 0;
    var zhonya_activated = false;
    var zhonya_cooldown = false;
    var time_zhonya_activated = 0;
    var time_zhonya_cooldown = 0;
    var nextFire = 0;
    var bulletsprite;
    var bullets;
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
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;

    this.animations.add('stop', [0]);
    this.animations.add('run', [1, 2], 8, true); // 8fps looped
    this.animations.add('jump', [3]);
    this.animations.add('fall', [4]);
    this.animations.add('zhonya', [6]);
}


// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    this.body.velocity.x = direction * CONST_MOVE_SPEED;

    // update image flipping & animations
    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};

Hero.prototype.jump = function () {
    let canJump = this.body.touching.down;

    if (this.body.touching.down) {
        second_jump = true;
    }

    if (canJump) {
        this.body.velocity.y = -CONST_JUMP_SPEED;
        game.jumps++;
    } else {
        if (second_jump && CONST_DOUBLE_JUMP) {
            this.body.velocity.y = -(CONST_JUMP_SPEED * 0.8);
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
    this.body.velocity.x = Spider.SPEED;
}

Spider.SPEED = 100;

// inherit from Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED; // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED; // turn right
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
        up: Phaser.KeyCode.UP
    });

    jump = function () {
        let didJump = this.hero.jump();
        if (didJump) {
            this.sfx.jump.play("", 0, 0.3, false, true);
        }
    };

    this.keys.left.onDown.add(this._countMovementInput, this);
    this.keys.right.onDown.add(this._countMovementInput, this);

    this.keys.up.onDown.add(jump, this);
    this.keys.space.onDown.add(jump, this);


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
    last_second = 0;
    nextFire = 0;

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
    };

    this.game.add.image(0, 0, 'background');
    zhonya_activated = false;
    zhonya_cooldown = false;
    time_zhonya_activated = 0;
    time_zhonya_cooldown = 0;
    level_data = this.game.cache.getJSON(`level:${this.level}`);
    this._loadLevel(level_data);

    this._createHud();
    this._createTimerHud();

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

};

Crowdjump.Game.update = function () {
    this._handleCollisions();
    this._handleInput();
    // var elapsedTime = Math.floor(this.game.time.totalElapsedSeconds());
    // console.error(this.roundTimer.seconds);
    var seconds = Math.abs(Math.floor(game.timeElapsed / 1));
    if (seconds != last_second) {
        last_second = seconds;
        if (level_data.repeats) {
            this._newSpawns({spiders: level_data.repeat_spiders});
        }

    }
    this.timeFont.text = `${seconds}`;
    this.coinFont.text = `x${this.coinPickupCount}`;

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

        if (this.game.input.activePointer.isDown) {
            this.fire_Bullet();
        }

    }
};

Crowdjump.Game._handleCollisions = function () {
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.hero, this.platforms);
    // this.game.physics.arcade.collide(this.spiders, bullets);
    // this.game.physics.arcade.collide(bullets, this.platforms);

    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this);

    if (CONST_LAVA) {
        this.game.physics.arcade.overlap(this.hero, this.lava, this._onHeroVsLava,
            null, this);
    }


    if (CONST_SHOOTING) {
        this.game.physics.arcade.overlap(bullets, this.spiders, this._onBulletVsEnemy,
            null, this);
        this.game.physics.arcade.overlap(bullets, this.platforms, this._onBulletVsPlatform,
            null, this);

    }


    if (!CONST_ZHONYA || !zhonya_activated || CONST_KILL_IN_ZHONYA) {
        this.game.physics.arcade.overlap(this.hero, this.spiders,
            this._onHeroVsEnemy, null, this);
    }

    this.game.physics.arcade.overlap(this.hero, this.flag, this._onHeroVsFlag,
        // ignore if there is no key or the player is on air
        function (hero, flag) {
            return hero.body.touching.down;
        }, this);
};

Crowdjump.Game._handleInput = function () {
    if (this.keys.left.isDown) { // move hero left
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // move hero right
        this.hero.move(1);
    }
    else { // stop
        this.hero.move(0);
    }
};

Crowdjump.Game._countMovementInput = function () {
    game.movement_inputs += 1;
}

Crowdjump.Game._loadLevel = function (data) {
    // create all the groups/layers that we need

    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();

    if (CONST_LAVA) {
        this.lava = this.game.add.group();
    }


    this.coins = this.game.add.group();

    this.spiders = this.game.add.group();

    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;
    // console.error("spiders" + level_data.repeat_spiders);

    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);

    //spawn lava
    if (CONST_LAVA) {
        data.lava.forEach(this._spawnLava, this);
    }

    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero, spiders: data.spiders});


    // spawn important objects
    if (CONST_COINS) {
        data.coins.forEach(this._spawnCoin, this);
    }

    this._spawnFlag(data.flag.x, data.flag.y);

    // enable gravity
    this.game.physics.arcade.gravity.y = CONST_GRAVITY;

    seconds_last_level = Math.abs(Math.floor(game.timeElapsed / 1));


    this.world.resize(data.size.x, data.size.y);
};

Crowdjump.Game._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};


Crowdjump.Game._spawnLava = function (lava) {
    let sprite = this.lava.create(
        lava.x, lava.y, lava.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

    this._spawnEnemyWall(lava.x, lava.y, 'left');
    this._spawnEnemyWall(lava.x + sprite.width, lava.y, 'right');
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

Crowdjump.Game._spawnCharacters = function (data) {

    if (CONST_ENEMIES) {
        // spawn spiders
        data.spiders.forEach(function (spider) {
            let sprite = new Spider(this.game, spider.x, spider.y);
            // sprite.anchor.set(0.5,0.5);
            this.spiders.add(sprite);
        }, this);
    }
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};

Crowdjump.Game._newSpawns = function (data) {
    if (CONST_ENEMIES) {
        // spawn spiders
        var seconds_this_game = last_second - seconds_last_level;
        data.spiders.forEach(function (spider) {
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

Crowdjump.Game._onHeroVsEnemy = function (hero, enemy) {
    // if (hero.body.velocity.y > 0 && hero.body.position.y < enemy.body.position.y) {  // kill enemies when hero is falling
    if (CONST_ZHONYA && zhonya_activated) {
        if (!CONST_KILL_IN_ZHONYA) {
            return;
        }
        enemy.die();
        game.enemiesDefeatedCount++;
        this.sfx.stomp.play();
        return;
    }
    if ((hero.body.velocity.y > 0 && hero.body.position.y + 5 < enemy.body.position.y) || hero.body.position.y + 10 < enemy.body.position.y) {
        // console.log("enemy killed: hero: " + hero.body.position.y + "  spider: " + enemy.body.position.y);
        hero.bounce();
        enemy.die();
        game.enemiesDefeatedCount++;
        // console.error("enemy " + game.enemiesDefeatedCount);

        this.sfx.stomp.play();
    }
    else { // game over -> restart the game
        // console.log("killed: hero: " + hero.body.position.y + "  velocity: " + hero.body.velocity.y + "  spider: " + enemy.body.position.y);
        this.sfx.stomp.play();
        console.log(enemy);
        console.log(enemy.name);
        console.log(enemy.type);

        this.killHero("death by " + enemy.name);
    }
};

Crowdjump.Game._onHeroVsLava = function (hero, platform) {
    // game over -> restart the game
    // console.log("killed: hero: " + hero.body.position.y + "  velocity: " + hero.body.velocity.y + "  spider: " + enemy.body.position.y);

    this.killHero("death by lava");
};

Crowdjump.Game._onBulletVsEnemy = function (bullet, enemy) {
    enemy.die();
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
    if (this.level < CONST_LEVEL - 1) {
        // console.log(this.level + ' level');
        setLevelInfo(this.level + 1, "completed");
        this.game.state.restart(true, false, {level: this.level + 1});
    } else {
        setLevelInfo(this.level + 1, "completed");
        this.state.start('Endscreen');
    }

};

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

    game.timeElapsed = this.game.time.totalElapsedSeconds();

};

Crowdjump.Game._spawnFlag = function (x, y) {
    this.flag = this.bgDecoration.create(x, y, 'flag');
    this.flag.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.flag);
    this.flag.body.allowGravity = false;
    this.flag.body.allowGravity = false;
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
    if (this.game.time.now > nextFire && bullets.countDead() > 0) {
        this.sfx.shoot.play();
        nextFire = this.game.time.now + CONST_FIRERATE;

        var bullet = bullets.getFirstDead();

        bullet.reset(this.hero.position.x - 8, this.hero.position.y - 8);
        // console.log("fire " + nextFire);

        this.game.physics.arcade.moveToPointer(bullet, CONST_BULLETSPEED);
    }

};

Crowdjump.Game.killHero = function (reason) {
    game.deaths++;
    this.timeFont.text = '0';
    setLevelInfo(this.level + 1, reason);
    //this.game.state.restart(true, false, {level: this.level});
    this.game.time.reset();
    this.state.start('Gameover');

}

Crowdjump.Game.restart = function () {
    // game.gameInfo["rounds_started"] = game.gameInfo["rounds_started"] + 1;
    game.restarts++;
    setLevelInfo(this.level + 1, "restart");
    updateInfo(false);
    last_second = 0;

    this.state.restart();
    this.game.time.reset();
};
