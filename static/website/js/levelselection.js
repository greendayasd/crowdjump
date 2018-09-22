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
        for (var i = 0; i < CONST_LEVEL; i++) {
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
        key1.onDown.add(this.startlevelKey1, this);

        key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        key2.onDown.add(this.startlevelKey2, this);

        key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        key3.onDown.add(this.startlevelKey3, this);

        key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        key4.onDown.add(this.startlevelKey4, this);
    },

    startlevel: function (text) {
        selected_level = text.level;
        this.startGameRoutine();
    },

    startlevelKey: function (i) {
        selected_level = i;
        this.startGameRoutine();
    },
    startlevelKey1: function () {
        this.startlevelKey(0);
    },
    startlevelKey2: function () {
        this.startlevelKey(1);
    },
    startlevelKey3: function () {
        this.startlevelKey(2);
    },
    startlevelKey4: function () {
        this.startlevelKey(3);
    },
}