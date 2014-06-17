// global game variable
var SpaceWars = SpaceWars || {};

(function(){

  SpaceWars.Sound = {

    loadAssets: function(stage) {
      stage.game.load.audio('bgMusic1', 'assets/sounds/bg/1.wav');
      stage.game.load.audio('bgMusic2', 'assets/sounds/bg/2.wav');
      stage.game.load.audio('bgMusic3', 'assets/sounds/bg/3.wav');
      stage.game.load.audio('enemyHitSound', 'assets/sounds/actions/enemyHit.ogg');
      stage.game.load.audio('laserSound', 'assets/sounds/actions/laser.ogg');
      stage.game.load.audio('alienArrival', 'assets/sounds/actions/alienArrival.wav');
    },

    createMusics: function(stage) {
      stage.bgMusic1 = stage.game.add.audio('bgMusic1', 0.1, true);
      stage.bgMusic2 = stage.game.add.audio('bgMusic2', 0.1, true);
      stage.bgMusic3 = stage.game.add.audio('bgMusic3', 0.1, true);
      stage.enemyHitSound = stage.game.add.audio('enemyHitSound');
      stage.laserSound = stage.game.add.audio('laserSound');
      stage.alienArrival = stage.game.add.audio('alienArrival');
    }

  };

})();