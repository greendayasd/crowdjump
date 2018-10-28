var Crowdjump = Crowdjump || {};

Crowdjump.Gameover = function (game) {
    var replay;
    var info;
    var death;
};


Crowdjump.Gameover.prototype = {

    create: function () {
        this.game.stage.backgroundColor = '#1948cd';

        info = this.add.text(CONST_WORLD_CENTER_X, 155, "You died!", {font: "50px Arial", fill: '#dbdbdb'});
        info.anchor.set(0.5);
        info.fixedToCamera = true;

        death = this.add.sprite(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 10, 'alien_death');
        death.anchor.set(0.5);
        death.fixedToCamera = true;

        replay = this.add.text(CONST_WORLD_CENTER_X,
            CONST_WORLD_CENTER_Y - 80, 'Try again?', {font: "35px Arial", fill: '#dbdbdb'});
        replay.anchor.set(0.5, -5);
        replay.inputEnabled = true;
        replay.events.onInputDown.add(this.replay, this);
        replay.fixedToCamera = true;

        if (CONST_BACKBUTTON) {
            backToMenu = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 240, "Back to menu", {
                font: "32px Arial",
                fill: '#dbdbdb'
            });
            backToMenu.anchor.set(0.5);
            backToMenu.inputEnabled = true;
            backToMenu.events.onInputDown.add(backToMainMenu, this);
        }

        this.input.keyboard.addKey(Phaser.KeyCode.R).onUp.add(this.replay, this);
        this.input.keyboard.addKey(Phaser.KeyCode.ESC).onDown.add(backToMainMenu);
        // console.error("Gameinfo!: " + gameinfo);


    },

    replay: function () {
        //reset time
        this.game.time.reset();
        this.state.start('Game');
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
                this.replay();
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

