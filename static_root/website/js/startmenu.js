var Crowdjump = Crowdjump || {};

Crowdjump.Menu = function(game){
    var startGame;
    var logo;
    var instruction;
};

Crowdjump.Menu.prototype = {
    create:function () {
        this.game.stage.backgroundColor = '#1948cd';


        logo = this.add.sprite(this.world.centerX,
                               this.world.centerY -80, 'logo');
        logo.anchor.set(0.5);

        startGame = this.add.sprite(this.world.centerX,
                               this.world.centerY + 40, 'play');
        startGame.anchor.set(0.5);
        startGame.inputEnabled = true;
        startGame.events.onInputDown.add(this.phasergame,this)

        var instructionText = "The goal is simple: Control the alien by using the arrow keys \n" +
            "to move (or space to jump) to get to the flag.\n" +
            "If you get stuck, you can reset the game pressing R.";

        instruction = this.add.text(this.world.centerX,
                                this.world.centerY + 160, instructionText, {fill: '#ffffff'});
        instruction.anchor.set(0.5);
    },

    phasergame: function () {

        game.state.start('Game');
    },

    endscreen: function (){

    }
}