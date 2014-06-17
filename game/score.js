// code to update score, health and laser text
var SpaceWars = SpaceWars || {};

(function(){

  SpaceWars.ScoreBoard = {

    create: function(stage) {

      stage.playerHealthCount = stage.game.add.text(
        stage.game.width - 150, 
        20, 
        "Health :    100", {
        font: "20px Arial",
        fill: "#ffffff",
        align: "right"
      });

      stage.playerLaserCount = stage.game.add.text(
        stage.game.width - 150, 
        40, 
        "Laser  :    " + stage.shipConstants.MAX_LASERS, {
        font: "20px Arial",
        fill: "#ffffff",
        align: "right"
      });

    },

    updatePlayerHealth: function(stage, count) {
      stage.playerHealthCount.setText('Health :    ' + count);
    },

    updateLaserCount: function(stage, count) {
      stage.playerLaserCount.setText('Laser  :    ' + count);
    }

  };

})();