// Global Variables

    const CONST_DOUBLE_JUMP = false;
    const CONST_COINS = false;
    const CONST_ENEMIES = false;
    const CONST_ANIMATE_CHARACTER = false;
    const CONST_TIME = false;
    const CONST_BUBBLE = true;
    const CONST_PAUSE = false;
    const CONST_LEVEL = 1;

    var game;

window.createGame = function (canvas, scope) {
    scope.$on('$destroy', function () {
        game.destroy(); // Clean up the game when we leave this scope
    });

    scope.$on('game:toggleMusic', function () {
        Game.toggleMusic(); // some function that toggles the music
    });


    game = new Phaser.Game(960, 600, Phaser.AUTO, canvas);

    game.global = {
        coinPickupCount: 0,
        timeElapsed: 0

    }


    game.state.add('Boot', Crowdjump.Boot);
    game.state.add('Preloader', Crowdjump.Preloader);
    game.state.add('Startmenu', Crowdjump.Menu);
    game.state.add('Game', Crowdjump.Game);
    game.state.add('Endscreen', Crowdjump.Endscreen);
    game.state.start('Boot');

    return
}