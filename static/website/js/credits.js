var Crowdjump = Crowdjump || {};

Crowdjump.Credits = function (game) {
    var text = [];
    var backToMenu;
};

Crowdjump.Credits.prototype = {
    create: function () {
        levelmusic = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y -200, "Levelmusic: Overgrown Lavyrinth by Visager, licensed under a Attribution-ShareAlike License. ", {
            font: "20px Arial",
            fill: '#dbdbdb'
        });
        levelmusic.anchor.set(0.5);

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