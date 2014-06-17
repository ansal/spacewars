// Stage 1 of the game

// global game variable
var SpaceWars = SpaceWars || {};

(function(){

  // game state constructor
  function gameDataState(data) {

    var that = {};

    var enemiesCreated = 0;
    var enemiesKilled = 0;
    var numEnemyShips = data.enemyShipConstants.NUM_SHIPS;

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

    return that;
  }

  SpaceWars.Stage1 = function(game) {};

  // short hand
  var S1 = SpaceWars.Stage1;

  // load assets
  S1.prototype.preload = function() {

    this.loadingText = this.game.add.text(
      this.game.world.centerX - 100, 
      this.game.world.centerY,
      "Loading...", {
      font: "30px Helvetica",
      fill: "#ffffff",
      align: "center"
    });

    SpaceWars.PlayerShip.loadAssets(this);
    SpaceWars.EnemyShips.loadAssets(this);
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
      SPEED: 200,
      NUM_SHIPS: 6,
      SHOT_DELAY: 6000,
      LASER_SPEED: 200,
      NUM_LASERS: 100,
      MAX_SHIPS_IN_SCREEN: 2
    };
    SpaceWars.EnemyShips.createShips(this, enemyShipConstants);
    this.gameDataState = gameDataState({
      enemyShipConstants: enemyShipConstants
    });

    SpaceWars.Impacts.createImpacts(this);

    var meteorConstants = {
      BIG: {
        NUM: 1,
        SPEED: 10
      },
      MED: {
        NUM: 1,
        SPEED: 15
      },
      SMALL: {
        NUM: 1,
        SPEED: 20
      },
      TINY: {
        NUM: 2,
        SPEED: 25
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
      Phaser.Timer.SECOND * 15,
      SpaceWars.Bolts.createOneBolt,
      this
    );

    // timer to add pills
    this.game.time.events.loop(
      Phaser.Timer.SECOND * 20,
      SpaceWars.Pills.createOnePill,
      this
    ); 

    // play bg music
    SpaceWars.Sound.createMusics(this);
    this.bgMusic1.play();

  };

  S1.prototype.update = function() {

    // clear all laser impacts
    SpaceWars.Impacts.clearImpacts(this);

    if(!this.ship.alive) {
      this.bgMusic1.stop();
      this.state.start('PlayerDead');
      return;
    }

    var self = this;

    SpaceWars.PlayerShip.controlShip(this);
    SpaceWars.EnemyShips.updateShips(this);
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

    if(numEnemiesKilled >= numEnemies) {
      this.bgMusic1.stop();
      SpaceWars.levelSwitchData = {
        level: 'Stage2',
        text: 'Level 1 Cleared!!!',
        info: 'PRESS SPACE BAR TO CONTINUE'
      }
      // cleared level one, move to second level
      this.game.state.start('LevelSwitch');
    }

  }

})();