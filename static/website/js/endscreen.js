var Crowdjump = Crowdjump || {};

Crowdjump.Endscreen = function (game) {
    var replay;
    var score;
    var info;
    var bubble;
};



Crowdjump.Endscreen.prototype = {
    create: function () {
        if (CONST_TIME) {
            var scoreText = "Congratulations, you beat the level in " + game.timeElapsed + " seconds!";
            score = this.add.text(this.world.centerX, 40, scoreText);
            score.anchor.set(0.5);
        }


        if (CONST_BUBBLE) {
            bubble = this.add.sprite(this.world.centerX, this.world.centerY, 'bubble');
            bubble.anchor.set(0.5);
            bubble.inputEnabled = true;
            bubble.events.onInputDown.add(this.ideas, this);
        }

        replay = this.add.text(this.world.centerX,
            this.world.centerY, 'Replay?', {fill: '#000000'});
        replay.anchor.set(0.5, -5);
        replay.inputEnabled = true;
        replay.events.onInputDown.add(this.replay, this);


        this.input.keyboard.addKey(Phaser.KeyCode.R).onUp.add(this.replay, this);
    console.error("Gameinfo!: " + Crowdjump.gameinfo);

    },

    replay: function () {
        //reset time
        this.game.time.reset();
        this.state.start('Game');
    },

    ideas: function () {

        // setInfo();
        //
        // updateInfo();
        window.location.href = '/ideas';

    },

}

function setInfo(){
        var old_time = 0;
        console.error("highscore: " + this.gameinfo["highscore"]);
        old_time += this.gameinfo["highscore"];
        console.error(this.gameinfo["highscore"]);

        var new_besttime = Math.min(old_time,game.timeElapsed);
        this.gameinfo["highscore"] = new_besttime;

        var rounds_won = this.gameinfo["rounds_won"] + 1;
        this.gameinfo["rounds_won"] = rounds_won + 1;

        console.error("endscreen info: " + JSON.stringify(this.gameinfo));
}
