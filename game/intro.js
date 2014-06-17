// global game variable
var SpaceWars = SpaceWars || {};

(function(){

  SpaceWars.Intro = function(game) {};

  var Intro = SpaceWars.Intro;

  Intro.prototype.preload = function() {

    this.game.load.image('playerShip', 
        'assets/images/ships/playerShip.png');
    this.game.load.image('blackBg', 
        'assets/images/backgrounds/black.png');

  };

  Intro.prototype.create= function() {

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
      this.game.world.centerX - 200, 
      this.game.world.centerY,
      "SPACE WARS", {
      font: "60px Helvetica",
      fill: "#ffffff",
      align: "center"
    });

    this.gameSubTitleText = this.game.add.text(
      this.game.world.centerX - 240, 
      this.game.world.centerY + 70,
      "Guide your ship out of this bad, bad, really bad world!", {
      font: "20px Helvetica",
      fill: "#ffffff",
      align: "center"
    });

    this.gameInfoText = this.game.add.text(
      this.game.world.centerX - 240, 
      this.game.world.centerY + 150,
      "PRESS SPACE BAR TO START!!!", {
      font: "30px Helvetica",
      fill: "green",
      align: "center"
    });

  };

  Intro.prototype.update = function() {

    this.ship.angle += 1;

    if(this.isSpaceKeyDown()) {
      this.game.state.start('Stage1');
    }

  };

  Intro.prototype.isSpaceKeyDown = function() {

    return this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);

  };



})();