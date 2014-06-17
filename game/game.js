// this script starts the game

// global game variable
var SpaceWars = SpaceWars || {};

(function(){

  // window hieght and width
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

  var game = new Phaser.Game(
    x - 20, 
    y - 20, 
    Phaser.AUTO, 
  'game');

  game.state.add('Intro', SpaceWars.Intro , false);
  game.state.add('LevelSwitch', SpaceWars.LevelSwitch , false);
  game.state.add('LastScene', SpaceWars.LastScene , false);
  game.state.add('PlayerDead', SpaceWars.PlayerDead , false);
  game.state.add('Stage1', SpaceWars.Stage1 , false);
  game.state.add('Stage2', SpaceWars.Stage2 , false);
  game.state.add('Stage3', SpaceWars.Stage3 , false);

  // start with intro
  game.state.start('Intro');


})();