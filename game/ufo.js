// ufo ships

var SpaceWars = SpaceWars || {};

(function(){

  var UFO_MAX_DAMAGE = 20;
  var UFO_SHIPS = ['ufoBlue', 'ufoGreen', 'ufoRed', 'ufoYellow'];

  SpaceWars.Ufos = {

    loadAssets: function(stage) {

      for(var i = 0; i < UFO_SHIPS.length; i += 1) {
        stage.game.load.image(
          UFO_SHIPS[i],
          'assets/images/ufo/' + UFO_SHIPS[i] + '.png'
        );
      }
      stage.game.load.image(
        'ufoLaser',
        'assets/images/lasers/soccerBall.png'
      );

    },

    createUfos: function(stage, ufoConstants) {

      stage.ufoConstants = ufoConstants;
      
      stage.ufoPool = stage.game.add.group();
      for(var i = 0; i < stage.ufoConstants.NUM_SHIPS; i += 1) {
        var ufoAsset = UFO_SHIPS[stage.game.rnd.integerInRange(
          0,
          UFO_SHIPS.length - 1
        )];
        var ufo = stage.game.add.sprite(0, 0, ufoAsset);
        stage.ufoPool.add(ufo);
        ufo.anchor.setTo(0.5, 0.5);
        stage.game.physics.enable(ufo, Phaser.Physics.ARCADE);
        ufo.kill();
      }

      stage.ufoLaserPool = stage.game.add.group();
      for(var i = 0; i < stage.ufoConstants.NUM_LASERS; i += 1) {
        var laser = stage.game.add.sprite(0, 0, 'ufoLaser');
        stage.ufoLaserPool.add(laser);
        laser.anchor.setTo(0.5, 0.5);
        stage.game.physics.enable(laser, Phaser.Physics.ARCADE);
        laser.kill();
      }

    },

    drawOneUfo: function(stage) {
      
      var ufo = stage.ufoPool.getFirstDead();
      if(ufo === null || ufo === undefined) {
        return;
      }

      ufo.revive();
      ufo.checkWorldBounds = true;
      ufo.outOfBoundsKill = true;
      ufo.damageCount = 0;

      ufo.reset(
        stage.game.rnd.integerInRange(10, stage.game.width - 10),
        stage.game.height
      );

      ufo.body.velocity.x = stage.ufoConstants.SPEED;
      ufo.body.velocity.y = -stage.ufoConstants.SPEED;

    },

    updateUfos: function(stage) {

      var SPEED = stage.ufoConstants.SPEED;
      var self = this;

      stage.ufoPool.forEachAlive(function(ufo){

        // keep the ships in track
        if(ufo.x > stage.game.width - 100) {
          ufo.body.velocity.x = -SPEED;
        };
        if(ufo.x < 50) {
          ufo.body.velocity.x = SPEED;
        }
        if(ufo.y > stage.game.height - 100) {
          ufo.body.velocity.y = -SPEED;
        }
        if(ufo.y < 50) {
          ufo.body.velocity.y = SPEED;
        }

        ufo.angle += stage.ufoConstants.ANGLE_SPEED;

        self.shootLaser.apply(ufo, [stage]);

      });

    },

    shootLaser: function(stage) {

      if(this.lastLaserShotAt === undefined) {
        this.lastLaserShotAt = 0;
      }
      if(stage.game.time.now - this.lastLaserShotAt < stage.ufoConstants.SHOT_DELAY
      ) {
        return;
      }

      this.lastLaserShotAt = stage.game.time.now;

      var laser = stage.ufoLaserPool.getFirstDead();
      if(laser === null || laser === undefined) {
        return;
      }
      laser.revive();

      laser.checkWorldBounds = true;
      laser.outOfBoundsKill = true;
      laser.anchor.setTo(0.5, 0.5);
      
      laser.reset(this.x, this.y);
      laser.rotation = this.rotation;

      laser.body.velocity.x = Math.cos(laser.rotation) 
        * stage.ufoConstants.LASER_SPEED;
      laser.body.velocity.y = Math.sin(laser.rotation)
        * stage.ufoConstants.LASER_SPEED;

    },

    createOneUfo: function() {

      if(this.gameDataState.getEnemiesKilled() < this.ufoConstants.MAX_ENEMY_KILLED_TO_APPEAR) {
        return;
      }

      if( this.gameDataState.getUfosCreated() >= 
          this.ufoConstants.NUM_SHIPS
      ) {
        return;
      }

      if(this.ufoPool.countLiving() >= this.ufoConstants.MAX_SHIPS_IN_SCREEN) {
        return;
      }

      SpaceWars.Ufos.drawOneUfo(this);
      this.gameDataState.incrUfosCreated();
    },

    updateUfoDamage: function(ufo, stage) {
      ufo.damageCount += 1;
      console.log(ufo.damageCount, UFO_MAX_DAMAGE)
      if(ufo.damageCount >= UFO_MAX_DAMAGE) {
        stage.gameDataState.incrUfosKilled();
        ufo.kill();
        stage.enemyHitSound.play();
      }
    },

    laserHitPlayer: function(player, laser) {
      SpaceWars.Impacts.showPlayerImpactByEnemy(this, player);
      SpaceWars.PlayerShip.updatePlayerDamage(player, this);
      laser.kill();
    }

  };


})();