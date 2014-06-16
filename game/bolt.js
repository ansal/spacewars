// code for laser bolt

// global game variable
var SpaceWars = SpaceWars || {};

(function(){

  var MAX_BOLTS = 5;
  var BOLT_DURATION = 6;

  SpaceWars.Bolts= {

  loadAssets: function(stage) {
    stage.game.load.image('laserBolt', 
      'assets/images/powerups/bolt.png');
  },

  createBolts: function(stage) {

    stage.boltPool = stage.game.add.group();
    for(var i = 1; i <= MAX_BOLTS; i += 1) {
      var bolt = stage.game.add.sprite(0, 0, 'laserBolt');
      stage.boltPool.add(bolt);
      bolt.anchor.setTo(0.5, 0.5);
      stage.game.physics.enable(bolt, Phaser.Physics.ARCADE);
      bolt.kill();
    }

    // timer to add bolts
    stage.game.time.events.loop(
      Phaser.Timer.SECOND * 1,
      this.clearBolts,
      stage
    ); 

  },

  createOneBolt: function(stage) {
    
    var bolt = stage.boltPool.getFirstDead();
    if(bolt === null || bolt === undefined) {
      return;
    }

    bolt.revive();
    bolt.drawnAt = stage.game.time.now;
    bolt.reset(
      stage.game.rnd.integerInRange(20, stage.game.width),
      stage.game.rnd.integerInRange(20, stage.game.height)
    );

  },

  clearBolts: function() {

    var self = this;
    this.boltPool.forEachAlive(function(bolt){

      var delta = self.game.time.now - bolt.drawnAt;
      if (delta > (BOLT_DURATION * 1000) ) {
        bolt.kill();
      }

    });

  }

  };

})();