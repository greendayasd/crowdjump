var Crowdjump = Crowdjump || {};


Crowdjump.Preloader = function (game) {
    this.ready = false;
    var text;
};


Crowdjump.Preloader.prototype = {

    create: function () {
    },
    preload: function () {
        this.preloadBar = this.add.sprite(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y, 'preloadbar');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        var files = '/static/website/gamefiles/';
        var level = '/static/website/level/';
        var audio = '/static/website/audio/';
        var images = '/static/website/images/';

        //Ui
        this.load.image('logo', images + 'logo.png');
        // this.load.image('play', images + 'play.png');
        // this.load.image('select_level', images + 'select_level.png');
        this.load.image('bubble', images + 'ideabubble.png');
        this.load.image('alien_death', images + 'alien_death.png');
        this.load.image('mute', images + 'mute.png');
        this.load.image('unmute', images + 'unmute.png');


        // alle Level laden

        var test = false;

        if (test) {
            this.load.json('level:0', level + 'level1.json');

        } else {
            for (i = 0; i < CONST_LEVEL; i++) {
                var levelname = 'level';
                levelname += i + '';

                this.load.json('level:' + i, level + levelname + '.json');
            }
        }


        //files
        this.load.image('background', files + 'background.png');

        this.load.image('ground', files + 'ground.png');
        this.load.image('ground:1x1', files + 'ground_1x1.png');
        this.load.image('ground:1x2', files + 'ground_1x2.png');
        this.load.image('ground:1x3', files + 'ground_1x3.png');
        this.load.image('ground:1x4', files + 'ground_1x4.png');
        this.load.image('ground:1x6', files + 'ground_1x6.png');
        this.load.image('ground:1x8', files + 'ground_1x8.png');
        this.load.image('ground:1x10', files + 'ground_1x10.png');
        this.load.image('ground:1x12', files + 'ground_1x12.png');
        this.load.image('ground:2x1', files + 'ground_2x1.png');
        this.load.image('ground:2x2', files + 'ground_2x2.png');
        this.load.image('ground:4x1', files + 'ground_4x1.png');
        this.load.image('ground:4x2', files + 'ground_4x2.png');
        this.load.image('ground:5x1', files + 'ground_5x1.png');
        this.load.image('ground:6x1', files + 'ground_6x1.png');
        this.load.image('ground:8x1', files + 'ground_8x1.png');
        this.load.image('ground:10x1', files + 'ground_10x1.png');
        this.load.image('ground:12x1', files + 'ground_12x1.png');
        this.load.image('ground:20x1', files + 'ground_20x1.png');

        this.load.image('fakeground:1x1', files + 'fakeground_1x1.png');
        this.load.image('fakeground:1x2', files + 'fakeground_1x2.png');

        this.load.image('lavaground:2x1', files + 'lavaground_2x1.png');

        this.load.image('grass:1x1', files + 'grass_1x1.png');
        this.load.image('grass:2x1', files + 'grass_2x1.png');
        this.load.image('grass:4x1', files + 'grass_4x1.png');
        this.load.image('grass:6x1', files + 'grass_6x1.png');
        this.load.image('grass:8x1', files + 'grass_8x1.png');

        this.load.image('ice:1x1', files + 'ice_1x1.png');
        this.load.image('ice:2x1', files + 'ice_2x1.png');
        this.load.image('ice:6x1', files + 'ice_6x1.png');

        this.load.image('lava:1x1', files + 'lava2_1x1.png');
        this.load.image('lava:2x1', files + 'lava2_2x1.png');

        this.load.image('bounce:1x1', files + 'bounce_1x1.png');

        if (CONST_DEBUG) {
            this.load.image('invisible_wall', files + 'invisible_wall_debug.png');
            this.load.image('invisible_wall_horizontal', files + 'invisible_wall_horizontal_debug.png');
            this.load.image('move_wall', files + 'invisible_wall_debug.png');
            this.load.image('move_wall_horizontal', files + 'invisible_wall_horizontal_debug.png');

        } else {
            this.load.image('invisible_wall', files + 'invisible_wall.png');
            this.load.image('invisible_wall_horizontal', files + 'invisible_wall_horizontal.png');
            this.load.image('move_wall', files + 'move_wall.png');
            this.load.image('move_wall_horizontal', files + 'move_wall_horizontal.png');

        }

        this.load.image('white_smoke', files + 'white_smoke.png');

        this.load.image('invisible:1x1', files + 'invisible_1x1.png');
        this.load.image('invisible:1x2', files + 'invisible_1x2.png');
        this.load.image('invisible:1x4', files + 'invisible_1x4.png');
        this.load.image('invisible:2x1', files + 'invisible_2x1.png');
        this.load.image('invisible:4x1', files + 'invisible_4x1.png');
        this.load.image('invisible:8x1', files + 'invisible_8x1.png');

        if (CONST_ANIMATE_COIN) {
            this.load.spritesheet('coin', files + 'coin_animated.png', 22, 22);
        } else {
            this.load.image('coin', files + 'coin_icon.png');
        }
            this.load.image('icon:coin', files + 'coin_icon.png');

        if (CONST_ANIMATE_CONVEYOR) {

        } else {
            this.load.image('conveyor_right:1x1', files + 'conveyor_right_1x1.png');
            this.load.image('conveyor_left:1x1', files + 'conveyor_left_1x1.png');
        }

        this.load.image('easteregg:specialname', files + 'easteregg_specialname.png');
        this.load.image('easteregg:time', files + 'easteregg_time.png');
        this.load.image('easteregg:movementspeed', files + 'easteregg_movementspeed.png');
        this.load.image('easteregg:money', files + 'easteregg_money.png');

        this.load.image('powerup:lavaorb', files + 'powerup_lavaorb.png');
        this.load.image('powerup:jumpboost', files + 'powerup_jumpboost.png');

        this.load.image('crate', files + 'crate.png');

        this.load.image('bullet', files + 'bullet.png');

        //character
        if (CONST_ANIMATE_CHARACTER) {
            this.load.spritesheet('hero', files + 'zhonya template2.png', 34, 42);
        }
        else {
            this.load.image('hero', files + 'hero_stopped.png');
        }

        //audio
        this.load.audio('sfx:jump', audio + 'jump.wav');
        this.load.audio('sfx:coin', audio + 'coin.wav');
        this.load.audio('sfx:stomp', audio + 'stomp.wav');
        this.load.audio('sfx:flag', audio + 'flag.wav');
        this.load.audio('sfx:zhonya', audio + 'zhonya.wav');
        this.load.audio('sfx:shoot', audio + 'shoot.mp3');
        this.load.audio('sfx:empty_magazine', audio + 'empty_magazine.wav');
        this.load.audio('sfx:powerup', audio + 'powerup.mp3');
        this.load.audio('sfx:easteregg', audio + 'easteregg.wav');

        this.load.spritesheet('spider', files + 'spider2.png', 42, 32);

        this.load.spritesheet('flag', files + 'flag.png', 42, 66);

        //fonts
        this.load.image('font:numbers', files + 'numbers.png');

        // this.load.audio('myMusic', audio + 'Test.mp3');
        // this.load.audio('myMusic2', audio + 'Test2.mp3');
        // this.load.audio('myMusic3', audio + 'Test3.mp3');

        this.load.onLoadStart.add(this.loadStart, this);
        this.load.onLoadComplete.add(this.loadComplete, this);


    },
    loadStart: function () {
        text = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y - 30, 'Loading. . . ');
        text.anchor.set(0.5);
    },
    loadComplete: function () {
        this.ready = true;
    },
    update: function () {
        if (this.ready === true) {
            this.ready = false;
            text.setText('');

            game.gameInfo = g_gameinfo;

            game.authenticated = true;

            if (game.gameInfo == '') {
                // console.error("nicht auth");
                game.authenticated = false;
            }
            if (CONST_LEVELSELECTION) {
                this.state.start('Startmenu');
            } else {
                this.state.start('Game');
            }
            // this.state.start('Endscreen');
        }
    }

};