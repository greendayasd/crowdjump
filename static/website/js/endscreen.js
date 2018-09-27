var Crowdjump = Crowdjump || {};

Crowdjump.Endscreen = function (game) {
    var replay;
    var score;
    var info;
    var bubble;
    var time_score;
    var old_time;
    var coin_text;
    var coin_icon;
};


Crowdjump.Endscreen.prototype = {

    create: function () {
        this.game.stage.backgroundColor = '#1948cd';
        var scoreText = '';


        if (CONST_TIME) {

            time_finished = parseFloat(game.time.totalElapsedSeconds().toFixed(3)) - first_moved;
            time_finished = parseFloat(time_finished.toFixed(3));
            time_score = parseFloat((parseFloat(time_overall) - (game.coinPickupCount * (CONST_COIN_TIME_REDUCTION / 1000))).toFixed(3));
            time_overall = 0;
        }

        old_time = -2;

        if (selected_level >= 0) {
            scoreText = "Congratulations, you beat level " + (selected_level + 1) + " in " + time_score + " seconds!";
        } else {
            if (game.authenticated) {
                if (game.gameInfo["highscore"] == null || game.gameInfo["highscore"] == 0 || game.gameInfo["highscore"] == NaN || isNaN(game.gameInfo["highscore"])) {
                    game.gameInfo["highscore"] = -1;
                }
                old_time = (game.gameInfo["highscore"] + 0);
            }
            // console.error("old_time " + old_time);
            // console.error("new_time " + time_score);
            var highscore_text = '\n';
            var isHighscore = false;
            if (true) {
                if (old_time == -2) {
                    highscore_text += 'Login to save your score!';
                }
                else if (old_time == -1) {
                    highscore_text += 'This is a new highscore!';
                    isHighscore = true;
                    game.gameInfo["highscore"] = time_score * 1000;
                } else {
                    if (old_time > time_score * 1000) {
                        highscore_text += 'This is a new highscore, your previous highscore was ' + (old_time / 1000) + ' seconds!';
                        isHighscore = true;
                        game.gameInfo["highscore"] = time_score * 1000;
                    } else {
                        highscore_text += 'Your highscore is ' + (old_time / 1000) + ' seconds!';
                    }
                }

            }

            scoreText = "Congratulations, you beat the game in " + time_score + " seconds!" + highscore_text;
        }
        score = this.add.text(CONST_WORLD_CENTER_X, 60, scoreText, {fill: '#dbdbdb', align: "center"});
        score.anchor.set(0.5);

        if (old_time == -2) {
            score.inputEnabled = true;
            score.events.onInputDown.add(this.login, this);
        }

        if (CONST_COINS) {
            coin_icon = this.add.image(850, 550, 'icon:coin');
            coin_icon.anchor.set(0.5);
            coin_text = this.add.text(892, 553, game.coinPickupCount, {fill: '#dbdbdb'});
            coin_text.anchor.set(0.5);

        }
        var additionalIdeaInfo = "Do you want to improve the game or the website?";
        info = this.add.text(CONST_WORLD_CENTER_X, 155, additionalIdeaInfo, {fill: '#dbdbdb'});
        info.anchor.set(0.5);

        if (CONST_BUBBLE) {
            bubble = this.add.sprite(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 10, 'bubble');
            bubble.anchor.set(0.5);
            bubble.inputEnabled = true;
            bubble.events.onInputDown.add(this.ideas, this);
        }

        replay = this.add.text(CONST_WORLD_CENTER_X,
            CONST_WORLD_CENTER_Y, 'Replay?', {fill: '#dbdbdb'});
        replay.anchor.set(0.5, -5);
        replay.inputEnabled = true;
        replay.events.onInputDown.add(this.replay, this);


        this.input.keyboard.addKey(Phaser.KeyCode.R).onUp.add(this.replay, this);
        this.input.keyboard.addKey(Phaser.KeyCode.ESC).onDown.add(backToMainMenu);


        setInfo(isHighscore);

    },

    replay: function () {
        //reset time
        this.game.time.reset();
        resetStats();
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
    if (selected_level >= 0) setLevelInfo(selected_level + 1, "completed_training", false);
    else {
        if (game.authenticated) {
            game.gameInfo["rounds_won"] = game.gameInfo["rounds_won"] + 1;
        }
        setLevelInfo(level + 1, "completed", isHighscore);
    }
    time_finished = 0;

}