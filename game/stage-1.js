// Stage 1 of the game

// global game variable
var SpaceWars = SpaceWars || {};

(function(){

  SpaceWars.Stage1 = function(game) {};

  // short hand
  var S1 = SpaceWars.Stage1;

  // load assets
  S1.prototype.preload = function() {

    SpaceWars.PlayerShip.loadAssets(this);

  };

  S1.prototype.create = function() {

    this.game.stage.backgroundColor = 0x333333;

    SpaceWars.PlayerShip.createShip(this);

  };

  S1.prototype.update = function() {

    SpaceWars.PlayerShip.controlShip(this);

  };

})();