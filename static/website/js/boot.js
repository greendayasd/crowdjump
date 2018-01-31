var Crowdjump = Crowdjump || {};

Crowdjump.Boot = function(game){
    
};

Crowdjump.Boot.prototype = {

    preload: function () {
        var images = '/static/website/images/';

        this.load.image('preloadbar', images + 'progressbar.png');

    },

    create: function () {
        this.game.stage.backgroundColor = '#1948cd';
        //this.add.sprite(this.world.centerX,this.world.centerY,'logo');

        if(this.game.device.desktop){
             this.scale.pageAlignHorizontally = true;
        }
        else{
            this.scale.scaleMode =Phaser.ScaleManager.SHOW_ALL;
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
            // this.scale.forcePortrait = true;
            // this.scale.minWidth = 600;
            // this.scale.minHeight = 600;
            // this.scale.maxWidth = 600;
            // this.scale.maxHeight = 600;


        }
    },

    update:function () {
        this.state.start('Preloader');
    },
}