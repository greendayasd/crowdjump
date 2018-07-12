var Crowdjump = Crowdjump || {};

Crowdjump.Gameover = function (game) {
    var replay;
    var info;
    var death;
};


Crowdjump.Gameover.prototype = {

    create: function () {
        this.game.stage.backgroundColor = '#1948cd';

        info = this.add.text(CONST_WORLD_CENTER_X, 155, "You died!", {font:"50px Arial",fill: '#dbdbdb'});
        info.anchor.set(0.5);
        info.fixedToCamera = true;

        death = this.add.sprite(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 10, 'alien_death');
        death.anchor.set(0.5);
        death.fixedToCamera = true;

        replay = this.add.text(CONST_WORLD_CENTER_X,
            CONST_WORLD_CENTER_Y -40, 'Try again?', {font:"35px Arial", fill: '#dbdbdb'});
        replay.anchor.set(0.5, -5);
        replay.inputEnabled = true;
        replay.events.onInputDown.add(this.replay, this);
        replay.fixedToCamera = true;


        this.input.keyboard.addKey(Phaser.KeyCode.R).onUp.add(this.replay, this);
        // console.error("Gameinfo!: " + gameinfo);


    },

    replay: function () {
        //reset time
        this.game.time.reset();
        this.state.start('Game');
    },

}

