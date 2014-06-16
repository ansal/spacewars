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

  // constants
  var ENEMY_MAX_DAMAGE = 10;
  var SHIP_MAX_DAMAGE = 100;
  var METEOR_TINY_MAX_DAMAGE = 1;
  var METEOR_SMALL_MAX_DAMAGE = 2;
  var METEOR_MED_MAX_DAMAGE = 3;
  var METEOR_BIG_MAX_DAMAGE = 4;

  SpaceWars.Stage1 = function(game) {};

  // short hand
  var S1 = SpaceWars.Stage1;

  // load assets
  S1.prototype.preload = function() {

    SpaceWars.PlayerShip.loadAssets(this);
    SpaceWars.EnemyShips.loadAssets(this);
    SpaceWars.Impacts.loadAssets(this);
    SpaceWars.Meteors.loadAssets(this);
    SpaceWars.Bolts.loadAssets(this);
    SpaceWars.Pills.loadAssets(this);
    SpaceWars.BackGround.loadAssets(this);

  };

  S1.prototype.create = function() {

    SpaceWars.BackGround.createBackground(this, 'black');

    SpaceWars.PlayerShip.createShip(this);

    var enemyShipConstants = {
      SPEED: 100,
      NUM_SHIPS: 6,
      SHOT_DELAY: 8000,
      LASER_SPEED: 250,
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

    // timer to add ships
    this.game.time.events.loop(
      Phaser.Timer.SECOND * 5,
      createOneShip,
      this
    );

    // timer to add meteors
    this.game.time.events.loop(
      Phaser.Timer.SECOND * 3,
      createMeteors,
      this
    );   

    // timer to add bolts
    this.game.time.events.loop(
      Phaser.Timer.SECOND * 15,
      createOneBolt,
      this
    );

    // timer to add pills
    this.game.time.events.loop(
      Phaser.Timer.SECOND * 20,
      createOnePill,
      this
    ); 

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
    SpaceWars.Meteors.updateMeteors(this);

    // collisions

    // ship hits enemy ship
    this.game.physics.arcade.collide(
      this.ship,
      this.enemyPool,
      shipHitEnemy,
      null,
      this
    );

    // laser hit enemy
    this.game.physics.arcade.collide(
      this.laserPool,
      this.enemyPool,
      laserHitEnemy,
      null,
      this
    );

    // enemy laser hit player
    this.game.physics.arcade.collide(
      this.enemyLaserPool,
      this.ship,
      laserHitPlayer,
      null,
      this
    );

    // meteor collisions

    // player laser hit tiny meteor

    this.game.physics.arcade.collide(
      this.laserPool,
      this.meteorTinyPool,
      laserHitTinyMeteor,
      null,
      this
    );

    // meteors hit player
    this.game.physics.arcade.collide(
      this.meteorTinyPool,
      this.ship,
      meteorTinyHitPlayer,
      null,
      this
    );

    this.game.physics.arcade.collide(
      this.laserPool,
      this.meteorSmallPool,
      laserHitSmallMeteor,
      null,
      this
    );

    // meteors hit player
    this.game.physics.arcade.collide(
      this.meteorSmallPool,
      this.ship,
      meteorSmallHitPlayer,
      null,
      this
    );

    this.game.physics.arcade.collide(
      this.laserPool,
      this.meteorMedPool,
      laserHitMedMeteor,
      null,
      this
    );

    // meteors hit player
    this.game.physics.arcade.collide(
      this.meteorMedPool,
      this.ship,
      meteorMedHitPlayer,
      null,
      this
    );

    this.game.physics.arcade.collide(
      this.laserPool,
      this.meteorBigPool,
      laserHitBigMeteor,
      null,
      this
    );

    // meteors hit player
    this.game.physics.arcade.collide(
      this.meteorBigPool,
      this.ship,
      meteorBigHitPlayer,
      null,
      this
    );

    // bolt hit player
    this.game.physics.arcade.collide(
      this.boltPool,
      this.ship,
      boltHitPlayer,
      null,
      this
    );

    // pill hit player
    this.game.physics.arcade.collide(
      this.pillPool,
      this.ship,
      pillHitPlayer,
      null,
      this
    );

  };

  function createOneShip() {

    if( this.gameDataState.getEnemiesCreated() >= 
        this.enemyShipConstants.NUM_SHIPS
    ) {
      return;
    }

    if(this.enemyPool.countLiving() >= this.enemyShipConstants.MAX_SHIPS_IN_SCREEN) {
      return;
    }

    SpaceWars.EnemyShips.createOneShip(this);
    this.gameDataState.incrEnemiesCreated();

  }

  function updateEnemyDamage(enemy) {
    enemy.damageCount += 1;
    if(enemy.damageCount >= ENEMY_MAX_DAMAGE) {
      enemy.kill();
    }
  }

  function updatePlayerDamage(player) {
    player.damageCount += 1;
    SpaceWars.ScoreBoard.updatePlayerHealth(stage, 
      100 - player.damageCount
    );
    if(player.damageCount >= SHIP_MAX_DAMAGE) {
      player.kill();
    }
  }

  function laserHitEnemy(laser, enemy) {
    SpaceWars.Impacts.showEnemyImpact(this, enemy);
    updateEnemyDamage(enemy);
    laser.kill();
  }

  function laserHitPlayer(player, laser) {
    SpaceWars.Impacts.showPlayerImpactByEnemy(this, player);
    updatePlayerDamage(player);
    laser.kill();
  }

  function shipHitEnemy(player, enemy) {
    SpaceWars.Impacts.showEnemyImpact(this, enemy);
    SpaceWars.Impacts.showPlayerImpactByEnemy(this, player);
    updatePlayerDamage(player);
    updateEnemyDamage(enemy);
  }

  function createMeteors() {
    SpaceWars.Meteors.createTinyMeteors(this);
    SpaceWars.Meteors.createSmallMeteors(this);
    SpaceWars.Meteors.createMedMeteors(this);
    SpaceWars.Meteors.createBigMeteors(this);
  }

  // meteor collisions

  // tiny meteors

  function updateMeteorTinyDamage(meteor) {
    meteor.damageCount += 1;
    if(meteor.damageCount >= METEOR_TINY_MAX_DAMAGE) {
      meteor.kill();
    }
  }
  function laserHitTinyMeteor(laser, meteor) {
    SpaceWars.Impacts.showEnemyImpact(this, meteor);
    updateMeteorTinyDamage(meteor);
    laser.kill();
  }
  function meteorTinyHitPlayer(player, meteor) {
    SpaceWars.Impacts.showPlayerImpactByEnemy(this, player);
    updatePlayerDamage(player);
    updateMeteorTinyDamage(meteor);  
  }

  // small meteors

  function updateMeteorSmallDamage(meteor) {
    meteor.damageCount += 1;
    if(meteor.damageCount >= METEOR_SMALL_MAX_DAMAGE) {
      meteor.kill();
    }
  }
  function laserHitSmallMeteor(laser, meteor) {
    SpaceWars.Impacts.showEnemyImpact(this, meteor);
    updateMeteorTinyDamage(meteor);
    laser.kill();
  }
  function meteorSmallHitPlayer(player, meteor) {
    SpaceWars.Impacts.showPlayerImpactByEnemy(this, player);
    updatePlayerDamage(player);
    updateMeteorTinyDamage(meteor);  
  }

  // med meteors

  function updateMeteorMedDamage(meteor) {
    meteor.damageCount += 1;
    if(meteor.damageCount >= METEOR_MED_MAX_DAMAGE) {
      meteor.kill();
    }
  }
  function laserHitMedMeteor(laser, meteor) {
    SpaceWars.Impacts.showEnemyImpact(this, meteor);
    updateMeteorTinyDamage(meteor);
    laser.kill();
  }
  function meteorMedHitPlayer(player, meteor) {
    SpaceWars.Impacts.showPlayerImpactByEnemy(this, player);
    updatePlayerDamage(player);
    updateMeteorTinyDamage(meteor);  
  }

  // big meteors

  function updateMeteorBigDamage(meteor) {
    meteor.damageCount += 1;
    if(meteor.damageCount >= METEOR_BIG_MAX_DAMAGE) {
      meteor.kill();
    }
  }
  function laserHitBigMeteor(laser, meteor) {
    SpaceWars.Impacts.showEnemyImpact(this, meteor);
    updateMeteorTinyDamage(meteor);
    laser.kill();
  }
  function meteorBigHitPlayer(player, meteor) {
    SpaceWars.Impacts.showPlayerImpactByEnemy(this, player);
    updatePlayerDamage(player);
    updateMeteorTinyDamage(meteor);  
  }

  // add a bolt to screen
  function createOneBolt() {
    SpaceWars.Bolts.createOneBolt(this);
  }

  function boltHitPlayer(player, bolt) {
    bolt.kill();
    // TODO: some animation here
    player.playerLaserCount += 50;
    if(player.playerLaserCount > 100) {
      player.playerLaserCount = 100;
    }
    SpaceWars.ScoreBoard.updateLaserCount(this, player.playerLaserCount);
  }

  // add a pill to screen
  function createOnePill() {
    SpaceWars.Pills.createOnePill(this);
  }

  function pillHitPlayer(player, pill) {
    pill.kill();
    // TODO: some animation here
    player.damageCount -= 50;
    if(player.damageCount <= 0) {
      player.damageCount = 0;
    }
    SpaceWars.ScoreBoard.updatePlayerHealth(this, 100 - player.damageCount);
  }

})();