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
        var tiles = files + 'tiles/';
        var fonts = files + 'fonts/';
        var collectibles = files + 'collectibles/';
        var characters = files + 'characters/';
        var enemies = files + 'enemies/';
        var obstacles = files + 'obstacles/';
        var misc = files + 'misc/';


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
            for (var i = 0; i < CONST_LEVEL; i++) {
                var levelname = 'level';
                levelname += i + '';

                this.load.json('level:' + i, level + levelname + '.json');
            }
        }


        //tiles
        this.load.image('ground', tiles + 'ground.png');
        this.load.image('ground:1x1', tiles + 'ground_1x1.png');
        this.load.image('ground:1x2', tiles + 'ground_1x2.png');
        this.load.image('ground:1x3', tiles + 'ground_1x3.png');
        this.load.image('ground:1x4', tiles + 'ground_1x4.png');
        this.load.image('ground:1x6', tiles + 'ground_1x6.png');
        this.load.image('ground:1x8', tiles + 'ground_1x8.png');
        this.load.image('ground:1x10', tiles + 'ground_1x10.png');
        this.load.image('ground:1x12', tiles + 'ground_1x12.png');
        this.load.image('ground:2x1', tiles + 'ground_2x1.png');
        this.load.image('ground:2x2', tiles + 'ground_2x2.png');
        this.load.image('ground:4x1', tiles + 'ground_4x1.png');
        this.load.image('ground:4x2', tiles + 'ground_4x2.png');
        this.load.image('ground:5x1', tiles + 'ground_5x1.png');
        this.load.image('ground:6x1', tiles + 'ground_6x1.png');
        this.load.image('ground:8x1', tiles + 'ground_8x1.png');
        this.load.image('ground:10x1', tiles + 'ground_10x1.png');
        this.load.image('ground:12x1', tiles + 'ground_12x1.png');
        this.load.image('ground:20x1', tiles + 'ground_20x1.png');

        this.load.image('fakeground:1x1', tiles + 'fakeground_1x1.png');
        this.load.image('fakeground:1x2', tiles + 'fakeground_1x2.png');

        this.load.image('lavaground:2x1', tiles + 'lavaground_2x1.png');

        this.load.image('grass:1x1', tiles + 'grass_1x1.png');
        this.load.image('grass:2x1', tiles + 'grass_2x1.png');
        this.load.image('grass:4x1', tiles + 'grass_4x1.png');
        this.load.image('grass:6x1', tiles + 'grass_6x1.png');
        this.load.image('grass:8x1', tiles + 'grass_8x1.png');

        this.load.image('ice:1x1', tiles + 'ice_1x1.png');
        this.load.image('ice:2x1', tiles + 'ice_2x1.png');
        this.load.image('ice:6x1', tiles + 'ice_6x1.png');

        this.load.image('lava:1x1', tiles + 'lava_1x1.png');
        this.load.image('lava:2x1', tiles + 'lava_2x1.png');

        this.load.image('bounce:1x1', tiles + 'bounce_1x1.png');

        if (CONST_DEBUG) {
            this.load.image('invisible_wall', tiles + 'invisible_wall_debug.png');
            this.load.image('invisible_wall_horizontal', tiles + 'invisible_wall_horizontal_debug.png');
            this.load.image('move_wall', tiles + 'invisible_wall_debug.png');
            this.load.image('move_wall_horizontal', tiles + 'invisible_wall_horizontal_debug.png');

        } else {
            this.load.image('invisible_wall', tiles + 'invisible_wall.png');
            this.load.image('invisible_wall_horizontal', tiles + 'invisible_wall_horizontal.png');
            this.load.image('move_wall', tiles + 'move_wall.png');
            this.load.image('move_wall_horizontal', tiles + 'move_wall_horizontal.png');

        }

        this.load.image('invisible:1x1', tiles + 'invisible_1x1.png');
        this.load.image('invisible:1x2', tiles + 'invisible_1x2.png');
        this.load.image('invisible:1x4', tiles + 'invisible_1x4.png');
        this.load.image('invisible:2x1', tiles + 'invisible_2x1.png');
        this.load.image('invisible:4x1', tiles + 'invisible_4x1.png');
        this.load.image('invisible:8x1', tiles + 'invisible_8x1.png');

        if (CONST_ANIMATE_CONVEYOR) {

        } else {
            this.load.image('conveyor_right:1x1', tiles + 'conveyor_right_1x1.png');
            this.load.image('conveyor_left:1x1', tiles + 'conveyor_left_1x1.png');
        }

        //characters
        if (CONST_ANIMATE_CHARACTER) {
            this.load.spritesheet('hero', characters + 'zhonya template2.png', 34, 42);
        }
        else {
            for (var i = 0; i < CONST_CHARACTER_COUNT; i++) {
                game.load.image('c' + i, characters + 'character' + i + '.png');
            }
        }
        //test own characters
        // var own_characters ='/media/characters';
        // game.load.image('1.png', own_characters + '/1.png');


        //obstacles
        this.load.image('spikes:1x1', obstacles + 'spikes_1x1.png');

        //collectibles
        this.load.image('easteregg:specialname', collectibles + 'easteregg_specialname.png');
        this.load.image('easteregg:time', collectibles + 'easteregg_time.png');
        this.load.image('easteregg:movementspeed', collectibles + 'easteregg_movementspeed.png');
        this.load.image('easteregg:money', collectibles + 'easteregg_money.png');

        this.load.image('powerup:lavaorb', collectibles + 'powerup_lavaorb.png');
        this.load.image('powerup:jumpboost', collectibles + 'powerup_jumpboost.png');
        this.load.image('powerup:zhonyas', collectibles + 'powerup_zhonyas.png');


        if (CONST_ANIMATE_COIN) {
            this.load.spritesheet('coin', collectibles + 'coin_animated.png', 22, 22);
        } else {
            this.load.image('coin', collectibles + 'coin_icon.png');
        }
        this.load.image('icon:coin', collectibles + 'coin_icon.png');

        //misc
        this.load.image('background', misc + 'background.png');
        this.load.image('white_smoke', misc + 'white_smoke.png');
        this.load.image('crate', misc + 'crate.png');
        this.load.image('bullet', misc + 'bullet.png');
        // this.load.image('flag', misc + 'flag_new.png');
        this.load.spritesheet('flag', misc + 'flag.png', 42, 66);

        //enemies
        this.load.spritesheet('spider', enemies + 'spider2.png', 42, 32);


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


        //fonts
        this.load.image('font:numbers', fonts + 'numbers.png');

        this.load.onLoadStart.add(this.loadStart, this);
        this.load.onLoadComplete.add(this.loadComplete, this);


    },
    loadStart: function () {
        if (game.state.current != "Preloader") return;
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


            if (game.gameInfo == '') game.authenticated = false;
            else if (account.uploaded_character != '' && account.uploaded_character != null){
                game.load.image(getFileName(account.uploaded_character), account.uploaded_character);
                game.load.start();
            }

            if (CONST_LEVELSELECTION || CONST_CHARACTERSELECTION) {
                this.state.start('Startmenu');
            } else {
                this.state.start('Game');
            }
        }
    }

};