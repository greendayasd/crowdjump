var Crowdjump = Crowdjump || {};

Crowdjump.Preloader = function(game){
    this.ready = false;
    var text;
};


Crowdjump.Preloader.prototype = {

    create:function () {
    },
    preload: function(){
        this.preloadBar =  this.add.sprite(this.world.centerX,this.world.centerY,'preloadbar');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        var files = '/static/website/gamefiles/';
        var level = '/static/website/level/';
        var audio = '/static/website/audio/';
        var images = '/static/website/images/';



        this.load.image('logo', images + 'logo.png');
        this.load.image('play', images + 'play.png');
        this.load.image('bubble', images + 'ideabubble.png');

        //alle Level laden
        // for (i = 0; i < CONST_LEVEL; i++){
        //     var levelname = 'level';
        //     levelname += i +'';
        //
        //     this.load.json('level:' + i, level + levelname + '.json');
        // }
        this.load.json('level:0', level + 'level0.json');
        this.load.json('level:1', level + 'level1.json');

        //files
        this.load.image('background', files + 'background.png');
        this.load.image('ground', files + 'ground.png');
        this.load.image('grass:8x1', files + 'grass_8x1.png');
        this.load.image('grass:6x1', files + 'grass_6x1.png');
        this.load.image('grass:4x1', files + 'grass_4x1.png');
        this.load.image('grass:2x1', files + 'grass_2x1.png');
        this.load.image('grass:1x1', files + 'grass_1x1.png');
        this.load.image('invisible-wall', files + 'invisible_wall.png');
        this.load.image('icon:coin', files + 'coin_icon.png');

        //character
        if (CONST_ANIMATE_CHARACTER){
           this.load.spritesheet('hero', files + 'hero.png', 36, 42);
        }
        else{
            this.load.image('hero', files + 'hero_stopped.png');
        }

        //audio
        this.load.audio('sfx:jump', audio + 'jump.wav');
        this.load.audio('sfx:coin', audio + 'coin.wav');
        this.load.audio('sfx:stomp', audio + 'stomp.wav');
        this.load.audio('sfx:flag', audio + 'flag.wav');

        //sprites
        this.load.spritesheet('coin', files + 'coin_animated.png', 22, 22);
        this.load.spritesheet('spider', files + 'spider.png', 42, 32);
        this.load.spritesheet('flag', files + 'flag.png', 42, 66);

        //fonts
        this.load.image('font:numbers', files + 'numbers.png');

        // this.load.audio('myMusic', audio + 'Test.mp3');
        // this.load.audio('myMusic2', audio + 'Test2.mp3');
        // this.load.audio('myMusic3', audio + 'Test3.mp3');

        this.load.onLoadStart.add(this.loadStart,this);
        this.load.onLoadComplete.add(this.loadComplete, this);


    },
    loadStart:function(){
        text = this.add.text(this.world.centerX,this.world.centerY - 30,'Loading. . . ');
        text.anchor.set(0.5);
    },
    loadComplete:function(){
        this.ready = true;
    },
    update: function(){
        if (this.ready === true)
        {
            this.ready = false;
            text.setText('');
            // console.log('fertig geladen');
            // this.state.start('Startmenu');
            this.state.start('Game');
        }
    }

};