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
            CONST_WORLD_CENTER_Y - 100, 'logo');
        logo.anchor.set(0.5);
        //+40 with level selection, font 40
        startGame = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 10, "Play", {
            font: "50px Arial",
            fill: '#dbdbdb'
        });
        startGame.anchor.set(0.5);
        startGame.inputEnabled = true;
        startGame.events.onInputDown.add(this.phasergame, this);

        key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        key1.onDown.add(this.phasergame, this);

        if (CONST_CHARACTERSELECTION) {
            selectCharacter = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 90, "Select Character", {
                font: "40px Arial",
                fill: '#dbdbdb'
            });
            selectCharacter.anchor.set(0.5);
            selectCharacter.inputEnabled = true;
            selectCharacter.events.onInputDown.add(this.characterSelection, this);

            key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
            key2.onDown.add(this.characterSelection, this);
        }

        var highestLevel = game.highest_level;
        if (CONST_PLAY_REACHED_LEVEL) highestLevel++;
        if (CONST_LEVELSELECTION && highestLevel > 0) {
            selectLevel = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 140, "Select Level", {
                font: "40px Arial",
                fill: '#dbdbdb'
            });
            selectLevel.anchor.set(0.5);
            selectLevel.inputEnabled = true;
            selectLevel.events.onInputDown.add(this.levelSelection, this);

            key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
            key3.onDown.add(this.levelSelection, this);
        }


        if (CONST_OPTIONMENU && (CONST_MULTIPLE_DIFFICULTIES)) {
            credits = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 190, "Options", {
                font: "40px Arial",
                fill: '#dbdbdb'
            });
            credits.anchor.set(0.5);
            credits.inputEnabled = true;
            credits.events.onInputDown.add(this.options, this);

            key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
            key4.onDown.add(this.options, this);
        }

        if (CONST_CREDITS) {
            credits = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 250, "Credits", {
                font: "40px Arial",
                fill: '#dbdbdb'
            });
            credits.anchor.set(0.5);
            credits.inputEnabled = true;
            credits.events.onInputDown.add(this.credits, this);

            key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
            key5.onDown.add(this.credits, this);
        }



        // var instructionText = "The goal is simple: Control the alien by using the arrow keys \n" +
        //     "to move (or space to jump) to get to the flag.\n" +
        //     "If you get stuck, you can reset the game pressing R.";

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

    options: function () {
        game.state.start('Options');
    },

    credits: function () {
        game.state.start('Credits');
    },

    endscreen: function () {

    },


    update: function () {
        if (CONST_CONTROLLER) {
            // Controls
            if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
            }
            else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
            }

            if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
            }
            else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
            }

            if (pad1.justPressed(Phaser.Gamepad.XBOX360_A)) {
                startGameRoutine();
            }

            if (pad1.justReleased(Phaser.Gamepad.XBOX360_B)) {
            }
            if (pad1.justReleased(Phaser.Gamepad.XBOX360_X)) {
            }
            if (pad1.justReleased(Phaser.Gamepad.XBOX360_Y)) {
            }
            if (pad1.justReleased(Phaser.Gamepad.XBOX360_START)) {
            }

            if (pad1.connected) {
                var rightStickX = pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
                var rightStickY = pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);

                if (rightStickX) {
                }

                if (rightStickY) {
                }
            }
        }

    }

};