var Crowdjump = Crowdjump || {};

Crowdjump.LevelSelection = function (game) {
    var texts = [];
    var keys = [];
    var group;
};

Crowdjump.LevelSelection.prototype = {
    create: function () {
        var rows = 4,
            columns = -1,
            border_horizontal = 170,
            border_vertical = 70;
        group = this.game.add.group();
        texts = [];
        keys = [];

        for (var i = 0; i < game.highest_level; i++) {
            texts[i] = this.add.text(0, 0, "Level" + (i + 1), {
                font: "35px Arial",
                fill: '#dbdbdb',
                backgroundColor: '#0d1b35'
            }, group);
            texts[i].anchor.set(0.5);
            texts[i].inputEnabled = true;
            texts[i].level = i;
            texts[i].events.onInputDown.add(this.startlevel, this)

            if (i < 10){
                var keycode = i + '';
                var key = game.input.keyboard.addKey(keycode.charCodeAt(0));
                key.level = i;
                key.onDown.add(this.startlevel, this);
                keys.push(key);
            }
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
    }
};