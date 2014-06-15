// enemy ships

var SpaceWars = SpaceWars || {};

(function(){

  var ENEMY_SHIPS = ['enemyBlack', 'enemyBlue', 'enemyGreen', 'enemyRed'];

  SpaceWars.EnemyShips = {

    loadAssets: function(stage) {

      for(var i = 0; i < ENEMY_SHIPS.length; i += 1) {
        for(var j = 1; j <= 5; j += 1) {
          stage.game.load.image(
            ENEMY_SHIPS[i] + j ,
            'assets/images/ships/' + ENEMY_SHIPS[i] + j +'.png'
          );
        }
      }
      stage.game.load.image(
        'enemyLaser',
        'assets/images/lasers/laserRed.png'
      );

      window.stage = stage;

    },

    createShips: function(stage, enemyShipConstants) {

      stage.enemyShipConstants = enemyShipConstants;
      
      stage.enemyPool = stage.game.add.group();
      for(var i = 0; i < stage.enemyShipConstants.NUM_SHIPS; i += 1) {
        var enemyShip = 
          ENEMY_SHIPS[stage.game.rnd.integerInRange(0, ENEMY_SHIPS.length - 1)]
          + stage.game.rnd.integerInRange(1, 5);
        var enemy = stage.game.add.sprite(0, 0, enemyShip);
        stage.enemyPool.add(enemy);
        enemy.anchor.setTo(0.5, 0.5);
        stage.game.physics.enable(enemy, Phaser.Physics.ARCADE);
        enemy.kill();
      }

      stage.enemyLaserPool = stage.game.add.group();
      for(var i = 0; i < stage.enemyShipConstants.NUM_LASERS; i += 1) {
        var laser = stage.game.add.sprite(0, 0, 'enemyLaser');
        stage.enemyLaserPool.add(laser);
        laser.anchor.setTo(0.5, 0.5);
        stage.game.physics.enable(laser, Phaser.Physics.ARCADE);
        laser.kill();
      }

    },

    createOneShip: function(stage) {
      
      var enemy = stage.enemyPool.getFirstDead();
      if(enemy === null || enemy === undefined) {
        return;
      }

      enemy.revive();

      enemy.damageCount = 0;

      enemy.reset(
        stage.game.rnd.integerInRange(10, stage.game.width - 10),
        -30
      );

      enemy.body.velocity.x = stage.enemyShipConstants.SPEED;
      enemy.body.velocity.y = stage.enemyShipConstants.SPEED;

    },

    createAllShips: function(stage) {
      for(var i = 0; i < stage.enemyShipConstants.NUM_SHIPS; i += 1) {
        this.createOneShip(stage);
      }
    },

    updateShips: function(stage) {

      var SPEED = stage.enemyShipConstants.SPEED;
      var self = this;

      stage.enemyPool.forEachAlive(function(enemy){

        // keep the ships in track
        if(enemy.x > stage.game.width - 100) {
          enemy.body.velocity.x = -SPEED;
        };
        if(enemy.x < 50) {
          enemy.body.velocity.x = SPEED;
        }
        if(enemy.y > stage.game.height - 100) {
          enemy.body.velocity.y = -SPEED;
        }
        if(enemy.y < 50) {
          enemy.body.velocity.y = SPEED;
        }

        // look towards the player
        var targetAngle = stage.game.math.angleBetween(
          enemy.x, enemy.y,
          stage.ship.x, stage.ship.y
        );
        if(enemy.rotation !== targetAngle) {
          enemy.rotation = targetAngle;
        }

        self.shootLaser.apply(enemy, [stage]);


      });      

    },

    shootLaser: function(stage) {

      if(this.lastLaserShotAt === undefined) {
        this.lastLaserShotAt = 0;
      }
      if(stage.game.time.now - this.lastLaserShotAt < stage.enemyShipConstants.SHOT_DELAY
      ) {
        return;
      }

      this.lastLaserShotAt = stage.game.time.now;

      var laser = stage.enemyLaserPool.getFirstDead();
      if(laser === null || laser === undefined) {
        return;
      }
      laser.revive();

      laser.checkWorldBounds = true;
      laser.outOfBoundsKill = true;

      laser.reset(this.x, this.y);
      laser.rotation = this.rotation;

      laser.body.velocity.x = Math.cos(laser.rotation) 
        * stage.enemyShipConstants.LASER_SPEED;
      laser.body.velocity.y = Math.sin(laser.rotation)
        * stage.enemyShipConstants.LASER_SPEED;


    }

  };


})();