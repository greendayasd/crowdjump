var Crowdjump = Crowdjump || {};

Crowdjump.Credits = function (game) {
    var text = [];
    var backToMenu;
};

Crowdjump.Credits.prototype = {
    create: function () {
        audio = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y -200, "Levelmusic: Overgrown Labyrinth by Visager, licensed under a Attribution-ShareAlike License.\n" +
            "Buttonsound: Button_04 by distillerystudio, licensed under Attribution 3.0 Unported. \n" +
            "Gatesound: Chain_Door_Squeak_Open_001 by JoelAudio, licensed under Attribution 3.0 Unported. \n", {
            font: "20px Arial",
            fill: '#dbdbdb'
        });
        audio.anchor.set(0.5);

        backToMenu = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 220, "Back", {
            font: "40px Arial",
            fill: '#dbdbdb'
        });
        backToMenu.anchor.set(0.5);
        backToMenu.inputEnabled = true;
        backToMenu.events.onInputDown.add(backToMainMenu, this);
        this.input.keyboard.addKey(Phaser.KeyCode.ESC).onDown.add(backToMainMenu);
    },
}