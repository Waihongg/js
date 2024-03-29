// collect stars, no enemies
class level1 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level1' });
        // Put global variable here
        this.bricksCount = 3;
    }

preload() {

    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/lvl2jpn.json');
    
    this.load.spritesheet('tiles', 'assets/tiles64x64.png', {frameWidth: 64, frameHeight: 64});

    this.load.spritesheet('player','assets/zack2.png', { frameWidth: 100, frameHeight: 150} );

    //this.load.image('star', 'assets/star.png');

    //this.load.image('endpoint', 'assets/endpoint.png',{frameWidth:367, frameHeight: 287});
    this.load.image('life','assets/life2.png');
    this.load.image('japan','assets/japanfinal.png');
    this.load.image('bricks', 'assets/brick3.png', { frameWidth: 43, frameHeight:58});
    this.load.audio('airplane','assets/airplane2.mp3');
    this.load.audio('hitbrick','assets/bricks.mp3');
    this.load.image('sky1','assets/sky2.3.png');
    this.load.audio('bgm','assets/bgm3.mp3');
    this.load.image('bricks', 'assets/brick.png', { frameWidth: 43, frameHeight:58});

}

create() {
    
    this.map = this.make.tilemap({key: 'map'});
    this.sky = this.add.tileSprite(0, 0, game.config.width, game.config.height, "sky1");
    this.sky.setOrigin(0, 0);
    this.sky.setScrollFactor(0);
    this.japan = this.add.tileSprite(0, 0, game.config.width, game.config.height, "japan");
    this.japan.setOrigin(0, 0);
    this.japan.setScrollFactor(0,0);

    this.apSnd = this.sound.add('airplane');
    this.hitSnd = this.sound.add('hitbrick');
    this.bgmSnd = this.sound.add('bgm');
    this.bgmSnd.loop = true;
    
    // Must match tileSets name
    let Tiles = this.map.addTilesetImage('tiles64x64','tiles');

    // create the ground layer
    this.groundLayer = this.map.createDynamicLayer('groundLayer', Tiles, 0, 0);
    this.platformLayer = this.map.createDynamicLayer('platformLayer', Tiles, 0, 0);

    // Set starting and ending position using object names in tiles
    this.startPoint = this.map.findObject("ObjectLayer", obj => obj.name === "startPoint");
    this.endPoint = this.map.findObject("ObjectLayer", obj => obj.name === "endPoint");

    // Place an image manually on the endPoint
    //this.add.image(this.endPoint.x, this.endPoint.y, 'endpoint');
    // console.log('startPoint ', this.startPoint.x, this.startPoint.y);
    // console.log('endPoint ', this.endPoint.x, this.endPoint.y);

    // create the player sprite    
    this.player = this.physics.add.sprite(200, 200, 'player');
    this.player.setBounce(0.1); // our this.player will bounce from items
    window.player = this.player;
    
    // small fix to our this.player images, we resize the physics body object slightly
    this.player.body.setSize(this.player.width*0.9, this.player.height*0.9);
    this.player.setCollideWorldBounds(true); // don't go out of the map  

    // Set this.player to starting position
    //this.player.setPosition(this.startPoint.x, this.startPoint.y);  
    this.player.setPosition(0, 0);  

    //console.log('player ', this.player.x, this.player.y);

    // set the boundaries of our game world
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // the this.player will collide with this layer
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.platformLayer.setCollisionByProperty({ collides: true });
    
    this.physics.add.collider(this.groundLayer, this.player);
    this.physics.add.collider(this.platformLayer, this.player);

    // Add random stars
    // this.stars = this.physics.add.group({
    //     key: 'star',
    //     repeat: 10,
    //     setXY: { x: 0, y: 0, stepX: Phaser.Math.Between(200, 200) }
    // });

    // Collide platform with stars
    // this.physics.add.collider(this.platformLayer, this.stars);
    // this.physics.add.collider(this.groundLayer, this.stars);
    

    

    //this.physics.add.overlap(this.player, this.stars,this.collectStars, null, this );
     // Add random bricks
    this.bricks = this.physics.add.group({
            key: 'bricks',
            repeat: 3,
            setXY: { x: 200, y: 0, stepX: Phaser.Math.Between(200, 600) }
        });
    
// Collide platform with bricks
     this.physics.add.collider(this.platformLayer, this.bricks);
    this.physics.add.collider(this.groundLayer, this.bricks);
    this.physics.add.overlap(this.player, this.bricks, this.hitbricks, null, this );

    this.life1 = this.add.image(260,120, 'life').setScrollFactor(0);
    this.life2 = this.add.image(120,120,'life').setScrollFactor(0);
    this.life3 = this.add.image(190,120,'life').setScrollFactor(0);


    this.add.text(25,560, 'Japan_1', { font: '24px Helvetica', fill: 'white' }).setScrollFactor(0);

    // this text will show the score
    // this.starText = this.add.text(20, 40, 'Stars 0', {
    //     fontSize: '20px',
    //     fill: '#ffffff'
    // });
    // // fix the text to the camera
    // this.starText.setScrollFactor(0);
    // this.starText.visible = true;

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', {
            start: 3,
            end: 0
        }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [{
            key: 'player',
            frame: 4
        }],
        frameRate: 5,
        repeat: false
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', {
            start: 5,
            end: 10
        }),
        frameRate: 8,
        repeat: -1
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.space = this.input.keyboard.addKey('SPACE');

  // set bounds so the camera won't go outside the game world
  this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  // make the camera follow the this.player
  this.cameras.main.startFollow(this.player);

  // set background color, so the sky is not black    
  this.cameras.main.setBackgroundColor('#ccccff');

}
hitbricks(player, bricks) {
    bricks.disableBody(true, true);
    this.hitSnd.play();
    console.log(this.bricksCount);
    this.bricksCount -= 1; 
    if ( this.bricksCount === 2) {
        this.cameras.main.shake(50);
        this.life1.setVisible(false);
    } else if ( this.bricksCount === 1) {
        this.cameras.main.shake(50);
        this.life2.setVisible(false);
    } else if ( this.bricksCount === 0) {
        this.cameras.main.shake(50);
        this.life3.setVisible(false);
    }
    if ( this.bricksCount === 0 ) {
        this.cameras.main.shake(400);
        // delay 1 sec
        this.time.delayedCall(1000,function() {
            this.bricksCount = 3;
            this.bgmSnd.stop();
            this.scene.restart();
        },[], this);
    }
    this.cameras.main.shake(50);
    
    //this.lifeText.setText('' + this.lifeCount); // set the text to show the current score
    return false;
}


// collectStars(player, stars) {
//     stars.disableBody(true, true);
//     this.starCount += 1; 
//     console.log(this.starCount);
//     this.starText.setText(this.starCount); // set the text to show the current score
//     return false;
// }

// removeBombs(bombs,stars) {
//     bombs.disableBody(true, true);
// }

update() {
    if ( this.player.x < this.startPoint.x ) {
        
        console.log('Reached startPoint, bgm play ');
        this.bgmSnd.play(

        );
    }



    if (this.cursors.left.isDown)
    {
        this.player.body.setVelocityX(-200);
        this.player.anims.play('left', true); // walk left
        //this.player.flipX = true; // flip the sprite to the left
    }
    else if (this.cursors.right.isDown)
    {
        this.player.body.setVelocityX(200);
        this.player.anims.play('right', true);
        //this.player.flipX = false; // use the original sprite looking to the right
    } else {
        this.player.body.setVelocityX(0);
        this.player.anims.play('idle', true);
    }
    // jump 
    if (this.space.isDown && this.player.body.onFloor())
    {
        this.player.body.setVelocityY(-350);        
    }

    //console.log('Current this.player pos ', this.player.x, this.player.y);
    
    // Check for more then 5 stars
    if ( this.starCount > 3 ) {
        console.log('Collected 1 star, jump to level 2');
        this.scene.stop("level1");
        this.scene.start("level2");
    }

    // Check for reaching endPoint object
    if ( this.player.x >= this.endPoint.x && this.player.y >= this.endPoint.y ) {
        //this.apSnd.play();
        this.bgmSnd.stop();
        console.log('Reached endPoint, loading next level');
        this.scene.stop("level1");
        this.scene.start("level2");

    }
    this.japan.tilePositionX = this.cameras.main.scrollX * .2
    this.japan.tilePositionY = this.cameras.main.scrollY* 0
    this.sky.tilePositionX = this.cameras.main.scrollX * 0.4
    this.sky.tilePositionY = this.cameras.main.scrollY* 0;
}


}