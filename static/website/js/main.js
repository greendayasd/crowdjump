// Global Variables

const CONST_DOUBLE_JUMP = false;
const CONST_COINS = false;
const CONST_ENEMIES = true;
const CONST_ANIMATE_CHARACTER = true;
const CONST_TIME = true;
const CONST_BUBBLE = true;
const CONST_PAUSE = false;
const CONST_LEVEL = 4;
const CONST_ZHONYA = true;
const CONST_ZHONYA_DURATION = 2;
const CONST_ZHONYA_COOLDOWN = 4;
const CONST_SHOOTING = true;
const CONST_FIRERATE = 500;
const CONST_BULLETSPEED = 800;

var game;
var g_gameinfo = '';
var highscoreSocket;


function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

window.createGame = function (canvas, scope) {


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
        console.error('Chat socket closed unexpectedly');
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
        deaths: 0,
        restarts: 0,
        authenticated: true,
    }

    resetStats();
    game.csrftoken = getCookie('csrftoken');

    game.state.add('Boot', Crowdjump.Boot);
    game.state.add('Preloader', Crowdjump.Preloader);
    game.state.add('Startmenu', Crowdjump.Menu);
    game.state.add('Game', Crowdjump.Game);
    game.state.add('Endscreen', Crowdjump.Endscreen);
    game.state.start('Boot');

    return;
}


function getInfo() {

    var account = JSON.parse(getCookie('authenticatedAccount'));
    // console.error("account" + account);

    if (account == '' || account == null) {
        return '';
    }
    var username = account["username"];//'User3';
    // console.error(username);

    var version = '0.03';
    var path = '/api/v1/gameinfo/?format=json&user__username=' + username + '&version__label=' + version;
    // var path2 = '/api/v1/gameinfo/10/?format=json';
    jQuery.get(path, function (data) {
        g_gameinfo = data[0];
        // console.error("gameinfo " + g_gameinfo);
        // console.error("getinfo gameinfo : " + JSON.stringify(temp_gameinfo));
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

function resetStats() {

    game.coinPickupCount = 0;
    game.enemiesDefeatedCount = 0;
    game.timeElapsed = 0;
    game.jumps = 0;
    game.deaths = 0;
    game.restarts = 0;
}