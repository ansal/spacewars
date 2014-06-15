// this script starts the game

// global game variable
var SpaceWars = SpaceWars || {};

(function(){

  var game = new Phaser.Game(
    window.screen.availWidth - 20, 
    window.screen.availHeight - 80, 
    Phaser.AUTO, 
  'game');
  game.state.add('Stage1', SpaceWars.Stage1, true);

})();