// global game variable
var SpaceWars = SpaceWars || {};

(function(){

  SpaceWars.PlayerDead = function(game) {};

  var PlayerDead = SpaceWars.PlayerDead;

  PlayerDead.prototype.preload = function() {

    this.game.load.image('playerShip', 
        'assets/images/ships/playerShip.png');
    this.game.load.image('blackBg', 
        'assets/images/backgrounds/black.png');

  };

  PlayerDead.prototype.create= function() {

    this.backgroundPool = this.game.add.group();
    var numCols = this.game.width / 256 + 1;
    var numRows = this.game.height / 256 + 1;
    for(var i = 1, x = 1, j, y; i <= numCols; i += 1) {
      for(j = 1, y = 1; j <= numRows; j += 1) {
        var bg = this.game.add.sprite(x, y, 'blackBg');
        this.backgroundPool.add(bg);
        y += 256;
      }
      x += 256
    }

    this.ship = this.game.add.sprite(
      this.game.world.centerX - 200, 
      this.game.world.centerY - 100,
      'playerShip'
    );
    this.ship.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
    this.ship.body.velocity.x = 100;

    this.gameTitleText = this.game.add.text(
      this.game.world.centerX - 300, 
      this.game.world.centerY,
      'Oh No!!! The Ship is Destroyed!!!', {
      font: "40px Helvetica",
      fill: "red",
      align: "center"
    });

    this.gameSubTitleText = this.game.add.text(
      this.game.world.centerX - 290, 
      this.game.world.centerY + 90,
      'Get source code for this game at github.com/ansal/spacewars', {
      font: "20px Helvetica",
      fill: "#ffffff",
      align: "center"
    });

    this.gameInfoText = this.game.add.text(
      this.game.world.centerX - 200, 
      this.game.world.centerY + 130,
      'PRESS SPACEBAR TO PLAY AGAIN', {
      font: "20px Helvetica",
      fill: "green",
      align: "center"
    });

  };

  PlayerDead.prototype.update = function() {

    this.ship.angle += 1;
    if(this.isSpaceKeyDown()) {
      this.game.state.start('Stage1');
    }

  };

  PlayerDead.prototype.isSpaceKeyDown = function() {

    return this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);

  };



})();