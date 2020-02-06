// Global Variables

const CONST_JUMP_SPEED = 700; //~500 for long jump
const CONST_AIR_SPEED = 500;
const CONST_BOUNCE_SPEED = 200;
const CONST_GRAVITY = 1400;
const CONST_USE_ACCELERATION = false;
const CONST_ACCELERATION = 2000; //for slippery
const CONST_MAX_SPEED = 1000;
const CONST_MOVE_SPEED = 200; //200 normal
const CONST_HERO_WEIGHT = 100;
const CONST_MORE_LIVES = false; //v23
const CONST_HERO_LIVES = 3; //v23
const CONST_REPLAY_LEVEL = false;
const CONST_SAVE_LEVEL_TIME = false;

const CONST_TIME = true;
const CONST_TIME_WHEN_MOVED = true; //v2

const CONST_LAVA = false; //v8
const CONST_SPIKES = false; //v8
const CONST_SAWBLADES = false;
const CONST_LAVASWITCHINGPLATFORM = false;
const CONST_SLIPPERYPLATFORMS = false;
const CONST_MOVINGPLATFORMS = false;
const CONST_LOCKPLATFORM = false;
const CONST_BOUNCINGPLATFORMS = false;
const CONST_SLIDEPLATFORMS = false;
const CONST_FALLINGPLATFORMS = false;
const CONST_CONVEYORPLATFORMS = false;

const CONST_COINS = false; //v5
const CONST_COIN_TIME_REDUCTION = 500; //ms
const CONST_COIN_SHOW_TIMEREDUCTION = false; //v13
const CONST_COIN_ANIMATE = false; //v24


const CONST_CRATES = false;
const CONST_BUTTONS_AND_GATES = false; //v21
const CONST_MYSTERYBOX = false; //v38

const CONST_ENEMIES = true; //v12
const CONST_KILL_ENEMIES = true;
const CONST_SPIDER_SPEED = 100;
const CONST_SPIDER_COINS = 1; //v28

//Eastereggs v4
const CONST_EASTEREGGS                  = false;
const CONST_EASTEREGGS_MONEY_COINAMOUNT = 10;   //coin drop amount
const CONST_EASTEREGGS_TIME_TIMESECONDS = 5;    //time reduction in seconds
const CONST_EASTEREGGS_MOVEMENTSPEED    = 100;  //ms increase in px per second

//Powerups v9
const CONST_POWERUPS                    = false;
const CONST_POWERUPS_JUMPBOOST          = 1.4;  //height multiplier
const CONST_POWERUPS_PERMJUMPBOOST      = 1.25; //height multiplier

//Cannons v20
const CONST_CANNONS                     = false;
const CONST_CANNON_DEFAULT_FIRERATE     = 3000; //in ms
const CONST_CANNON_DEFAULT_BULLETSPEED  = 300;  //px per second

//Timeslow v25
const CONST_POWERUPS_V25                = false;
const CONST_POWERUPS_TIMESLOW           = 0.5;  //time multiplier

//Teleporter v41
const CONST_TELEPORTER                  = false;


const CONST_WALK = false;
const CONST_SPRINT = false;

const CONST_DOUBLE_JUMP = false;
const CONST_WALL_JUMP = false;
const CONST_LONG_JUMP = false; //Jump Speed -> 500
const CONST_MAX_LONG_JUMP = 15;
const CONST_ZHONYA = false;
const CONST_KILL_IN_ZHONYA = false;
const CONST_ZHONYA_DURATION = 2;
const CONST_ZHONYA_COOLDOWN = 4;


const CONST_ANIMATE_CHARACTER = false;
const CONST_ANIMATE_CONVEYOR = false;
const CONST_ANIMATE_LAVA = false; //v34
const CONST_ANIMATE_TELEPORTER = false; //v41
const CONST_ANIMATE_POWERUPS = false; //v42

const CONST_COLOR = false;
const CONST_BACKGROUNDIMAGE = false; //v16
const CONST_DECO = false; //v27
const CONST_DAY_AND_NIGHT = false; //v29
const CONST_NEW_BLOCKS = false; //v35
const CONST_NEWFLAG = false; //v40

const CONST_WASD_CONTROLS = false; //v14
const CONST_CONTROLLER = false;
const CONST_CONTROLLER_PRESSDURATION = 25; //ms in which button presses are registered, has to be small to avoid multiple activations

const CONST_BUBBLE = false;

const CONST_SHOOTING = false;
const CONST_FIRERATE = 500;
const CONST_BULLETSPEED = 800;
const CONST_BULLETDROP = false;
const CONST_MAGAZINE = 10;
const CONST_SHOOT_IN_ZHONYA = false;

const CONST_SHOWLEVEL = false;
const CONST_FPS = true;
const CONST_P2_PHYSICS = false;
const CONST_DEBUG = false;
const CONST_CHEAT = true;
const CONST_PAUSE = false;
const CONST_MUTE = false; //v6
const CONST_LEVELMUSIC = false; //v15
const CONST_BACKBUTTON = false; //v36

const CONST_LEVELSELECTION = false; //v26
const CONST_PLAY_REACHED_LEVEL = false; //you don't have to beat a level to practice it //v37

const CONST_CHARACTERSELECTION = false; //v7
const CONST_CHARACTER_COUNT = 4; //v7
const CONST_CREDITS = false; //v15 mit Backgroundmusic
const CONST_OPTIONMENU = false; //v32

const CONST_CANVAS_X = 960;
const CONST_CANVAS_Y = 600;
const CONST_WORLD_CENTER_X = CONST_CANVAS_X / 2;
const CONST_WORLD_CENTER_Y = CONST_CANVAS_Y / 2;
const CONST_LEVEL = 1; //v17 -> 3 //v31 -> 5

const NUMBERS_STR = '0123456789X -';

const CONST_MULTIPLE_DIFFICULTIES = false; //v32
const CONST_DIFFICULTIES = 3; //v32
var DIFFICULTY = Object.freeze({"easy": 0, "normal": 1, "hard": 2})
var version = '';

var game;
var highscoreSocket;
var account;

//controller
var jumpButton = null;


//info from last level
var time_last_level = 0;
var jumps_last_level = 0;
var movementinputs_last_level = 0;
var enemies_last_level = 0;
var coins_last_level = 0;
var eastereggs_last_level = 0;
var powerups_last_level = 0;
var specialname_last_level = 0;

var selected_level = -1;

var time_finished = 0; //Synchronisation von DB und tracking

var time_overall = 0;
var time_last_level_or_restart = 0;
var music;
var pad1;

const fontColor = '#dbdbdb';
const fontBackgroundColor = '#121835';
const fontColorSelected = '#000000';
const fontBackGroundColorSelected = '#3692ff';


function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

window.createGame = function (canvas, scope) {
    version = versionlabel;

    game = new Phaser.Game(CONST_CANVAS_X, CONST_CANVAS_Y, Phaser.CANVAS, canvas);
    game.global = {
        coinPickupCount: 0,
        powerupPickupCount: 0,
        eastereggPickupCount: 0,
        highest_level: 0,
        character: 0,
        difficulty: DIFFICULTY.normal,
        muted: 0,
        specialName: 0,
        enemiesDefeatedCount: 0,
        timeElapsed: 0,
        gameInfoEasy: {},
        gameInfoNormal: {},
        gameInfoHard: {},
        csrftoken: '',
        jumps: 0,
        movement_inputs: 0,
        deaths: 0,
        restarts: 0,
        authenticated: true
    };
    game.csrftoken = getAuthCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFTOKEN", game.csrftoken);
            }
        }
    });

    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        jqXHR.setRequestHeader('X-CSRF-Token', game.csrftoken);
    });


    account = JSON.parse(getAuthCookie('authenticatedAccount'));
    // console.error("account" + account);

    if (account == '' || account == null || account == undefined) {
        console.log("account not found");
        game.character = 'c' + 0;
        game.highest_level = 0;
        loadStates();
        return '';
    }
    game.character = account.character;

    var username = account["username"];

    if (account["versionlabel"] != "versionlabel") {
        increase_versionlabel(username, true);
    } else {
    }


    var path = '/api/v1/gameinfo/?format=json&user__username=' + username + '&version__label=' + version;

    loadStatesWithoutStart();

    jQuery.get(path, function (data) {

        if (data == undefined || data.length == 0){
            //just created
            window.location.href = '/game';

        } else {

            //random order
            switch (data[0].difficulty) {
                case DIFFICULTY.easy:
                    game.gameInfoEasy = data[0];
                    break;
                case DIFFICULTY.normal:
                    game.gameInfoNormal = data[0];
                    break;
                case DIFFICULTY.hard:
                    game.gameInfoHard = data[0];
                    break;
            }
            switch (data[1].difficulty) {
                case DIFFICULTY.easy:
                    game.gameInfoEasy = data[1];
                    break;
                case DIFFICULTY.normal:
                    game.gameInfoNormal = data[1];
                    break;
                case DIFFICULTY.hard:
                    game.gameInfoHard = data[1];
                    break;
            }
            switch (data[2].difficulty) {
                case DIFFICULTY.easy:
                    game.gameInfoEasy = data[2];
                    break;
                case DIFFICULTY.normal:
                    game.gameInfoNormal = data[2];
                    break;
                case DIFFICULTY.hard:
                    game.gameInfoHard = data[2];
                    break;
            }

            game.highest_level = Math.max(game.gameInfoEasy.highest_level, game.gameInfoNormal.highest_level, game.gameInfoHard.highest_level);
            game.state.start('Boot');
        }
    });


    scope.$on('$destroy', function () {
        game.destroy(); // Clean up the game when we leave this scope
    });

    //Highscore Socket
    var ws_scheme = 'wss'; //.location.protocol == "https:" ? "wss" : "ws";
    var port = ':8001';
    if (window.location.host == "localhost:8000") {
        ws_scheme = 'ws';
        port = '';
    }

    highscoreSocket = new WebSocket(
        ws_scheme + '://' + window.location.host + port +
        '/ws/website/');
    highscoreSocket.onclose = function (e) {
        console.error('Highscore socket closed unexpectedly');
    };


    // scope.$on('game:toggleMusic', function () {
    //     Game.toggleMusic(); // some function that toggles the music
    // });
}


function setLevelInfo(level, status, isHighscore, dontResetFirstMoved) {
    var username = getUsername();
    var time = time_finished;
    var final_time = ((time - time_last_level) * 1000).toFixed(0);

    var data = {
        "username": username,
        "version": version,
        "level": level,
        "status": status,
        "difficulty": game.difficulty,
        "muted": game.muted,
        "time": final_time,
        "jumps": game.jumps - jumps_last_level,
        "movement_inputs": game.movement_inputs - movementinputs_last_level,
        "enemies_killed": game.enemiesDefeatedCount - enemies_last_level,
        "coins_collected": game.coinPickupCount - coins_last_level,
        "overall_coins": game.coinPickupCount,
        "eastereggs_found": game.eastereggPickupCount - eastereggs_last_level,
        "overall_eastereggs": game.eastereggPickupCount,
        "powerups": game.powerupPickupCount - powerups_last_level,
        "overall_powerups": game.powerupPickupCount,
        "special_name": game.specialName - specialname_last_level,
        "overall_special_name": game.specialName,
        "character": game.character
    };

    // isHighscore = true;
    if (isHighscore) {

        switch (game.difficulty) {
            case DIFFICULTY.easy:
                data['highscore'] = game.gameInfoEasy["highscore"];
                break;
            case DIFFICULTY.normal:
                data['highscore'] = game.gameInfoNormal["highscore"];
                break;
            case DIFFICULTY.hard:
                data['highscore'] = game.gameInfoHard["highscore"];
                break;
        }
        resetStats();
    }

    $.ajax({
        url: '/sendgamedata/',
        cache: false,
        data: data,
        success: function (data_new) {
            if (isHighscore) {
                data["type"] = 'highscore_broadcast';
                highscoreSocket.send(JSON.stringify(data));
            }
        },
        error: function (data) {
            // console.log("time:" + time + ' . ' + data);
        }
    });

    if (level >= CONST_LEVEL && !dontResetFirstMoved) {
        //reset after setLevelInfo
        first_moved = 0;
        time_finished = 0;

    }
}

function resetStats() {

    game.coinPickupCount = 0;
    game.powerupPickupCount = 0;
    game.eastereggPickupCount = 0;
    game.enemiesDefeatedCount = 0;
    game.timeElapsed = 0;
    game.jumps = 0;
    game.movement_inputs = 0;
    game.deaths = 0;
    game.restarts = 0;
    game.specialName = 0;
}

function increase_versionlabel(cookie_increase) {
    var data = [];

    $.ajax({
        url: '/createGamedata/',
        data: data,
        success: function (data) {
            if (cookie_increase) {
                account["versionlabel"] = versionlabel;
                setCookie("authenticatedAccount", JSON.stringify(account), 365);
            }
        },
        error: function (data) {
            log("error increase versionLabel", data);
        }
    });
}

function changeCharacter() {
    var data = {
        "character": game.character
    };

    $.ajax({
        url: '/changeCharacter/',
        data: data,
        success: function (data) {
            account["character"] = game.character;
            setCookie("authenticatedAccount", JSON.stringify(account), 365);
        },
        error: function (data) {
            log("error change Character", data);
        }
    });
}

function changeDifficulty() {
    var data = {
        "difficulty": game.difficulty
    };

    $.ajax({
        url: '/changeDifficulty/',
        data: data,
        success: function (data) {
            account["difficulty"] = game.difficulty;
            setCookie("authenticatedAccount", JSON.stringify(account), 365);
        },
        error: function (data) {
            log("error change Difficulty", data);
        }
    });
}

function changeMuted() {
    var data;

    if (game.muted) {
        data = {
            "muted": 1
        };
    } else{
        data = {
            "muted": 0
        };

    }
    $.ajax({
        url: '/changeMuted/',
        data: data,
        success: function (data) {
            account["muted"] = game.muted;
            setCookie("authenticatedAccount", JSON.stringify(account), 365);
        },
        error: function (data) {
            log("error change Muted", data);
        }
    });
}

function setInfoLastLevel() {
    time_last_level = game.time.totalElapsedSeconds().toFixed(3);
    jumps_last_level = game.jumps;
    movementinputs_last_level = game.movement_inputs;
    enemies_last_level = game.enemiesDefeatedCount;
    coins_last_level = game.coinPickupCount;
    eastereggs_last_level = game.eastereggPickupCount;
    powerups_last_level = game.powerupPickupCount;
    specialname_last_level = game.specialName;

}

function startGameRoutine() {
    this.game.time.reset();
    last_second = 0;
    first_moved = 0;
    time_finished = 0;
    time_overall = 0;
    time_last_level_or_restart = 0;
    resetStats();
    levelmusic.play();
    game.state.start('Game');
}

function backToMainMenu() {
    if (game.state.current == "Game") {
        time_finished = game.time.totalElapsedSeconds() - first_moved;
        time_finished = parseFloat(time_finished.toFixed(3));
        Crowdjump.Game.lives = CONST_HERO_LIVES;
        setLevelInfo(this.level + 1, "back to start menu");
        if (first_moved == 0) time_finished = 0;
    }
    // if (game.state.current != "Endscreen")

    // updateInfo(false);
    this.game.time.reset();
    try {
        levelmusic.pause();
    }
    catch (e) {

    }
    this.game.state.start("Startmenu");
}

function loadStates() {
    resetStats();

    game.state.add('Boot', Crowdjump.Boot);
    game.state.add('Preloader', Crowdjump.Preloader);
    game.state.add('Startmenu', Crowdjump.Menu);
    game.state.add('Game', Crowdjump.Game);
    game.state.add('Endscreen', Crowdjump.Endscreen);
    game.state.add('Gameover', Crowdjump.Gameover);
    game.state.add('LevelSelection', Crowdjump.LevelSelection);
    game.state.add('CharacterSelection', Crowdjump.CharacterSelection);
    game.state.add('Credits', Crowdjump.Credits);
    game.state.add('Options', Crowdjump.Options);
    if (CONST_CONTROLLER) {
        game.input.gamepad.start();
        pad1 = game.input.gamepad.pad1;
    }
    game.state.start('Boot');
}

function loadStatesWithoutStart() {
    resetStats();

    game.state.add('Boot', Crowdjump.Boot);
    game.state.add('Preloader', Crowdjump.Preloader);
    game.state.add('Startmenu', Crowdjump.Menu);
    game.state.add('Game', Crowdjump.Game);
    game.state.add('Endscreen', Crowdjump.Endscreen);
    game.state.add('Gameover', Crowdjump.Gameover);
    game.state.add('LevelSelection', Crowdjump.LevelSelection);
    game.state.add('CharacterSelection', Crowdjump.CharacterSelection);
    game.state.add('Credits', Crowdjump.Credits);
    game.state.add('Options', Crowdjump.Options);
    if (CONST_CONTROLLER) {
        game.input.gamepad.start();
        pad1 = game.input.gamepad.pad1;
    }
}


function getFileName(filename) {
    return (/[/]/.exec(filename)) ? /[^/]+$/.exec(filename)[0] : undefined;
}