// Stage 3 of the game

// global game variable
var SpaceWars = SpaceWars || {};

(function(){

  // game state constructor
  function gameDataState(data) {

    var that = {};

    var enemiesCreated = 0;
    var enemiesKilled = 0;
    var numEnemyShips = data.enemyShipConstants.NUM_SHIPS;

    var ufosCreated = 0;
    var ufosKilled = 0;

    that.getEnemiesCreated = function() {
      return enemiesCreated;
    };

    that.incrEnemiesCreated = function() {
      enemiesCreated += 1;
      return enemiesCreated;
    };

    that.getEnemiesKilled = function() {
      return enemiesKilled;
    };

    that.incrEnemiesKilled = function() {
      enemiesKilled += 1;
      return enemiesKilled;
    }

    that.getUfosCreated = function() {
      return ufosCreated;
    };

    that.incrUfosCreated = function() {
      ufosCreated += 1;
      return ufosCreated;
    };

    that.getUfosKilled = function() {
      return ufosKilled;
    };

    that.incrUfosKilled = function() {
      ufosKilled += 1;
      return ufosKilled;
    }

    return that;
  }

  SpaceWars.Stage3 = function(game) {};

  // short hand
  var S1 = SpaceWars.Stage3;

  // load assets
  S1.prototype.preload = function() {

    SpaceWars.PlayerShip.loadAssets(this);
    SpaceWars.EnemyShips.loadAssets(this);
    SpaceWars.Ufos.loadAssets(this);
    SpaceWars.Impacts.loadAssets(this);
    SpaceWars.Meteors.loadAssets(this);
    SpaceWars.Bolts.loadAssets(this);
    SpaceWars.Pills.loadAssets(this);
    SpaceWars.BackGround.loadAssets(this);
    SpaceWars.Sound.loadAssets(this);

  };

  S1.prototype.create = function() {

    SpaceWars.BackGround.createBackground(this, 'black');

    SpaceWars.PlayerShip.createShip(this);

    var enemyShipConstants = {
      SPEED: 400,
      NUM_SHIPS: 16,
      SHOT_DELAY: 2000,
      LASER_SPEED: 400,
      NUM_LASERS: 100,
      MAX_SHIPS_IN_SCREEN: 4
    };
    SpaceWars.EnemyShips.createShips(this, enemyShipConstants);

    var ufoConstants = {

      SPEED: 150,
      ANGLE_SPEED: 1,
      NUM_SHIPS: 6,
      SHOT_DELAY: 500,
      LASER_SPEED: 500,
      NUM_LASERS: 200,
      MAX_SHIPS_IN_SCREEN: 3,
      MAX_ENEMY_KILLED_TO_APPEAR: 10

    };
    SpaceWars.Ufos.createUfos(this, ufoConstants);
    SpaceWars.Impacts.createImpacts(this);

    this.gameDataState = gameDataState({
      enemyShipConstants: enemyShipConstants,
      ufoConstants: ufoConstants
    });

    var meteorConstants = {
      BIG: {
        NUM: 2,
        SPEED: 15
      },
      MED: {
        NUM: 3,
        SPEED: 20
      },
      SMALL: {
        NUM: 4,
        SPEED: 25
      },
      TINY: {
        NUM: 5,
        SPEED: 30
      }
    };
    SpaceWars.Meteors.createMeteors(this, meteorConstants);

    SpaceWars.ScoreBoard.create(this);

    SpaceWars.Bolts.createBolts(this);

    SpaceWars.Pills.createPills(this);

    // timer to check whether level is cleared or not
    this.game.time.events.loop(
      Phaser.Timer.SECOND,
      checkLevelCleared,
      this
    );

    // timer to add ships
    this.game.time.events.loop(
      Phaser.Timer.SECOND * 5,
      SpaceWars.EnemyShips.createOneShip,
      this
    );

    // timer to add meteors
    this.game.time.events.loop(
      Phaser.Timer.SECOND * 3,
      SpaceWars.Meteors.drawMeteors,
      this
    );   

    // timer to add bolts
    this.game.time.events.loop(
      Phaser.Timer.SECOND * 12,
      SpaceWars.Bolts.createOneBolt,
      this
    );

    // timer to add pills
    this.game.time.events.loop(
      Phaser.Timer.SECOND * 15,
      SpaceWars.Pills.createOnePill,
      this
    ); 

    // timer to add ufos
    this.game.time.events.loop(
      Phaser.Timer.SECOND * 5,
      SpaceWars.Ufos.createOneUfo,
      this
    );

    // play bg music
    SpaceWars.Sound.createMusics(this);
    this.bgMusic3.play();

  };

  S1.prototype.update = function() {

    // clear all laser impacts
    SpaceWars.Impacts.clearImpacts(this);

    if(!this.ship.alive) {
      console.log('Get another ship');
      return;
    }

    var self = this;

    SpaceWars.PlayerShip.controlShip(this);
    SpaceWars.EnemyShips.updateShips(this);
    SpaceWars.Ufos.updateUfos(this);
    SpaceWars.Meteors.updateMeteors(this);

    // collisions

    // ship hits enemy ship
    this.game.physics.arcade.collide(
      this.ship,
      this.enemyPool,
      SpaceWars.PlayerShip.shipHitEnemy,
      null,
      this
    );

    // laser hit enemy
    this.game.physics.arcade.collide(
      this.laserPool,
      this.enemyPool,
      SpaceWars.PlayerShip.laserHitEnemy,
      null,
      this
    );

    // enemy laser hit player
    this.game.physics.arcade.collide(
      this.enemyLaserPool,
      this.ship,
      SpaceWars.EnemyShips.laserHitPlayer,
      null,
      this
    );

    // ship hits ufo
    this.game.physics.arcade.collide(
      this.ship,
      this.ufoPool,
      SpaceWars.PlayerShip.shipHitUfo,
      null,
      this
    );

    // laser hit ufo
    this.game.physics.arcade.collide(
      this.laserPool,
      this.ufoPool,
      SpaceWars.PlayerShip.laserHitUfo,
      null,
      this
    );

    // ufo laser hit player
    this.game.physics.arcade.collide(
      this.ufoLaserPool,
      this.ship,
      SpaceWars.Ufos.laserHitPlayer,
      null,
      this
    );

    // meteor collisions

    // player laser hit tiny meteor

    this.game.physics.arcade.collide(
      this.laserPool,
      this.meteorTinyPool,
      SpaceWars.Meteors.laserHitTinyMeteor,
      null,
      this
    );

    // meteors hit player
    this.game.physics.arcade.collide(
      this.meteorTinyPool,
      this.ship,
      SpaceWars.Meteors.meteorTinyHitPlayer,
      null,
      this
    );

    this.game.physics.arcade.collide(
      this.laserPool,
      this.meteorSmallPool,
      SpaceWars.Meteors.laserHitSmallMeteor,
      null,
      this
    );

    // meteors hit player
    this.game.physics.arcade.collide(
      this.meteorSmallPool,
      this.ship,
      SpaceWars.Meteors.meteorSmallHitPlayer,
      null,
      this
    );

    this.game.physics.arcade.collide(
      this.laserPool,
      this.meteorMedPool,
      SpaceWars.Meteors.laserHitMedMeteor,
      null,
      this
    );

    // meteors hit player
    this.game.physics.arcade.collide(
      this.meteorMedPool,
      this.ship,
      SpaceWars.Meteors.meteorMedHitPlayer,
      null,
      this
    );

    this.game.physics.arcade.collide(
      this.laserPool,
      this.meteorBigPool,
      SpaceWars.Meteors.laserHitBigMeteor,
      null,
      this
    );

    // meteors hit player
    this.game.physics.arcade.collide(
      this.meteorBigPool,
      this.ship,
      SpaceWars.Meteors.meteorBigHitPlayer,
      null,
      this
    );

    // bolt hit player
    this.game.physics.arcade.collide(
      this.boltPool,
      this.ship,
      SpaceWars.Bolts.boltHitPlayer,
      null,
      this
    );

    // pill hit player
    this.game.physics.arcade.collide(
      this.pillPool,
      this.ship,
      SpaceWars.Pills.pillHitPlayer,
      null,
      this
    );

  };

  // check whether a level is cleared or not by checking number of enemies -
  // killed vs total number of enemies in this level
  function checkLevelCleared() {

    var numEnemies = this.enemyShipConstants.NUM_SHIPS;
    var numEnemiesKilled = this.gameDataState.getEnemiesKilled();
    var numUfos = this.ufoConstants.NUM_SHIPS;
    var numUfosKilled = this.gameDataState.getUfosKilled();

    if(numEnemiesKilled >= numEnemies &&
        numUfosKilled >= numUfos
      ) {
      this.bgMusic3.stop();
      this.game.state.start('LastScene');
    }

  }

})();