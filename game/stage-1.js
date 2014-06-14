// Stage 1 of the game

// global game variable
var SpaceWars = SpaceWars || {};

(function(){

  SpaceWars.Stage1 = function(game) {};

  // short hand
  var S1 = SpaceWars.Stage1;

  // load assets
  S1.prototype.preload = function() {

    this.game.load.image('playerShip', 
      'assets/images/ships/playerShip.png');
    this.game.load.image('laser', 'assets/images/lasers/laserBlue.png');


  };

  S1.prototype.create = function() {

    this.game.stage.backgroundColor = 0x333333;

    // spaceship motion constants
    this.ROTATION_SPEED = 180; // degrees per second
    this.ACCELERATION = 200; // pixels per second
    this.MAX_SPEED = 250; // pixels per second
    this.DRAG = 50; // pixels per second

    // add the ship to the stage
    this.ship = this.game.add.sprite(this.game.width/2, 
      this.game.height/2, 'playerShip');
    this.ship.anchor.setTo(0.5, 0.5);
    this.ship.angle = -90;

    // enable physics on the ship
    this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
    this.ship.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED);
    this.ship.body.drag.setTo(this.DRAG, this.DRAG);

    // laser motion constants
    this.SHOT_DELAY = 100; // in milliseconds (10 bullets per second)
    this.LASER_SPEED = 500;
    this.NUMBER_OF_LASERS = 20;
    // create a group of lasers
    this.laserPool = this.game.add.group();
    for(var i = 0; i < this.NUMBER_OF_LASERS; i += 1) {
      var laser = this.game.add.sprite(0, 0, 'laser');
      this.laserPool.add(laser);
      laser.anchor.setTo(0.5, 0.5);
      this.game.physics.enable(laser, Phaser.Physics.ARCADE);
      laser.kill();
    }


  };

  S1.prototype.shootLaser = function() {

    if(this.lastLaserShotAt === undefined) {
      this.lastLaserShotAt = 0;
    }

    if(this.game.time.now - this.lastLaserShotAt < this.SHOT_DELAY) {
      return;
    }
    this.lastLaserShotAt = this.game.time.now;

    var laser = this.laserPool.getFirstDead();
    if(laser === null || laser === undefined) {
      return;
    }
    laser.revive();

    laser.checkWorldBounds = true;
    laser.outOfBoundsKill = true;

    laser.reset(this.ship.x, this.ship.y);
    laser.rotation = this.ship.rotation;

    laser.body.velocity.x = Math.cos(laser.rotation) 
      * this.LASER_SPEED;
    laser.body.velocity.y = Math.sin(laser.rotation)
      * this.LASER_SPEED;

  };

  S1.prototype.update = function() {

    // ship movements
    if(this.ship.x > this.game.width) {
      this.ship.x = 0
    };
    if(this.ship.x < 0) {
      this.ship.x = this.game.width;
    }
    if(this.ship.y > this.game.height) {
      this.ship.y = 0;
    }
    if(this.ship.y < 0) {
      this.ship.y = this.game.height;
    }
    if(this.isLeftKeyDown()) {
      this.ship.body.angularVelocity = -this.ROTATION_SPEED;
    } else if (this.isRightKeyDown()) {
      this.ship.body.angularVelocity = this.ROTATION_SPEED;
    } else {
      this.ship.body.angularVelocity = 0;
    }
    if(this.isUpKeyDown()) {
      this.ship.body.acceleration.x = Math.cos(this.ship.rotation) 
        * this.ACCELERATION;
      this.ship.body.acceleration.y = Math.sin(this.ship.rotation)
        * this.ACCELERATION;
    } else {
      this.ship.body.acceleration.setTo(0, 0);
    }

    if(this.isSpaceKeyDown()) {
      this.shootLaser();
    }

  };

  // keyboard controls
  S1.prototype.isLeftKeyDown = function() {
    return this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
  };

  S1.prototype.isRightKeyDown = function() {
    return this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
  };

  S1.prototype.isUpKeyDown = function() {
    return this.input.keyboard.isDown(Phaser.Keyboard.UP);
  };

  S1.prototype.isSpaceKeyDown = function() {
    return this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
  };

})();