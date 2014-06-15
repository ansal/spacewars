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
  var SHIP_MAX_DAMAGE = 50;

  SpaceWars.Stage1 = function(game) {};

  // short hand
  var S1 = SpaceWars.Stage1;

  // load assets
  S1.prototype.preload = function() {

    SpaceWars.PlayerShip.loadAssets(this);
    SpaceWars.EnemyShips.loadAssets(this);
    SpaceWars.Impacts.loadAssets(this);

  };

  S1.prototype.create = function() {

    this.game.stage.backgroundColor = 0x333333;

    SpaceWars.PlayerShip.createShip(this);

    var enemyShipConstants = {
      SPEED: 200,
      NUM_SHIPS: 10,
      SHOT_DELAY: 1000,
      LASER_SPEED: 500,
      NUM_LASERS: 100
    };
    SpaceWars.EnemyShips.createShips(this, enemyShipConstants);
    this.gameDataState = gameDataState({
      enemyShipConstants: enemyShipConstants
    });

    SpaceWars.Impacts.createImpacts(this);

    // add timer to update movements
    this.game.time.events.loop(
      Phaser.Timer.SECOND * 5,
      createOneShip,
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

  };

  function createOneShip() {

    if( this.gameDataState.getEnemiesCreated() <= 
        this.enemyShipConstants.NUM_SHIPS
    ) {

      SpaceWars.EnemyShips.createOneShip(this);
      this.gameDataState.incrEnemiesCreated();

    }

  }

  function updateEnemyDamage(enemy) {
    enemy.damageCount += 1;
    if(enemy.damageCount >= ENEMY_MAX_DAMAGE) {
      enemy.kill();
    }
  }

  function updatePlayerDamage(player) {
    player.damageCount += 1;
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

})();