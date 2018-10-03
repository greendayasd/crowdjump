var Crowdjump = Crowdjump || {};

Crowdjump.CharacterSelection = function (game) {
    var text = [];
    var group;
    var backToMenu;
    var own_character;
};

Crowdjump.CharacterSelection.prototype = {
    create: function () {
        var files = '/static/website/gamefiles/';
        var characters = files + 'characters/';

        this.load.onLoadStart.add(this.loadStart, this);
        this.load.onLoadComplete.add(this.loadComplete, this);

        var rows = 4,
            columns = -1,
            border_horizontal = 170,
            border_vertical = 70;
        group = this.game.add.group();
        for (var i = 0; i < CONST_CHARACTER_COUNT; i++) {
            // text[i] = this.add.text(0, 0, "Level" + (i + 1), {
            //     font: "35px Arial",
            //     fill: '#dbdbdb',
            //     backgroundColor: '#0d1b35'
            // }, group);
            text[i] = this.add.sprite(CONST_WORLD_CENTER_X - 150 + 100 * i, CONST_WORLD_CENTER_Y - 30, 'c' + i);
            text[i].anchor.set(0.5);
            text[i].inputEnabled = true;
            text[i].character = 'c' + i;
            text[i].events.onInputDown.add(this.selectCharacter, this)
        }
        //rows amount, column amount, width, height
        group.align(rows, columns, (CONST_CANVAS_X - (2 * border_horizontal)) / rows, 70);
        group.x = border_horizontal;
        group.y = border_vertical;

        if (account != null) {
            if (account.uploaded_character != '' && account.uploaded_character != null) {
                own_character = this.add.sprite(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 50, getFileName(account.uploaded_character));
                own_character.anchor.set(0.5);
                own_character.inputEnabled = true;
                own_character.character = getFileName(account.uploaded_character);
                own_character.events.onInputDown.add(this.selectCharacter, this);

            }
        }

        // upload = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 150, "Upload", {
        //     font: "20px Arial",
        //     fill: '#dbdbdb'
        // });
        // upload.anchor.set(0.5);
        // upload.inputEnabled = true;
        // upload.events.onInputDown.add(this.uploadFile, this);

        backToMenu = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 220, "Back", {
            font: "40px Arial",
            fill: '#dbdbdb'
        });
        backToMenu.anchor.set(0.5);
        backToMenu.inputEnabled = true;
        backToMenu.events.onInputDown.add(backToMainMenu, this);
        this.input.keyboard.addKey(Phaser.KeyCode.ESC).onDown.add(backToMainMenu);
    },

    loadStart: function () {
    },
    loadComplete: function () {
    },
    selectCharacter: function (char) {
        game.character = char.character;
        selected_level = -1;
        changeCharacter();
        startGameRoutine();
    },
    uploadFile: function () {

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
            }

            if (pad1.justReleased(Phaser.Gamepad.XBOX360_B)) {
                backToMainMenu();
            }
            if (pad1.justReleased(Phaser.Gamepad.XBOX360_X)) {
            }
            if (pad1.justReleased(Phaser.Gamepad.XBOX360_Y)) {
            }
            if (pad1.justReleased(Phaser.Gamepad.XBOX360_START)) {
                backToMainMenu();
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