// code for ship

var SpaceWars = SpaceWars || {};

(function(){

  var SHIP_MAX_DAMAGE = 100;

  SpaceWars.PlayerShip = {

    loadAssets: function(stage) {
      stage.game.load.image('playerShip', 
        'assets/images/ships/playerShip.png');
      stage.game.load.image('laser',
        'assets/images/lasers/laserBlue.png');
    },

    createShip: function(stage) {
      
      // spaceship motion constants
      stage.shipConstants = {};
      stage.shipConstants.ROTATION_SPEED = 240; // degrees per second
      stage.shipConstants.ACCELERATION = 400; // pixels per second
      stage.shipConstants.MAX_SPEED = 500; // pixels per second
      stage.shipConstants.DRAG = 100; // pixels per second
      stage.shipConstants.MAX_LASERS = 100;

      // add the ship to the stage
      stage.ship = stage.game.add.sprite(
        stage.game.width/2, 
        stage.game.height/2, 'playerShip'
      );
      stage.ship.anchor.setTo(0.5, 0.5);
      //stage.ship.angle = -90;

      // enable physics on the ship
      stage.game.physics.enable(stage.ship, Phaser.Physics.ARCADE);
      stage.ship.body.maxVelocity.setTo(stage.shipConstants.MAX_SPEED, stage.shipConstants.MAX_SPEED);
      stage.ship.body.drag.setTo(stage.shipConstants.DRAG, stage.shipConstants.DRAG);

      // laser motion constants
      stage.laserConstants = {};
      stage.laserConstants.SHOT_DELAY = 100; // in milliseconds (10 bullets per second)
      stage.laserConstants.LASER_SPEED = 2000;
      stage.laserConstants.NUMBER_OF_LASERS = 20;
      // create a group of lasers
      stage.laserPool = stage.game.add.group();
      for(var i = 0; i < stage.laserConstants.NUMBER_OF_LASERS; i += 1) {
        var laser = stage.game.add.sprite(0, 0, 'laser');
        stage.laserPool.add(laser);
        laser.anchor.setTo(0.5, 0.5);
        stage.game.physics.enable(laser, Phaser.Physics.ARCADE);
        laser.kill();
      }

      // set damage to 0
      stage.ship.damageCount = 0;

      // set shot fired to 0
      stage.ship.playerLaserCount = stage.shipConstants.MAX_LASERS;

    },

    controlShip: function(stage) {

      // ship movements
      if(stage.ship.x > stage.game.width) {
        stage.ship.x = 0
      };
      if(stage.ship.x < 0) {
        stage.ship.x = stage.game.width;
      }
      if(stage.ship.y > stage.game.height) {
        stage.ship.y = 0;
      }
      if(stage.ship.y < 0) {
        stage.ship.y = stage.game.height;
      }
      if(this.isLeftKeyDown(stage)) {
        stage.ship.body.angularVelocity = -stage.shipConstants.ROTATION_SPEED;
      } else if (this.isRightKeyDown(stage)) {
        stage.ship.body.angularVelocity = stage.shipConstants.ROTATION_SPEED;
      } else {
        stage.ship.body.angularVelocity = 0;
      }
      if(this.isUpKeyDown(stage)) {
        stage.ship.body.acceleration.x = Math.cos(stage.ship.rotation) 
          * stage.shipConstants.ACCELERATION;
        stage.ship.body.acceleration.y = Math.sin(stage.ship.rotation)
          * stage.shipConstants.ACCELERATION;
      } else {
        stage.ship.body.acceleration.setTo(0, 0);
      }

      if(this.isSpaceKeyDown(stage)) {
        this.shootLaser(stage);
      }

    },

    shootLaser: function(stage) {

      if(stage.ship.playerLaserCount === 0) {
        return;
      }

      if(this.lastLaserShotAt === undefined) {
        this.lastLaserShotAt = 0;
      }

      if(stage.game.time.now - this.lastLaserShotAt < stage.laserConstants.SHOT_DELAY) {
        return;
      }
      this.lastLaserShotAt = stage.game.time.now;

      var laser = stage.laserPool.getFirstDead();
      if(laser === null || laser === undefined) {
        return;
      }
      laser.revive();

      laser.checkWorldBounds = true;
      laser.outOfBoundsKill = true;

      laser.reset(stage.ship.x, stage.ship.y);
      laser.rotation = stage.ship.rotation;

      laser.body.velocity.x = Math.cos(laser.rotation) 
        * stage.laserConstants.LASER_SPEED;
      laser.body.velocity.y = Math.sin(laser.rotation)
        * stage.laserConstants.LASER_SPEED;

      // decrease laser count
      stage.ship.playerLaserCount -= 1;
      SpaceWars.ScoreBoard.updateLaserCount(stage, stage.ship.playerLaserCount);

    },

    // keyboard controls
    isLeftKeyDown: function(stage) {
      return stage.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    },

    isRightKeyDown: function(stage) {
      return stage.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    },

    isUpKeyDown: function(stage) {
      return stage.input.keyboard.isDown(Phaser.Keyboard.UP);
    },

    isSpaceKeyDown: function(stage) {
      return stage.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
    },

    isDownKeyDown: function(stage) {
      return stage.input.keyboard.isDown(Phaser.Keyboard.DOWN);
    },

    shipHitEnemy: function(player, enemy) {
      SpaceWars.Impacts.showEnemyImpact(this, enemy);
      SpaceWars.Impacts.showPlayerImpactByEnemy(this, player);
      SpaceWars.PlayerShip.updatePlayerDamage(player);
      SpaceWars.EnemyShips.updateEnemyDamage(enemy);
    },

    updatePlayerDamage: function(player) {
      player.damageCount += 1;
      SpaceWars.ScoreBoard.updatePlayerHealth(stage, 
        100 - player.damageCount
      );
      if(player.damageCount >= SHIP_MAX_DAMAGE) {
        player.kill();
      }
    },

    laserHitEnemy: function(laser, enemy) {
      SpaceWars.Impacts.showEnemyImpact(this, enemy);
      SpaceWars.EnemyShips.updateEnemyDamage(enemy);
      laser.kill();
    }

  };

})();