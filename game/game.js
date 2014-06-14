// this script starts the game

// global game variable
var SpaceWars = SpaceWars || {};

(function(){

  var game = new Phaser.Game(848, 500, Phaser.AUTO, 'game');
  game.state.add('Stage1', SpaceWars.Stage1, true)

})();