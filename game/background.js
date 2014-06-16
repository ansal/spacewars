// code for background

var SpaceWars = SpaceWars || {};

(function(){

  SpaceWars.BackGround = {

    loadAssets: function(stage) {

      stage.game.load.image('blackBg', 
        'assets/images/backgrounds/black.png');
      stage.game.load.image('purpleBg', 
        'assets/images/backgrounds/purple.png');

    },

    createBackground: function(stage, color) {

      var background = color + 'Bg';
      stage.backgroundPool = stage.game.add.group();
      var numCols = stage.game.width / 256 + 1;
      var numRows = stage.game.height / 256 + 1;
      for(var i = 1, x = 1, j, y; i <= numCols; i += 1) {
        for(j = 1, y = 1; j <= numRows; j += 1) {
          var bg = stage.game.add.sprite(x, y, background);
          stage.backgroundPool.add(bg);
          y += 256;
        }
        x += 256
      }

    }

  };

})();