// Global Variables

const CONST_JUMP_SPEED = 700;
const CONST_AIR_SPEED = 500;
const CONST_BOUNCE_SPEED = 200;
const CONST_GRAVITY = 1400;
const CONST_MOVE_SPEED = 200;

const CONST_DOUBLE_JUMP = false;
const CONST_COINS = false;
const CONST_ENEMIES = false;
const CONST_ANIMATE_CHARACTER = false;
const CONST_TIME = true;
const CONST_BUBBLE = true;
const CONST_PAUSE = false;
const CONST_LEVEL = 1;
const CONST_ZHONYA = false;
const CONST_KILL_IN_ZHONYA = false;
const CONST_ZHONYA_DURATION = 2;
const CONST_ZHONYA_COOLDOWN = 4;
const CONST_SHOOTING = false;
const CONST_FIRERATE = 500;
const CONST_BULLETSPEED = 800;
const CONST_BULLETDROP = false;
const CONST_SHOOT_IN_ZHONYA = false;
const CONST_LAVA = false;

var version = '';

var game;
var g_gameinfo = '';
var highscoreSocket;


function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

window.createGame = function (canvas, scope) {
    version = versionlabel;

    scope.$on('$destroy', function () {
        game.destroy(); // Clean up the game when we leave this scope
    });

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


    getInfo();

    scope.$on('game:toggleMusic', function () {
        Game.toggleMusic(); // some function that toggles the music
    });


    game = new Phaser.Game(960, 600, Phaser.AUTO, canvas);
    // game.world.setBounds(0,0,1500,600);

    game.global = {
        coinPickupCount: 0,
        enemiesDefeatedCount: 0,
        timeElapsed: 0,
        gameInfo: {},
        csrftoken: '',
        jumps: 0,
        movement_inputs:0,
        deaths: 0,
        restarts: 0,
        authenticated: true,
    }

    resetStats();
    game.csrftoken = getAuthCookie('csrftoken');

    game.state.add('Boot', Crowdjump.Boot);
    game.state.add('Preloader', Crowdjump.Preloader);
    game.state.add('Startmenu', Crowdjump.Menu);
    game.state.add('Game', Crowdjump.Game);
    game.state.add('Endscreen', Crowdjump.Endscreen);
    game.state.add('Gameover', Crowdjump.Gameover);
    game.state.start('Boot');

    return;
}


function getInfo() {

    var account = JSON.parse(getAuthCookie('authenticatedAccount'));
    // console.error("account" + account);

    if (account == '' || account == null) {
        return '';
    }
    var username = account["username"];

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

        game.gameInfo["time_spent_game"] = game.gameInfo["time_spent_game"] + (game.timeElapsed.toFixed(3) * 1000);

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

        // console.error(JSON.stringify(game.gameInfo));
        var ret = $.ajax({
            // type: 'POST',
            method: 'PATCH',
            url: '/api/v1/gameinfo/' + game.gameInfo["id"] + '/',
            data: JSON.stringify(game.gameInfo),
            dataType: 'json',
            processData: false,
            contentType: "application/json",
            success: function (data) {
                if (isHighscore || true) {

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

function setLevelInfo(level,status) {
    var username = getUsername();
    var data = {
        "username": username,
        "version": version,
        "level": level,
        "status": status,
        "time": (game.timeElapsed.toFixed(3) * 1000),
        "jumps": game.jumps,
        "movement_inputs": game.movement_inputs,
        "enemies_killed": game.enemiesDefeatedCount,
        "coins_collected": game.coinPickupCount
    };

    $.ajax({
        url: '/sendgamedata/',
        data: data,
        success: function (data) {
        },
        error: function (data) {
        }
    });
}

function resetStats() {

    game.coinPickupCount = 0;
    game.enemiesDefeatedCount = 0;
    game.timeElapsed = 0;
    game.jumps = 0;
    game.movement_inputs = 0,
    game.deaths = 0;
    game.restarts = 0;
}