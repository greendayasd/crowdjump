var Crowdjump = Crowdjump || {};

Crowdjump.Endscreen = function (game) {
    var replay;
    var score;
    var info;
    var bubble;
    var time_score;
    var old_time;
};


Crowdjump.Endscreen.prototype = {
    create: function () {
        if (CONST_TIME) {
            time_score = game.timeElapsed.toFixed(3);
            // console.error("gameinfo 0: " + JSON.stringify(game.gameInfo));
            // console.error(game.gameInfo["highscore"]);
            // console.error(game.gameInfo["highscore"] + 0);
        }
        old_time = -2;

        if (game.authenticated) {
            if (game.gameInfo["highscore"] == null || game.gameInfo["highscore"] == 0 || game.gameInfo["highscore"] == NaN || isNaN(game.gameInfo["highscore"])) {
                game.gameInfo["highscore"] = -1;
            }
            old_time = (game.gameInfo["highscore"] + 0);
        }
        // console.error("old_time " + old_time);
        // console.error("new_time " + time_score);
        var highscore_text = '';
        var isHighscore = false;
        if (old_time == -2) {
            highscore_text = 'Login to save your score!';
        }
        else if (old_time == -1) {
            highscore_text = 'This is a new highscore!';
            isHighscore = true;
            game.gameInfo["highscore"] = time_score * 1000;
        } else {
            // old_time = old_time / 1000;
            if (old_time > time_score * 1000) {
                highscore_text = 'This is a new highscore, your previous highscore was ' + (old_time / 1000) + ' seconds!';
                isHighscore = true;
                game.gameInfo["highscore"] = time_score * 1000;
            } else {
                highscore_text = 'Your highscore is ' + (old_time / 1000) + ' seconds!';
            }
        }
        var scoreText = "Congratulations, you beat the level in " + time_score + " seconds! \n" + highscore_text;
        score = this.add.text(this.world.centerX, 60, scoreText, {fill: '#dbdbdb'});
        score.anchor.set(0.5);

        if (old_time == -2) {
            score.inputEnabled = true;
            score.events.onInputDown.add(this.login, this);
        }

        if (CONST_BUBBLE) {
            bubble = this.add.sprite(this.world.centerX, this.world.centerY, 'bubble');
            bubble.anchor.set(0.5);
            bubble.inputEnabled = true;
            bubble.events.onInputDown.add(this.ideas, this);
        }

        replay = this.add.text(this.world.centerX,
            this.world.centerY, 'Replay?', {fill: '#dbdbdb'});
        replay.anchor.set(0.5, -5);
        replay.inputEnabled = true;
        replay.events.onInputDown.add(this.replay, this);


        this.input.keyboard.addKey(Phaser.KeyCode.R).onUp.add(this.replay, this);
        // console.error("Gameinfo!: " + gameinfo);


        setInfo(isHighscore);

    },

    replay: function () {
        //reset time
        this.game.time.reset();
        this.state.start('Game');
    },

    ideas: function () {
        window.location.href = '/ideas';
    },

    login: function () {
        window.location.href = '/login';
    },

}

function setInfo(isHighscore) {
    if (game.authenticated) {
        game.gameInfo["rounds_won"] = game.gameInfo["rounds_won"] + 1;
    }

    updateInfo(isHighscore);
}
