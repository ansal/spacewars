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

    SpaceWars.PlayerShip.loadAssets(this);
    SpaceWars.EnemyShips.loadAssets(this);

  };

  S1.prototype.create = function() {

    this.game.stage.backgroundColor = 0x333333;

    SpaceWars.PlayerShip.createShip(this);
    var enemyShipConstants = {
      SPEED: 500,
      NUM_SHIPS: 100,
      SHOT_DELAY: 100,
      LASER_SPEED: 500,
      NUM_LASERS: 100
    };
    SpaceWars.EnemyShips.createShips(this, enemyShipConstants);

    this.gameDataState = gameDataState({
      enemyShipConstants: enemyShipConstants
    });

    // add timer to update movements
    this.game.time.events.loop(
      Phaser.Timer.SECOND * 2,
      createOneShip,
      this
    );

  };

  S1.prototype.update = function() {

    SpaceWars.PlayerShip.controlShip(this);

    SpaceWars.EnemyShips.updateShips(this);

  };

  function createOneShip() {

    if( this.gameDataState.getEnemiesCreated() <= 
        this.enemyShipConstants.NUM_SHIPS
    ) {

      SpaceWars.EnemyShips.createOneShip(this);
      this.gameDataState.incrEnemiesCreated();

    }

  }

})();