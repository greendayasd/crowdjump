var Crowdjump = Crowdjump || {};

Crowdjump.Options = function (game) {
    var text = [];
    var group;
    var backToMenu;
    var own_character;
    var previousDifficulty;

    var difficulty1;
    var difficulty2;
    var difficulty3;

    var font;
    var fontSelected;

};

Crowdjump.Options.prototype = {
    create: function () {
        var files = '/static/website/gamefiles/';
        var characters = files + 'characters/';
        var fontSize = 35;
        var marginX = 30;
        var marginY = 30;
        var marginRight = 30;
        var marginBottom = 30 + fontSize;
        font = new Object;
        previousDifficulty = game.difficulty;

        font.fontSize=fontSize;
        font.fill=fontColor;
        font.backgroundColor = fontBackgroundColor;
        font.font = "Arial";

        fontSelected = new Object;
        fontSelected.fontSize=fontSize;
        fontSelected.fill=fontColorSelected;
        fontSelected.backgroundColor = fontBackGroundColorSelected;
        fontSelected.font = "Arial";


        this.load.onLoadStart.add(this.loadStart, this);
        this.load.onLoadComplete.add(this.loadComplete, this);

        //difficulty
        var difficultyText = this.add.text(marginX, marginY, "Difficulty", font);

        difficulty1 = this.add.text(marginX + (1 * marginRight) + 134, marginY, "Easy", font);
        difficulty1.inputEnabled = true;
        difficulty1.events.onInputDown.add(this.selectDifficulty, {dif : DIFFICULTY.easy});

        difficulty2 = this.add.text(marginX + (2 * marginRight) + 200, marginY, "Normal", font);
        difficulty2.inputEnabled = true;
        difficulty2.events.onInputDown.add(this.selectDifficulty, {dif : DIFFICULTY.normal});
        // difficulty2.setStyle()

        difficulty3 = this.add.text(marginX + (3 * marginRight) + 300, marginY, "Hard", font);
        difficulty3.inputEnabled = true;
        difficulty3.events.onInputDown.add(this.selectDifficulty, {dif : DIFFICULTY.hard});

        backToMenu = this.add.text(CONST_WORLD_CENTER_X, CONST_WORLD_CENTER_Y + 220, "Back", {
            font: "40px Arial",
            fill: '#dbdbdb'
        });
        backToMenu.anchor.set(0.5);
        backToMenu.inputEnabled = true;
        backToMenu.events.onInputDown.add(backToMainMenu, this);
        this.input.keyboard.addKey(Phaser.KeyCode.ESC).onDown.add(backToMainMenu);
        this.changeDifficultySelectedColor();
    },

    loadStart: function () {
    },
    loadComplete: function () {
    },

    selectDifficulty: function () {
        game.difficulty = this.dif;
        Crowdjump.Options.prototype.changeDifficultySelectedColor();
        previousDifficulty = game.difficulty;
        changeDifficulty();
        // startGameRoutine();
    },
    changeDifficultySelectedColor: function () {

        //change selected difficulty
        switch (previousDifficulty){
            case DIFFICULTY.easy:
                difficulty1.setStyle(font);
                break;
            case DIFFICULTY.normal:
                difficulty2.setStyle(font);
                break;
            case DIFFICULTY.hard:
                difficulty3.setStyle(font);
                break;
        }

        //change selected difficulty
        switch (game.difficulty){
            case DIFFICULTY.easy:
                difficulty1.setStyle(fontSelected);
                break;
            case DIFFICULTY.normal:
                difficulty2.setStyle(fontSelected);
                break;
            case DIFFICULTY.hard:
                difficulty3.setStyle(fontSelected);
                break;
        }
    }
}