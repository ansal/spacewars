// code for meteors

var SpaceWars = SpaceWars || {};

(function(){

  var METEORS = ['Brown', 'Grey'];
  var METEORS_TYPES = ['big', 'med', 'small', 'tiny'];

  SpaceWars.Meteors = {

    loadAssets: function(stage) {

      for(var i = 0, j; i < METEORS.length; i += 1) {
        // big ones
        for(j = 1; j <= 4; j += 1) {
          stage.game.load.image(
            'meteor' + METEORS[i] + 'Big' + j,
            'assets/images/meteors/meteor' + METEORS[i] + '_' + 'big' + j + '.png'
          );
        }
        // med ones
        for(j = 1; j <= 2; j += 1) {
          stage.game.load.image(
            'meteor' + METEORS[i] + 'Med' + j,
            'assets/images/meteors/meteor' + METEORS[i] + '_' + 'med' + j + '.png'
          );
        }
        // small ones
        for(j = 1; j <= 2; j += 1) {
          stage.game.load.image(
            'meteor' + METEORS[i] + 'Small' + j,
            'assets/images/meteors/meteor' + METEORS[i] + '_' + 'small' + j + '.png'
          );
        }
        // tiny ones
        for(j = 1; j <= 2; j += 1) {
          stage.game.load.image(
            'meteor' + METEORS[i] + 'Tiny' + j,
            'assets/images/meteors/meteor' + METEORS[i] + '_' + 'tiny' + j + '.png'
          );
        }
      }

    },

    createMeteors: function(stage, meteorConstants) {
      stage.meteorConstants = meteorConstants;
      
      stage.meteorBigPool = stage.game.add.group();
      for(var i = 1; i <= stage.meteorConstants.BIG.NUM; i += 1) {
        var meteor = stage.game.add.sprite(
          0,
          0, 
          'meteor' + this.getRandomMeteorType() + 'Big' + this.getRandomMeteorNumber(1, 4)
        );
        stage.meteorBigPool.add(meteor);
        stage.game.physics.enable(meteor, Phaser.Physics.ARCADE);
        meteor.kill();

      }

      stage.meteorMedPool = stage.game.add.group();
      for(var i = 1; i <= stage.meteorConstants.MED.NUM; i += 1) {
        var meteor = stage.game.add.sprite(
          0,
          0, 
          'meteor' + this.getRandomMeteorType() + 'Med' + this.getRandomMeteorNumber(1, 2)
        );
        stage.meteorMedPool.add(meteor);
        stage.game.physics.enable(meteor, Phaser.Physics.ARCADE);
        meteor.kill();
      }

      stage.meteorSmallPool = stage.game.add.group();
      for(var i = 1; i <= stage.meteorConstants.SMALL.NUM; i += 1) {
        var meteor = stage.game.add.sprite(
          0,
          0, 
          'meteor' + this.getRandomMeteorType() + 'Small' + this.getRandomMeteorNumber(1, 2)
        );
        stage.meteorSmallPool.add(meteor);
        stage.game.physics.enable(meteor, Phaser.Physics.ARCADE);
        meteor.kill();
      }

      stage.meteorTinyPool = stage.game.add.group();
      for(var i = 1; i <= stage.meteorConstants.TINY.NUM; i += 1) {
        var meteor = stage.game.add.sprite(
          0,
          0, 
          'meteor' + this.getRandomMeteorType() + 'Tiny' + this.getRandomMeteorNumber(1, 2)
        );
        stage.meteorTinyPool.add(meteor);
        stage.game.physics.enable(meteor, Phaser.Physics.ARCADE);
        meteor.kill();
      }

    },

    updateMeteors: function(stage) {
      
    },

    getRandomMeteorType: function() {
      return METEORS[stage.game.rnd.integerInRange(0, 1)];
    },

    getRandomMeteorNumber: function(x, y) {
      return stage.game.rnd.integerInRange(x, y);
    },

    createTinyMeteors: function(stage) {
      for(var i = 1; i <= stage.meteorConstants.TINY.NUM; i += 1) {
        var meteor = stage.meteorTinyPool.getFirstDead();
        if(meteor === null || meteor === undefined) {
          continue;
        }
        meteor.revive();
        meteor.checkWorldBounds = true;
        meteor.outOfBoundsKill = true;
        meteor.reset(
          stage.game.rnd.integerInRange(
            10, stage.game.width - 10
          ),
          -30
        );
        meteor.damageCount = 0;
        meteor.body.rotation = stage.meteorConstants.TINY.ROTAION;
        meteor.body.velocity.x = stage.meteorConstants.TINY.SPEED;
        meteor.body.velocity.y = stage.meteorConstants.TINY.SPEED;
      }
    },

    createSmallMeteors: function(stage) {
      for(var i = 1; i <= stage.meteorConstants.SMALL.NUM; i += 1) {
        var meteor = stage.meteorSmallPool.getFirstDead();
        if(meteor === null || meteor === undefined) {
          continue;
        }
        meteor.revive();
        meteor.checkWorldBounds = true;
        meteor.outOfBoundsKill = true;
        meteor.reset(
          stage.game.rnd.integerInRange(
            10, stage.game.width - 10
          ),
          stage.game.height - 30
        );
        meteor.damageCount = 0;
        meteor.body.rotation = stage.meteorConstants.SMALL.ROTAION;
        meteor.body.velocity.x = -stage.meteorConstants.SMALL.SPEED;
        meteor.body.velocity.y = -stage.meteorConstants.SMALL.SPEED;
      }
    },

    createMedMeteors: function(stage) {
      for(var i = 1; i <= stage.meteorConstants.MED.NUM; i += 1) {
        var meteor = stage.meteorMedPool.getFirstDead();
        if(meteor === null || meteor === undefined) {
          continue;
        }
        meteor.revive();
        meteor.checkWorldBounds = true;
        meteor.outOfBoundsKill = true;
        meteor.reset(
          stage.game.rnd.integerInRange(
            10, stage.game.width - 10
          ),
          -30
        );
        meteor.damageCount = 0;
        meteor.body.rotation = stage.meteorConstants.MED.ROTAION;
        meteor.body.velocity.x = stage.meteorConstants.MED.SPEED;
        meteor.body.velocity.y = stage.meteorConstants.MED.SPEED;
      }
    },

    createBigMeteors: function(stage) {
      for(var i = 1; i <= stage.meteorConstants.BIG.NUM; i += 1) {
        var meteor = stage.meteorBigPool.getFirstDead();
        if(meteor === null || meteor === undefined) {
          continue;
        }
        meteor.revive();
        meteor.checkWorldBounds = true;
        meteor.outOfBoundsKill = true;
        meteor.reset(
          stage.game.rnd.integerInRange(
            10, stage.game.width - 10
          ),
          stage.game.height - 30
        );
        meteor.damageCount = 0;
        meteor.body.velocity.x = -stage.meteorConstants.BIG.SPEED;
        meteor.body.velocity.y = -stage.meteorConstants.BIG.SPEED;
      }
    }

  };

})();