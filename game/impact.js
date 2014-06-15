// code for impacts

var SpaceWars = SpaceWars || {};

(function(){

  SpaceWars.Impacts = {

    loadAssets: function(stage) {

      stage.game.load.image(
        'enemyImpact',
        'assets/images/lasers/laserBlueImpact.png'
      );
      stage.game.load.image(
        'playerImpact',
        'assets/images/lasers/laserRedImpact.png'
      );

    },

    createImpacts: function(stage) {

      stage.enemyImpactPool = stage.game.add.group();
      for(var i = 0; i < stage.enemyShipConstants.NUM_SHIPS; i += 1) {
        var impact = stage.game.add.sprite(0, 0, 'enemyImpact');
        stage.enemyImpactPool.add(impact);
        impact.kill();
      }

      stage.playerImpactPool = stage.game.add.group();
      for(var i = 0; i < stage.enemyShipConstants.NUM_SHIPS; i += 1) {
        var impact = stage.game.add.sprite(0, 0, 'playerImpact');
        stage.playerImpactPool.add(impact);
        impact.kill();
      }

    },

    showEnemyImpact: function(stage, enemy) {
      
      var impact = stage.enemyImpactPool.getFirstDead();
      if(impact === null || impact === undefined) {
        return;
      }
      impact.revive();
      impact.drawnAt = stage.game.time.now;
      impact.reset(enemy.x, enemy.y);

    },

    showPlayerImpactByEnemy: function(stage, player) {

      var impact = stage.playerImpactPool.getFirstDead();
      if(impact === null || impact === undefined) {
        return;
      }
      impact.revive();
      impact.drawnAt = stage.game.time.now;
      impact.reset(player.x, player.y);      

    },

    clearImpacts: function(stage) {

      // clear enemy impacts
      stage.enemyImpactPool.forEachAlive(function(impact){
        if(stage.game.time.now - impact.drawnAt > 100) {
          impact.kill();
        }
      });

      // clear player impacts
      stage.playerImpactPool.forEachAlive(function(impact){
        if(stage.game.time.now - impact.drawnAt > 100) {
          impact.kill();
        }
      });

    }

  };

})();