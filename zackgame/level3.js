// moving enemies
class level3 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level3' });
        this.thiefCount = 3;

    }

preload() {

    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map3', 'assets/lvl3prs.json');
    
    this.load.spritesheet('tiles', 'assets/tiles64x64.png', {frameWidth: 64, frameHeight: 64});

    //this.load.image('goldCoin', 'assets/goldCoin.png');

    //this.load.atlas('player', 'assets/this.player.png', 'assets/this.player.json');
    this.load.spritesheet('player','assets/zack2.png', { frameWidth: 100, frameHeight: 150} );


    //this.load.image('star', 'assets/star.png');
    //this.load.image('thief', 'assets/thieves.png',{frameWidth:70, frameHeight: 90});
    this.load.image('endpoint','assets/endpoint.png');
    this.load.image('paris','assets/paris2.png');
    this.load.image('life','assets/life2.png');
    this.load.audio('airplane','assets/airplane2.mp3');
    this.load.audio('hitbrick','assets/bricks.mp3');
    this.load.image('sky3','assets/sky3.3.png');
    this.load.audio('bgm','assets/bgm3.mp3');
    this.load.spritesheet('thief','assets/theifss2.png',{frameWidth:73, frameHeight:111})

}

create() {
    this.sky = this.add.tileSprite(0, 0, game.config.width, game.config.height, "sky3");
    this.sky.setOrigin(0, 0);
    this.sky.setScrollFactor(0);
    this.paris = this.add.tileSprite(0, 0, game.config.width, game.config.height, "paris");
    this.paris.setOrigin(0, 0);
    this.paris.setScrollFactor(0);
    this.map = this.make.tilemap({key: 'map3'});
    this.hitSnd = this.sound.add('hitbrick');
    this.apSnd = this.sound.add('airplane');
    this.bgmSnd = this.sound.add('bgm');

    
    // Must match tileSets name
   // var coinTiles = map.addTilesetImage('goldCoin');

    // Must match tileSets name
    this.Tiles = this.map.addTilesetImage('tiles64x64','tiles');

    // create the ground layer
    this.groundLayer = this.map.createDynamicLayer('groundLayer', this.Tiles, 0, 0);
    this.platformLayer = this.map.createDynamicLayer('platformLayer', this.Tiles, 0, 0);

    // Set starting and ending position using name
    this.startPoint3 = this.map.findObject("ObjectLayer", obj => obj.name === "startPoint");
    this.endPoint3 = this.map.findObject("ObjectLayer", obj => obj.name === "endPoint");
    this.add.image(this.endPoint3.x, this.endPoint3.y, 'endpoint');
    // console.log('startPoint ', this.startPoint.x, this.startPoint.y);
    // console.log('endPoint ', this.endPoint.x, this.endPoint.y);
    
    // add coins as tiles
    //coinLayer = map.createDynamicLayer('coinLayer', coinTiles, 0, 0);

    // create the player sprite    
    this.player = this.physics.add.sprite(200, 200, 'player');
    this.player.setBounce(0.1); // our this.player will bounce from items
    
    // small fix to our this.player images, we resize the physics body object slightly
    this.player.body.setSize(this.player.width*0.8, this.player.height*0.8);
    this.player.setCollideWorldBounds(true);
    this.platformLayer.setCollisionByProperty({collides:(true)}); // don't go out of the map  

    // Set this.player to starting position
    this.player.setPosition(0, 0);  

    console.log('player ', this.player.x, this.player.y);

    // set the boundaries of our game world
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // the this.player will collide with this layer
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.platformLayer.setCollisionByProperty({ collides: true });
    
    this.physics.add.collider(this.groundLayer, this.player);
    this.physics.add.collider(this.platformLayer, this.player);
    this.life1 = this.add.image(260,120, 'life').setScrollFactor(0);
    this.life2 = this.add.image(120,120,'life').setScrollFactor(0);
    this.life3 = this.add.image(190,120,'life').setScrollFactor(0);
    
   // this.thief.body.setSize(this.thief.width*0.9,this.thief.height*0.9);
    // Add random stars
    // this.stars = this.physics.add.group({
    //     key: 'star',
    //     repeat: 40,
    //     setXY: { x: 0, y: 0, stepX: Phaser.Math.Between(100, 300) }
    // });

    // // Collide platform with stars
    // this.physics.add.collider(this.platformLayer, this.stars);
    // this.physics.add.collider(this.groundLayer, this.stars);

    // this.physics.add.overlap(this.player, this.stars,this.collectStars, null, this );

     // Add random bomb


     this.timedEvent = this.time.addEvent({ delay: 2000, callback: this.moveLeft, callbackScope: this, loop: true });
     this.timedEvent2 = this.time.addEvent({ delay: 4000, callback: this.moveRight, callbackScope: this, loop: true });
       

    // Collide platform with stars
 
    this.add.text(25,560, 'Paris', { font: '24px Helvetica', fill: 'white' }).setScrollFactor(0);

    // this text will show the score
    // this.starText = this.add.text(20, 40, '0', {
    //     fontSize: '20px',
    //     fill: '#ffffff'
    // });
    // // fix the text to the camera
    // this.starText.setScrollFactor(0);
    // this.starText.visible = true;

    this.anims.create({
        key: 'thiefmove',
        frames: this.anims.generateFrameNumbers('thief', {
            start: 3,
            end: 0
        }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [{
            key: 'player',
            frame: 4
        }],
        frameRate: 20,
        repeat: false
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', {
            start: 5,
            end: 8
        }),
        frameRate: 10,
        repeat: -1
    });
// this.thief.setSize(this.thief.width*0.9, this.thief.height*0.9);
// this.thief.setCollideWorldBounds(true);
// this.platformLayer.setCollisionByProperty({collides:(true)});

this.thief = this.physics.add.group({
    key: 'thief',
    repeat: 5,
    setXY: { x: 300, y: 0, stepX: Phaser.Math.Between(750, 750) }
});

this.thief.children.iterate(ttt => {
    ttt.play('thiefmove')
  })

this.physics.add.collider(this.platformLayer, this.thief);
this.physics.add.collider(this.groundLayer, this.thief);

//this.physics.add.overlap(this.stars, this.bombs, this.removeBombs, null, this );
this.physics.add.overlap(this.player, this.thief, this.hitthief, null, this );

    this.cursors = this.input.keyboard.createCursorKeys();
    this.space = this.input.keyboard.addKey('SPACE');

  // set bounds so the camera won't go outside the game world
  this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  // make the camera follow the this.player
  this.cameras.main.startFollow(this.player);

  // set background color, so the sky is not black    
  this.cameras.main.setBackgroundColor('#ccccff');

}

// collectStars(player, stars) {
//     stars.disableBody(true, true);
//     this.starCount += 1; // add 10 points to the score
//     console.log(this.starCount);
//     //this.starText.setText(starCount); // set the text to show the current score
//     return false;
// }

// hitthief(player,thief) {
//     //bombs.disableBody(true, true);
//     console.log('Hitthief, restart game');
//     this.cameras.main.shake(500);
//     // delay 1 sec
//     this.time.delayedCall(2000,function() {

//         this.scene.restart();
// //        this.scene.start("gameoverScene");
//     },[], this);
// }
hitthief(player,thief)
 {
    //thief.disableBody(true, true);
    this.player.x = this.player.x - 300
    this.hitSnd.play();
   
    this.thiefCount -= 1; 
    if ( this.thiefCount === 2) {
        this.cameras.main.shake(50);
        this.life1.setVisible(false);
    } else if ( this.thiefCount === 1) {
        this.cameras.main.shake(50);
        this.life2.setVisible(false);
    } else if ( this.thiefCount === 0) {
        this.cameras.main.shake(50);
        this.life3.setVisible(false);
    }
    if ( this.thiefCount === 0 ) {
        this.cameras.main.shake(400);
        
        // delay 1 sec
        this.time.delayedCall(1000,function() {
            this.thiefCount = 3;
            this.bgmSnd.stop();
            this.scene.restart();
        },[], this);
    }
 }
// removethief(thief,stars) {
//    thief.disableBody(true, true);
// }

moveLeft(thief)
 {
    this.tweens.add({
        targets: this.thief.getChildren().map(function (c) { return c.body.velocity }),
        x: Phaser.Math.Between(-150, -50) ,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: false
    });
}
moveRight(thief) 
{
    this.tweens.add({
        targets: this.thief.getChildren().map(function (c) { return c.body.velocity }),
        x:  Phaser.Math.Between(50, 150),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: false
    });
}



update()
 {   if ( this.player.x <= this.startPoint3.x ) 
    {
        console.log('Reached End, game over');
        this.bgmSnd.play();
        //this.cameras.main.shake(500);
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

    // Check for reaching endPoint object
    if ( this.player.x >= this.endPoint3.x && this.player.y >= this.endPoint3.y ) 
    {
        console.log('Reached End, game over');
        this.bgmSnd.stop();
        this.apSnd.play();
        //this.cameras.main.shake(500);
        this.time.delayedCall(1000,function() {
            this.scene.stop("level3");
            this.scene.start("gameoverScene");
        },[], this);
    }
    this.paris.tilePositionX = this.cameras.main.scrollX * .2
    this.paris.tilePositionY = this.cameras.main.scrollY* 0;
    this.sky.tilePositionX = this.cameras.main.scrollX * .4
    this.sky.tilePositionY = this.cameras.main.scrollY* 0;
}
}