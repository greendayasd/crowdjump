var Crowdjump = Crowdjump || {};

Crowdjump.LevelSelection = function (game) {
    var text = [];
    var group;
};

Crowdjump.LevelSelection.prototype = {
    create: function () {
        var rows = 4,
            columns = -1,
            border_horizontal = 170,
            border_vertical = 70;
        group = this.game.add.group();

        for (var i = 0; i < game.highest_level; i++) {
            text[i] = this.add.text(0, 0, "Level" + (i + 1), {
                font: "35px Arial",
                fill: '#dbdbdb',
                backgroundColor: '#0d1b35'
            }, group);
            text[i].anchor.set(0.5);
            text[i].inputEnabled = true;
            text[i].level = i;
            text[i].events.onInputDown.add(this.startlevel, this)
        }
        if (false) {
            var i = 4;
            text[i] = this.add.text(0, 0, "Level" + (i + 1), {
                font: "35px Arial",
                fill: '#dbdbdb',
                backgroundColor: '#0d1b35'
            }, group);
            text[i].anchor.set(0.5);
            text[i].inputEnabled = true;
            text[i].level = i;
            text[i].events.onInputDown.add(this.startlevel, this)
        }
        //rows amount, column amount, width, height
        group.align(rows, columns, (CONST_CANVAS_X - (2 * border_horizontal)) / rows, 70);
        group.x = border_horizontal;
        group.y = border_vertical;
        this.input.keyboard.addKey(Phaser.KeyCode.ESC).onDown.add(backToMainMenu);

        key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        key1.level = 0;
        key1.onDown.add(this.startlevel, this);

        key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        key2.level = 1;
        key2.onDown.add(this.startlevel, this);

        key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        key3.level = 2;
        key3.onDown.add(this.startlevel, this);

        backToMenu = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 220, "Back", {
            font: "40px Arial",
            fill: '#dbdbdb'
        });
        backToMenu.anchor.set(0.5);
        backToMenu.inputEnabled = true;
        backToMenu.events.onInputDown.add(backToMainMenu, this);
        this.input.keyboard.addKey(Phaser.KeyCode.ESC).onDown.add(backToMainMenu);

    },

    startlevel: function (obj) {
        selected_level = obj.level;
        startGameRoutine();
    },
}