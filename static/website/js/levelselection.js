var Crowdjump = Crowdjump || {};

Crowdjump.Levelselection = function(game){
    var text = [];
    var group;
};

Crowdjump.Levelselection.prototype = {
    create:function () {
        var rows = 4,
            columns = -1,
            border_horizontal = 170,
            border_vertical = 70;
        group = this.game.add.group();
        for (var i = 0; i< CONST_LEVEL;i++){
            text[i] = this.add.text(0, 0, "Level" + (i+1), {font:"35px Arial",fill: '#dbdbdb', backgroundColor:'#0d1b35'}, group);
            text[i].anchor.set(0.5);
            text[i].inputEnabled = true;
            text[i].level = i;
            text[i].events.onInputDown.add(this.startlevel,this)
        }
        if (false){
            var i = 4;
            text[i] = this.add.text(0, 0, "Level" + (i+1), {font:"35px Arial",fill: '#dbdbdb', backgroundColor:'#0d1b35'}, group);
            text[i].anchor.set(0.5);
            text[i].inputEnabled = true;
            text[i].level = i;
            text[i].events.onInputDown.add(this.startlevel,this)
        }
        //rows amount, column amount, width, height
        group.align(rows,columns,(CONST_CANVAS_X-(2*border_horizontal))/rows,70);
        group.x = border_horizontal;
        group.y = border_vertical;
        this.input.keyboard.addKey(Phaser.KeyCode.ESC).onDown.add(backToMainMenu);
    },

    startlevel: function (text) {
        selected_level = text.level;
        this.game.time.reset();
        game.state.start('Game');
    },

}