class storyScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'storyScene' });
    }

    preload() {
        this.load.image('story','assets/story7.png');
    }

    create () {

        this.add.image(0, 0, 'story').setOrigin(0, 0);

        //this.add.text(0, 580, 'Press Spacebar to continue', { font: '24px Courier', fill: '#000000' });

        console.log("This is storyScene");

        //this.input.once('pointerdown', function(){
        var spaceDown = this.input.keyboard.addKey('SPACE');
        var aDown = this.input.keyboard.addKey('A')

        
        spaceDown.on('down', function(){
        console.log("Spacebar pressed, goto story2Scene");
        this.scene.stop("storyScene");
        this.scene.start("level1");
        }, this );
        aDown.on('down',function(){
        this.scene.stop("storyScene");
        this.scene.start("level3");
        },this);
        

    }

}
