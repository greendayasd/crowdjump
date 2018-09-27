var Crowdjump = Crowdjump || {};

Crowdjump.Menu = function (game) {
    var startGame;
    var selectLevel;
    var logo;
    var instruction;
    var model;
};

Crowdjump.Menu.prototype = {
    create: function () {
        this.game.stage.backgroundColor = '#1948cd';
        levelmusic = game.add.audio('sfx:levelmusic', 1, true);

        logo = this.add.sprite(CONST_WORLD_CENTER_X,
            CONST_WORLD_CENTER_Y - 80, 'logo');
        logo.anchor.set(0.5);
        //+40 with level selection, font 40
        startGame = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 40, "Play", {
            font: "50px Arial",
            fill: '#dbdbdb'
        });
        startGame.anchor.set(0.5);
        startGame.inputEnabled = true;
        startGame.events.onInputDown.add(this.phasergame, this);

        key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        key1.onDown.add(this.phasergame, this);

        if (CONST_CHARACTERSELECTION) {
            selectCharacter = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 120, "Select Character", {
                font: "40px Arial",
                fill: '#dbdbdb'
            });
            selectCharacter.anchor.set(0.5);
            selectCharacter.inputEnabled = true;
            selectCharacter.events.onInputDown.add(this.characterSelection, this);

            key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
            key2.onDown.add(this.characterSelection, this);
        }

        if (CONST_LEVELSELECTION && game.gameInfo != undefined) {
            if (game.gameInfo.highest_level > 0) {
                selectLevel = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 170, "Select Level", {
                    font: "40px Arial",
                    fill: '#dbdbdb'
                });
                selectLevel.anchor.set(0.5);
                selectLevel.inputEnabled = true;
                selectLevel.events.onInputDown.add(this.levelSelection, this);

                key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
                key3.onDown.add(this.levelSelection, this);
            }
        }


        if (CONST_CREDITS) {
            credits = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 220, "Credits", {
                font: "40px Arial",
                fill: '#dbdbdb'
            });
            credits.anchor.set(0.5);
            credits.inputEnabled = true;
            credits.events.onInputDown.add(this.credits, this);

            key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
            key4.onDown.add(this.credits, this);
        }


        var instructionText = "The goal is simple: Control the alien by using the arrow keys \n" +
            "to move (or space to jump) to get to the flag.\n" +
            "If you get stuck, you can reset the game pressing R.";

        // instruction = this.add.text(this.world.centerX,
        //                         this.world.centerY + 160, instructionText, {fill: '#ffffff'});
        // instruction.anchor.set(0.5);
    },

    phasergame: function () {
        selected_level = -1;
        startGameRoutine();
    },

    levelSelection: function () {
        game.state.start('LevelSelection');
    },

    characterSelection: function () {
        game.state.start('CharacterSelection');
    },

    credits: function () {
        game.state.start('Credits');
    },

    endscreen: function () {

    }
}