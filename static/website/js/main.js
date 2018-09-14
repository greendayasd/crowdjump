// Global Variables

const CONST_JUMP_SPEED = 700; //~500 for long jump
const CONST_AIR_SPEED = 500;
const CONST_BOUNCE_SPEED = 200;
const CONST_GRAVITY = 1400;
const CONST_USE_ACCELERATION = false;
const CONST_ACCELERATION = 2000; //for slippery
const CONST_MAX_SPEED = 1000;
const CONST_MOVE_SPEED = 200;
const CONST_HERO_WEIGHT = 100;
const CONST_HERO_LIVES = 1;
const CONST_REPLAY_LEVEL = false;
const CONST_SAVE_LEVEL_TIME = false;

const CONST_LEVEL = 1;
const CONST_TIME = true;

const CONST_LAVA = false;
const CONST_LAVASWITCHINGPLATFORM = false;
const CONST_SLIPPERYPLATFORMS = false;
const CONST_MOVINGPLATFORMS = false;
const CONST_LOCKPLATFORM = false;
const CONST_BOUNCINGPLATFORMS = false;
const CONST_SLIDEPLATFORMS = false;
const CONST_FALLINGPLATFORMS = false;
const CONST_CONVEYORPLATFORMS = false;
const CONST_CRATES = false;

const CONST_POWERUPS = false;
const CONST_COINS = false;

const CONST_ENEMIES = false;
const CONST_KILL_ENEMIES = false;
const CONST_SPIDER_SPEED = 100;

const CONST_LEVELSELECTION = false;
const CONST_BUBBLE = true;
const CONST_PAUSE = false;

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

const CONST_SHOOTING = false;
const CONST_FIRERATE = 500;
const CONST_BULLETSPEED = 800;
const CONST_BULLETDROP = false;
const CONST_MAGAZINE = 10;
const CONST_SHOOT_IN_ZHONYA = false;

const CONST_ANIMATE_CHARACTER = false;
const CONST_COLOR = false;

const CONST_SHOWLEVEL = false;
const CONST_FPS = false;
const CONST_P2_PHYSICS = false;
const CONST_DEBUG = false;
const CONST_CHEAT = false;
const CONST_CANVAS_X = 960;
const CONST_CANVAS_Y = 600;
const CONST_WORLD_CENTER_X = CONST_CANVAS_X / 2;
const CONST_WORLD_CENTER_Y = CONST_CANVAS_Y / 2;

const CONST_WASD_CONTROLS = false;

var DIFFICULTY = Object.freeze({"easy":1, "normal":2, "hard":3})
var version = '';

var game;
var g_gameinfo = '';
var highscoreSocket;
var account;

//info from last level
var time_last_level = 0;
var jumps_last_level = 0;
var movementinputs_last_level = 0;
var enemies_last_level = 0;
var coins_last_level = 0;
var difficulty = DIFFICULTY.normal;
var selected_level = -1;

var time_finished = 0; //Synchronisation von DB und tracking

var time_overall = 0;
var time_last_level_or_restart = 0;

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

window.createGame = function (canvas, scope) {
    version = versionlabel;

    game = new Phaser.Game(CONST_CANVAS_X, CONST_CANVAS_Y, Phaser.AUTO, canvas);

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

    getInfo();

    scope.$on('$destroy', function () {
        game.destroy(); // Clean up the game when we leave this scope
    });

    //Highscore Socket
    // var ws_scheme = 'wss'; //.location.protocol == "https:" ? "wss" : "ws";
    // var port = ':8001';
    // if (window.location.host == "localhost:8000") {
    //     ws_scheme = 'ws';
    //     port = '';
    // }
    //
    // highscoreSocket = new WebSocket(
    //     ws_scheme + '://' + window.location.host + port +
    //     '/ws/website/');
    // highscoreSocket.onclose = function (e) {
    //     console.error('Highscore socket closed unexpectedly');
    // };


    scope.$on('game:toggleMusic', function () {
        Game.toggleMusic(); // some function that toggles the music
    });


    // game.world.setBounds(0,0,1500,600);

    game.global = {
        coinPickupCount: 0,
        enemiesDefeatedCount: 0,
        timeElapsed: 0,
        gameInfo: {},
        csrftoken: '',
        jumps: 0,
        movement_inputs: 0,
        deaths: 0,
        restarts: 0,
        authenticated: true,
    }

    resetStats();

    game.state.add('Boot', Crowdjump.Boot);
    game.state.add('Preloader', Crowdjump.Preloader);
    game.state.add('Startmenu', Crowdjump.Menu);
    game.state.add('Game', Crowdjump.Game);
    game.state.add('Endscreen', Crowdjump.Endscreen);
    game.state.add('Gameover', Crowdjump.Gameover);
    game.state.add('Levelselection', Crowdjump.Levelselection);
    game.state.start('Boot');

    return;
}


function getInfo() {

    account = JSON.parse(getAuthCookie('authenticatedAccount'));
    // console.error("account" + account);

    if (account == '' || account == null) {
        return '';
    }

    var username = account["username"];

    if (account["versionlabel"] != versionlabel) {
        console.log("increase versionlabel");
        increase_versionlabel(username, true);
    }


    var path = '/api/v1/gameinfo/?format=json&user__username=' + username + '&version__label=' + version;

    jQuery.get(path, function (data) {
        g_gameinfo = data[0];
    })
}


function updateInfo(isHighscore) {

    if (game.authenticated) {
        if (game.gameInfo["coins_collected"] == null || game.gameInfo["coins_collected"] == NaN || isNaN(game.gameInfo["coins_collected"])) {
            // console.error("coins");
            game.gameInfo["coins_collected"] = 0;

        }
        if (isNaN(game.gameInfo["enemies_killed"])) {
            game.gameInfo["enemies_killed"] = 0;
        }
        game.gameInfo["coins_collected"] = game.gameInfo["coins_collected"] + game.coinPickupCount;
        game.gameInfo["enemies_killed"] = game.gameInfo["enemies_killed"] + game.enemiesDefeatedCount;
        game.gameInfo["jumps"] = game.gameInfo["jumps"] + game.jumps;
        game.gameInfo["movement_inputs"] = game.gameInfo["movement_inputs"] + game.movement_inputs;
        game.gameInfo["deaths"] = game.gameInfo["deaths"] + game.deaths;
        game.gameInfo["restarts"] = game.gameInfo["restarts"] + game.restarts;

        game.gameInfo["time_spent_game"] = game.gameInfo["time_spent_game"] + (game.timeElapsed * 1000);

        // $.ajaxSetup({
        //     beforeSend: function (xhr, settings) {
        //         if (!csrfSafeMethod(settings.type)) {
        //             xhr.setRequestHeader("X-CSRFTOKEN", game.csrftoken);
        //         }
        //     }
        // });
        //
        // $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        //     jqXHR.setRequestHeader('X-CSRF-Token', game.csrftoken);
        // });

        // console.error(JSON.stringify(game.gameInfo));
        var ret = $.ajax({
            // type: 'POST',
            method: 'PATCH',
            url: '/api/v1/gameinfo/' + game.gameInfo["id"] + '/',
            data: JSON.stringify(game.gameInfo),
            dataType: 'json',
            processData: false,
            contentType: "application/json",
            cache: false,
            success: function (data) {
                if (isHighscore) {

                    var content = data;
                    // console.log(data);
                    content["type"] = 'highscore_broadcast';
                    highscoreSocket.send(JSON.stringify(content));
                    // console.log(JSON.stringify(content));


                }
            },
            error: function (xhr, status, error) {
                console.error('xhr ' + JSON.stringify(xhr) + '  Error ' + error);
            }
        });
        // console.error("return: " + ret);
    }

    resetStats();

}

function setLevelInfo(level, status) {
    var username = getUsername();
    var time = time_finished;
    var final_time = ((time - time_last_level) * 1000).toFixed(0);
    var data = {
        "username": username,
        "version": version,
        "level": level,
        "status": status,
        "time": final_time,
        "jumps": game.jumps - jumps_last_level,
        "movement_inputs": game.movement_inputs - movementinputs_last_level,
        "enemies_killed": game.enemiesDefeatedCount - enemies_last_level,
        "coins_collected": game.coinPickupCount - coins_last_level
    };

    $.ajax({
        url: '/sendgamedata/',
        cache: false,
        data: data,
        success: function (data) {
        },
        error: function (data) {
            console.log("time:" + time + ' . ' +  data);
        }
    });
}

function resetStats() {

    game.coinPickupCount = 0;
    game.enemiesDefeatedCount = 0;
    game.timeElapsed = 0;
    game.jumps = 0;
    game.movement_inputs = 0;
    game.deaths = 0;
    game.restarts = 0;
}

function increase_versionlabel(username, cookie_increase) {
    var data = {
        "rounds_started": 0,
        "rounds_won": 0,
        "enemies_killed": 0,
        "coins_collected": 0,
        "highscore": -1,
        "movement_inputs": 0,
        "jumps": 0,
        "deaths": 0,
        "restarts": 0,
        "time_spent_game": 0
    };

    $.ajax({
        url: '/api/v1/gameinfo/',
        type: 'POST',
        cache: false,
        data: JSON.stringify(data),
        dataType: 'json',
        processData: false,
        contentType: "application/json",
        success: function (data) {


            $.ajax({
                url: '/api/v1/accounts/' + username + '/',
                method: 'PATCH',
                cache: false,
                data: JSON.stringify({"versionlabel": versionlabel}),
                dataType: 'json',
                processData: false,
                contentType: "application/json",
                success: function (data) {

                    console.log("succ");
                    if (cookie_increase) {
                        account["versionlabel"] = versionlabel;
                        setCookie("authenticatedAccount", JSON.stringify(account), 365);
                    }
                },
                error: function (data) {
                    console.error(data);
                }
            });

        },
        error: function (data) {
            console.error(data);
        }
    });

}

function setInfoLastLevel (){
    time_last_level = game.time.totalElapsedSeconds().toFixed(3);
    jumps_last_level = game.jumps;
    movementinputs_last_level = game.movement_inputs;
    enemies_last_level = game.enemiesDefeatedCount;
    coins_last_level = game.coinPickupCount;

}

function backToMainMenu () {
    setLevelInfo(this.level + 1, "back to start menu");
    updateInfo(false);
    this.game.time.reset();
    this.game.state.start("Startmenu");
}