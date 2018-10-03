var Crowdjump = Crowdjump || {};

Crowdjump.Credits = function (game) {
    var text = [];
    var backToMenu;
};

Crowdjump.Credits.prototype = {
    create: function () {
        audio = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y -200, "Levelmusic: Overgrown Labyrinth by Visager, licensed under a Attribution-ShareAlike License.\n" +
            "Buttonsound: Button_04 by distillerystudio, licensed under Attribution 3.0 Unported. \n" +
            "Gatesound: Chain_Door_Squeak_Open_001 by JoelAudio, licensed under Attribution 3.0 Unported. \n" +
            "Levelup: Jingle Achievement 00 by LittleRobotSoundFactory, licensed under Attribution 3.0 Unported.", {
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