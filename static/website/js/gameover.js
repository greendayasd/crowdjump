var Crowdjump = Crowdjump || {};

Crowdjump.Gameover = function (game) {
    var replay;
    var info;
    var death;
};


Crowdjump.Gameover.prototype = {

    create: function () {
        this.game.camera.reset();

        info = this.add.text(this.world.centerX, 155, "You died!", {font:"50px Arial",fill: '#dbdbdb'});
        info.anchor.set(0.5);

        death = this.add.sprite(this.world.centerX, this.world.centerY + 10, 'alien_death');
        death.anchor.set(0.5);

        replay = this.add.text(this.world.centerX,
            this.world.centerY -40, 'Try again?', {font:"35px Arial", fill: '#dbdbdb'});
        replay.anchor.set(0.5, -5);
        replay.inputEnabled = true;
        replay.events.onInputDown.add(this.replay, this);


        this.input.keyboard.addKey(Phaser.KeyCode.R).onUp.add(this.replay, this);
        // console.error("Gameinfo!: " + gameinfo);


    },

    replay: function () {
        //reset time
        this.game.time.reset();
        this.state.start('Game');
    },

}

