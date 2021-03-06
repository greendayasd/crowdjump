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
        var fonts = files + 'fonts/';
        var characters = files + 'characters/';

        var tiles = files + 'tiles/';
        var old = tiles + 'old/';
        var grounds = tiles + 'ground/';
        var spawns = tiles + 'spawn/';
        var grass = tiles + 'grass/';

        var collectibles = files + 'collectibles/';
        var obstacles = files + 'obstacles/';
        var bases = files + 'bases/';
        var enemies = files + 'enemies/';
        var cannons = files + 'cannons/';
        var deco = files + 'deco/';
        var misc = files + 'misc/';
        var teleporter = files + 'teleporter/';


        var level = '/static/website/level/';
        var audio = '/static/website/audio/';
        var images = '/static/website/images/';

        //
        //Ui
        //
        this.load.image('logo', images + 'logo.png');
        // this.load.image('play', images + 'play.png');
        // this.load.image('select_level', images + 'select_level.png');
        this.load.image('bubble', images + 'ideabubble.png');
        this.load.image('alien_death', images + 'alien_death.png');

        if (CONST_MUTE) {
            this.load.image('mute', images + 'mute.png');
            this.load.image('unmute', images + 'unmute.png');
        }


        // alle Level laden
        var test = false;
        if (test) {
            this.load.json('level:0:0', level + 'level4_0.json');
            this.load.json('level:0:1', level + 'level4_1.json');
            this.load.json('level:0:2', level + 'level4_2.json');

        } else if (CONST_MULTIPLE_DIFFICULTIES) {
            for (var dif = 0; dif < CONST_DIFFICULTIES; dif++) {
                for (var i = 0; i < CONST_LEVEL; i++) {
                    var levelname = 'level';
                    levelname += i + '';

                    this.load.json('level:' + i + ':' + dif, level + levelname + '_' + dif + '.json?v=1');
                }
            }
        } else {
            for (var i = 0; i < CONST_LEVEL; i++) {
                var levelname = 'level';
                levelname += i + '';
                this.load.json('level:' + i, level + levelname + '.json?' + new Date().getTime());
            }

        }

        //
        //fonts
        //
        this.load.image('font:numbers', fonts + 'numbers.png');

        //
        //characters
        //
        if (CONST_ANIMATE_CHARACTER) {
            this.load.spritesheet('hero', characters + 'zhonya template2.png', 34, 42);
        }
        else {
            for (var i = 0; i < CONST_CHARACTER_COUNT; i++) {
                game.load.image('c' + i, characters + 'character' + i + '.png');
            }
        }

        //
        //tiles
        //
        if (!CONST_NEW_BLOCKS) {
            grounds = old;
            grass = old;
        }
        this.load.image('ground', grounds + 'ground.png');
        this.load.image('ground:1x1', grounds + 'ground_1x1.png');
        this.load.image('ground:1x2', grounds + 'ground_1x2.png');
        this.load.image('ground:1x3', grounds + 'ground_1x3.png');
        this.load.image('ground:1x4', grounds + 'ground_1x4.png');
        this.load.image('ground:1x6', grounds + 'ground_1x6.png');
        this.load.image('ground:1x8', grounds + 'ground_1x8.png');
        this.load.image('ground:1x10', grounds + 'ground_1x10.png');
        this.load.image('ground:1x12', grounds + 'ground_1x12.png');
        this.load.image('ground:2x1', grounds + 'ground_2x1.png');
        this.load.image('ground:2x2', grounds + 'ground_2x2.png');
        this.load.image('ground:4x1', grounds + 'ground_4x1.png');
        this.load.image('ground:4x2', grounds + 'ground_4x2.png');
        this.load.image('ground:5x1', grounds + 'ground_5x1.png');
        this.load.image('ground:6x1', grounds + 'ground_6x1.png');
        this.load.image('ground:8x1', grounds + 'ground_8x1.png');
        this.load.image('ground:10x1', grounds + 'ground_10x1.png');
        this.load.image('ground:12x1', grounds + 'ground_12x1.png');
        this.load.image('ground:20x1', grounds + 'ground_20x1.png');

        this.load.image('fakeground:1x1', grounds + 'ground_1x1.png');
        this.load.image('fakeground:1x2', grounds + 'ground_1x2.png');

        this.load.image('grass:1x1', grass + 'grass_1x1.png');
        this.load.image('grass:2x1', grass + 'grass_2x1.png');
        this.load.image('grass:4x1', grass + 'grass_4x1.png');
        this.load.image('grass:6x1', grass + 'grass_6x1.png');
        this.load.image('grass:8x1', grass + 'grass_8x1.png');

        if (CONST_BUTTONS_AND_GATES) {
            this.load.spritesheet('spawnBlue:1x1', spawns + 'spawnBlue_1x1.png', 42, 42);
            this.load.spritesheet('spawnBlue:2x1', spawns + 'spawnBlue_2x1.png', 84, 42);
            this.load.spritesheet('spawnRed:1x1', spawns + 'spawnRed_1x1.png', 42, 42);
            this.load.spritesheet('spawnRed:2x1', spawns + 'spawnRed_2x1.png', 84, 42);
            this.load.spritesheet('spawnGreen:1x1', spawns + 'spawnGreen_1x1.png', 42, 42);
            this.load.spritesheet('spawnGreen:2x1', spawns + 'spawnGreen_2x1.png', 84, 42);
            this.load.spritesheet('spawnPurple:1x1', spawns + 'spawnPurple_1x1.png', 42, 42);
            this.load.spritesheet('spawnPurple:2x1', spawns + 'spawnPurple_2x1.png', 84, 42);
            this.load.spritesheet('spawnYellow:1x1', spawns + 'spawnYellow_1x1.png', 42, 42);
            this.load.spritesheet('spawnYellow:2x1', spawns + 'spawnYellow_2x1.png', 84, 42);
            this.load.spritesheet('spawnCyan:1x1', spawns + 'spawnCyan_1x1.png', 42, 42);
            this.load.spritesheet('spawnCyan:2x1', spawns + 'spawnCyan_2x1.png', 84, 42);
        }

        if (CONST_SLIPPERYPLATFORMS) {
            this.load.image('ice:1x1', tiles + 'ice_1x1.png');
            this.load.image('ice:2x1', tiles + 'ice_2x1.png');
            this.load.image('ice:6x1', tiles + 'ice_6x1.png');
        }

        if (CONST_LAVA) {
            this.load.image('lavabase:1x1', tiles + 'lavabase_1x1.png');
            this.load.image('lavabase:2x2', tiles + 'lavabase_2x2.png');
            this.load.image('fakelavabase:1x1', tiles + 'fakelavabase_1x1.png');
            if (CONST_ANIMATE_LAVA) {
                this.load.spritesheet('lava:1x1', tiles + 'lava_1x1_animated.png', 42, 38);
                this.load.spritesheet('lava:2x1', tiles + 'lava_2x1_animated.png', 84, 38);
                this.load.spritesheet('fakelava:1x1', tiles + 'lava_1x1_animated.png', 42, 38);
            } else {
                this.load.image('lava:1x1', tiles + 'lava_1x1.png');
                this.load.image('lava:2x1', tiles + 'lava_2x1.png');
                this.load.image('fakelava:1x1', tiles + 'fakelava_1x1.png');
            }
        }

        if (CONST_LAVASWITCHINGPLATFORM) {
            this.load.image('lavaground:2x1', tiles + 'lavaground_2x1.png');
        }

        if (CONST_BOUNCINGPLATFORMS) this.load.image('bounce:1x1', tiles + 'bounce_1x1.png');

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

        if (CONST_CONVEYORPLATFORMS) {
            if (CONST_ANIMATE_CONVEYOR) {

            } else {
                this.load.image('conveyor_right:1x1', tiles + 'conveyor_right_1x1.png');
                this.load.image('conveyor_left:1x1', tiles + 'conveyor_left_1x1.png');
            }
        }

        //
        //collectibles
        //
        if (CONST_EASTEREGGS) {
            this.load.image('easteregg:specialname', collectibles + 'easteregg_specialname.png');
            this.load.image('easteregg:time', collectibles + 'easteregg_time.png');
            this.load.image('easteregg:movementspeed', collectibles + 'easteregg_movementspeed.png');
            this.load.image('easteregg:money', collectibles + 'easteregg_money.png');
        }

        if (CONST_POWERUPS) {
            if (CONST_ANIMATE_POWERUPS) {
                this.load.spritesheet('powerup:throughwalls', collectibles + 'powerup_throughwalls_animated.png', 38, 38);
                this.load.spritesheet('powerup:permjumpboost', collectibles + 'powerup_permjumpboost_animated.png', 38, 38);
                this.load.spritesheet('powerup:time', collectibles + 'powerup_time_animated.png', 38, 38);
                this.load.spritesheet('powerup:doublejump', collectibles + 'powerup_doublejump_animated.png', 38, 38);
                // this.load.spritesheet('powerup:lavaorb', collectibles + 'powerup_lavaorb_animated.png', 38, 38);
                // this.load.spritesheet('powerup:jumpboost', collectibles + 'powerup_jumpboost_animated.png', 38, 38);
                // this.load.spritesheet('powerup:zhonyas', collectibles + 'powerup_zhonyas_animated.png', 38, 38);

            } else {
                this.load.image('powerup:throughwalls', collectibles + 'powerup_throughwalls.png');
                this.load.image('powerup:permjumpboost', collectibles + 'powerup_permjumpboost.png');
                this.load.image('powerup:time', collectibles + 'powerup_time.png');
                this.load.image('powerup:doublejump', collectibles + 'powerup_doublejump.png');
                // this.load.image('powerup:lavaorb', collectibles + 'powerup_lavaorb.png');
                // this.load.image('powerup:jumpboost', collectibles + 'powerup_jumpboost.png');
                // this.load.image('powerup:zhonyas', collectibles + 'powerup_zhonyas.png');}
            }
        }
        if (CONST_COINS) {
            if (CONST_COIN_ANIMATE) {
                this.load.spritesheet('coin', collectibles + 'coin_animated.png', 38, 38);
                this.load.spritesheet('icon:coin', collectibles + 'coin_animated.png', 38, 38);
            } else {
                this.load.image('coin', collectibles + 'coin_icon.png');
                this.load.image('icon:coin', collectibles + 'coin_icon.png');
            }
        }

        //
        //obstacles
        //
        if (CONST_SPIKES) {
            this.load.image('spikes:1x1', obstacles + 'spikes_1x1.png');
            this.load.image('spikesLeft:1x1', obstacles + 'spikesLeft_1x1.png');
            this.load.image('spikesRight:1x1', obstacles + 'spikesRight_1x1.png');
        }

        //
        //enemies
        //
        if (CONST_ENEMIES) {
            this.load.spritesheet('spider', enemies + 'spider2.png', 42, 30);
        }

        //
        //Cannons
        //
        if (CONST_CANNONS) {
            this.load.image('cannonLeft', cannons + 'cannonLeft.png');
            this.load.image('cannonRight', cannons + 'cannonRight.png');
        }

        //
        //deco
        //
        if (CONST_DECO) {
            this.load.image('deco:stone1_day', deco + 'deco_stone1_day.png');
            this.load.image('deco:stone2_day', deco + 'deco_stone2_day.png');
            this.load.image('deco:bush1_day', deco + 'deco_bush1_day.png');
            this.load.image('deco:bush2_day', deco + 'deco_bush2_day.png');
            this.load.image('deco:bush3_day', deco + 'deco_bush3_day.png');
            this.load.image('deco:tree1_day', deco + 'deco_tree1_day.png');

            this.load.image('deco:stone1_night', deco + 'deco_stone1_night.png');
            this.load.image('deco:stone2_night', deco + 'deco_stone2_night.png');
            this.load.image('deco:bush1_night', deco + 'deco_bush1_night.png');
            this.load.image('deco:bush2_night', deco + 'deco_bush2_night.png');
            this.load.image('deco:bush3_night', deco + 'deco_bush3_night.png');
            this.load.image('deco:tree1_night', deco + 'deco_tree1_night.png');
        }

        //
        //misc
        //
        if (CONST_BACKGROUNDIMAGE) {
            this.load.image('sky', misc + 'sky.png');
            this.load.image('hillsBack', misc + 'hillsBack.png');
            this.load.image('hillsMiddle', misc + 'hillsMiddle.png');
            this.load.image('hillsFore', misc + 'hillsFore.png');

            this.load.image('cloud1_night', misc + 'deco_night_cloud1.png');
            this.load.image('cloud2_night', misc + 'deco_night_cloud2.png');
            this.load.image('cloud3_night', misc + 'deco_night_cloud3.png');

            this.load.image('moon', misc + 'moon.png');

            if (CONST_DAY_AND_NIGHT) {
                this.load.image('sky_day', misc + 'sky_day.png');
                this.load.image('hillsBack_day', misc + 'hillsBack_day.png');
                this.load.image('hillsMiddle_day', misc + 'hillsMiddle_day.png');
                this.load.image('hillsFore_day', misc + 'hillsFore_day.png');

                this.load.image('cloud1_day', misc + 'deco_day_cloud1.png');
                this.load.image('cloud2_day', misc + 'deco_day_cloud2.png');
                this.load.image('cloud3_day', misc + 'deco_day_cloud3.png');

                this.load.image('sun', misc + 'sun.png');
            }
        }
        if (CONST_NEWFLAG) this.load.image('flag', misc + 'flag.png');
        else this.load.spritesheet('flag', misc + 'alt/flag.png', 42, 66);
        this.load.image('icon:heart', misc + 'heart.png');

        if (CONST_CRATES) this.load.image('crate', misc + 'crate.png');
        if (CONST_SHOOTING) this.load.image('bullet', misc + 'bullet.png');
        if (CONST_CANNONS) this.load.image('cannonball', misc + 'cannonball.png');

        if (CONST_MYSTERYBOX) this.load.spritesheet('mystery:questionmark', misc + 'mystery_questionmark.png', 42, 42);

        if (CONST_BUTTONS_AND_GATES) {
            this.load.spritesheet('button:red', misc + 'button_red.png', 42, 5);
            this.load.spritesheet('button:blue', misc + 'button_blue.png', 42, 5);
            this.load.spritesheet('button:green', misc + 'button_green.png', 42, 5);
            this.load.spritesheet('button:purple', misc + 'button_purple.png', 42, 5);
            this.load.spritesheet('button:yellow', misc + 'button_yellow.png', 42, 5);
            this.load.spritesheet('button:cyan', misc + 'button_cyan.png', 42, 5);

            this.load.spritesheet('gate:red', misc + 'gate_red.png', 42, 84);
            this.load.spritesheet('gate:blue', misc + 'gate_blue.png', 42, 84);
            this.load.spritesheet('gate:green', misc + 'gate_green.png', 42, 84);
            this.load.spritesheet('gate:purple', misc + 'gate_purple.png', 42, 84);
            this.load.spritesheet('gate:yellow', misc + 'gate_yellow.png', 42, 84);
            this.load.spritesheet('gate:cyan', misc + 'gate_cyan.png', 42, 84);
        }

        if (CONST_TELEPORTER) {
            this.load.spritesheet('teleporter:blue', teleporter + 'teleporter_blue.png', 42, 84);
        }

        //
        //audio
        //
        this.load.audio('sfx:jump', audio + 'jump.wav');
        this.load.audio('sfx:flag', audio + 'flag.wav');
        this.load.audio('sfx:explosion', audio + 'explosion.wav');
        if (CONST_COINS) this.load.audio('sfx:coin', audio + 'coin.wav');
        this.load.audio('sfx:levelup', audio + 'levelup.wav');
        if (CONST_POWERUPS) this.load.audio('sfx:powerup', audio + 'powerup.mp3');
        if (CONST_EASTEREGGS) this.load.audio('sfx:easteregg', audio + 'easteregg.wav');
        if (CONST_ENEMIES) this.load.audio('sfx:stomp', audio + 'stomp.wav');
        if (CONST_ZHONYA) this.load.audio('sfx:zhonya', audio + 'zhonya.wav');
        if (CONST_SHOOTING) this.load.audio('sfx:shoot', audio + 'shoot.mp3');
        if (CONST_CANNONS) this.load.audio('sfx:cannon_fire', audio + 'cannon_fire.wav');
        if (CONST_MAGAZINE > 0) this.load.audio('sfx:empty_magazine', audio + 'empty_magazine.wav');

        if (CONST_MYSTERYBOX) this.load.audio('sfx:mystery', audio + 'mystery.ogg');
        if (CONST_TELEPORTER) this.load.audio('sfx:teleport', audio + 'teleport.wav');

        if (CONST_BUTTONS_AND_GATES) {
            this.load.audio('sfx:open_gate', audio + 'open_gate.wav');
            this.load.audio('sfx:press_button', audio + 'press_button.wav');
            this.load.audio('sfx:spawn_platform', audio + 'spawn_platform.ogg');
        }

        if (CONST_LEVELMUSIC) {
            this.load.audio('sfx:levelmusic', audio + 'levelmusic.ogg');
            levelmusic = game.add.audio('sfx:levelmusic');
        }

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

            game.authenticated = true;
            if (game.gameInfoEasy == '' || game.gameInfoEasy == undefined) {
                game.authenticated = false;
                game.difficulty = DIFFICULTY.normal;
            }
            else {
                game.difficulty = account.difficulty;
                game.muted = account.muted;
                if (game.muted) this.game.sound.mute = true;

                if (account.uploaded_character != '' && account.uploaded_character != null) {
                    game.load.image(getFileName(account.uploaded_character), account.uploaded_character);
                    game.load.start();
                }
            }

            if (CONST_LEVELSELECTION || CONST_CHARACTERSELECTION) {
                this.state.start('Startmenu');
            } else {
                if (CONST_LEVELMUSIC) levelmusic.play();
                this.state.start('Game');
            }
        }
    }

};