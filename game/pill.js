// code for health pill

// global game variable
var SpaceWars = SpaceWars || {};

(function(){

  var MAX_PILLS = 3;
  var PILL_DURATION = 5;

  SpaceWars.Pills= {

    loadAssets: function(stage) {
      stage.game.load.image('healthPill', 
        'assets/images/powerups/pill.png');
    },

    createPills: function(stage) {

      stage.pillPool = stage.game.add.group();
      for(var i = 1; i <= MAX_PILLS; i += 1) {
        var pill = stage.game.add.sprite(0, 0, 'healthPill');
        stage.pillPool.add(pill);
        pill.anchor.setTo(0.5, 0.5);
        stage.game.physics.enable(pill, Phaser.Physics.ARCADE);
        pill.kill();
      }

      // timer to remove pills
      stage.game.time.events.loop(
        Phaser.Timer.SECOND * 1,
        this.clearPills,
        stage
      ); 

    },

    createOnePill: function(stage) {

      var stage = this;
      
      var pill = stage.pillPool.getFirstDead();
      if(pill === null || pill === undefined) {
        return;
      }

      pill.revive();
      pill.drawnAt = stage.game.time.now;
      pill.reset(
        stage.game.rnd.integerInRange(20, stage.game.width),
        stage.game.rnd.integerInRange(20, stage.game.height)
      );

    },

    clearPills: function() {

      var self = this;
      this.pillPool.forEachAlive(function(pill){

        var delta = self.game.time.now - pill.drawnAt;
        if (delta > (PILL_DURATION * 1000) ) {
          pill.kill();
        }

      });

    },

    pillHitPlayer: function(player, pill) {
      pill.kill();
      // TODO: some animation here
      player.damageCount -= 50;
      if(player.damageCount <= 0) {
        player.damageCount = 0;
      }
      SpaceWars.ScoreBoard.updatePlayerHealth(this, 100 - player.damageCount);
    }

  };

})();