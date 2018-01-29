var Crowdjump = Crowdjump || {};

// =============================================================================
// globals
// =============================================================================
Crowdjump.Game = function(game){

    var second_jump = true;
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
}


// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;

    // update image flipping & animations
    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};

Hero.prototype.jump = function () {
    const JUMP_SPEED = 700;
    let canJump = this.body.touching.down;

    if (this.body.touching.down){
        second_jump = true;
    }

    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
    } else{
        if(second_jump && CONST_DOUBLE_JUMP){
            this.body.velocity.y = -(JUMP_SPEED*0.8);
            second_jump = false;
            return true;
        }
    }

    return canJump;
};

Hero.prototype.bounce = function () {
    const BOUNCE_SPEED = 200;
    this.body.velocity.y = -BOUNCE_SPEED;
};

Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    if (CONST_ANIMATE_CHARACTER){
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

    return name;
};


//
// Spider (enemy)
//
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
            this.sfx.jump.play("",0,0.3,false,true);
        }
    };

    this.keys.up.onDown.add(jump, this);
    this.keys.space.onDown.add(jump, this);

    if (typeof  data !== 'undefined'){
        this.level =  data.level;

    }else{
        this.level =  0;

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
    };

    this.game.add.image(0, 0, 'background');
    this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));

    this._createHud();
    this._createTimerHud();

    if (CONST_PAUSE){
        this.pausedIndicator = this.add.text(0, 0, 'paused', {fill: 'black', font: '48px sans-serif'});
        this.pausedIndicator.alignIn(this.world.bounds, Phaser.CENTER);
        this.pausedIndicator.exists = false;

        // We place this on the Stage, above the World, so we can toggle the World alpha in `paused`/`resumed`.
        this.stage.addChild(this.pausedIndicator);
    }


    this.input.keyboard.addKey(Phaser.KeyCode.R).onUp.add(this.restart, this);
    this.roundTimer = game.time.events.loop(Phaser.Timer.SECOND, this.updateTimer,this);
};

Crowdjump.Game.update = function () {
    this._handleCollisions();
    this._handleInput();

    var elapsedTime = Math.floor(this.game.time.totalElapsedSeconds());

    var seconds = Math.abs(game.timeElapsed / 1 );
    this.timeFont.text = `${seconds}`;
    this.coinFont.text = `x${this.coinPickupCount}`;
};

Crowdjump.Game._handleCollisions = function () {
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.hero, this.platforms);

    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this);
    this.game.physics.arcade.overlap(this.hero, this.spiders,
        this._onHeroVsEnemy, null, this);

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

Crowdjump.Game._loadLevel = function (data) {
    // create all the groups/layers that we need

    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();

    this.coins = this.game.add.group();

    this.spiders = this.game.add.group();

    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;

    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);

    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero, spiders: data.spiders});


    // spawn important objects
    if (CONST_COINS){
      data.coins.forEach(this._spawnCoin, this);
    }

    this._spawnFlag(data.flag.x, data.flag.y);

    // enable gravity
    const GRAVITY = 1400;
    this.game.physics.arcade.gravity.y = GRAVITY;
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
            this.spiders.add(sprite);
        }, this);
    }
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};

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
    if (hero.body.velocity.y > 0) { // kill enemies when hero is falling
        hero.bounce();
        enemy.die();
        this.sfx.stomp.play();
    }
    else { // game over -> restart the game
        this.sfx.stomp.play();
        this.game.state.restart(true, false, {level: this.level});
    }
};

Crowdjump.Game._onHeroVsFlag = function (hero, flag) {
    this.sfx.flag.play();
    if (this.level < CONST_LEVEL -1){
        console.log(this.level);
       this.game.state.restart(true, false, { level: this.level + 1 });
    }else{
      this.state.start('Endscreen');
    }

};

Crowdjump.Game._createHud = function () {
    const NUMBERS_STR = '0123456789X ';

    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);

    let coinIcon = this.game.make.image(0, 0, 'icon:coin');
    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
        coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);

    this.hud = this.game.add.group();
    if (CONST_COINS){
        this.hud.add(coinIcon);
        this.hud.add(coinScoreImg);
    }

    this.hud.position.set(10, 10);
};


Crowdjump.Game._createTimerHud = function(){
    const NUMBERS_STR = '0123456789X ';

    this.timeFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);

    this.timehud = this.game.add.group();
    if (CONST_TIME){
        let timeImg = this.game.make.image(20,20, this.timeFont);
        timeImg.anchor.set(0.5, 0);

        this.timehud.add(timeImg);
        this.timehud.position.set(game.world.centerX,5);

    }
};

Crowdjump.Game.updateTimer = function(){

    var new_elapsed = this.game.time.totalElapsedSeconds();
    game.timeElapsed = Math.floor(new_elapsed);

};

Crowdjump.Game._spawnFlag = function (x, y) {
    this.flag = this.bgDecoration.create(x, y, 'flag');
    this.flag.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.flag);
    this.flag.body.allowGravity = false;
    this.flag.body.allowGravity = false;
};

Crowdjump.Game.paused = function(){
    if(CONST_PAUSE){
        this.pausedIndicator.exists = true;
        this.world.alpha = 0.5;
        //roundTimer.pause();
    }
};

Crowdjump.Game.resumed = function(){
    if(CONST_PAUSE){
        this.pausedIndicator.exists = false;
        this.world.alpha = 1;
        //roundTimer.resume();
    }

};

Crowdjump.Game.restart = function() {
    this.state.restart();
    this.game.time.reset();
};