// global game variable
var SpaceWars = SpaceWars || {};

(function(){

  SpaceWars.LevelSwitch = function(game) {};

  var LevelSwitch = SpaceWars.LevelSwitch;

  LevelSwitch.prototype.preload = function() {

    this.game.load.image('playerShip', 
        'assets/images/ships/playerShip.png');
    this.game.load.image('blackBg', 
        'assets/images/backgrounds/black.png');

  };

  LevelSwitch.prototype.create= function() {

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
      this.game.world.centerX - 240, 
      this.game.world.centerY,
      SpaceWars.levelSwitchData.text, {
      font: "60px Helvetica",
      fill: "#ffffff",
      align: "center"
    });

    this.gameSubTitleText = this.game.add.text(
      this.game.world.centerX - 180, 
      this.game.world.centerY + 70,
      SpaceWars.levelSwitchData.info, {
      font: "20px Helvetica",
      fill: "green",
      align: "center"
    });

  };

  LevelSwitch.prototype.update = function() {

    this.ship.angle += 1;

    if(this.isSpaceKeyDown()) {
      this.game.state.start(SpaceWars.levelSwitchData.level);
    }

  };

  LevelSwitch.prototype.isSpaceKeyDown = function() {

    return this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
            this.game.input.activePointer.isDown;

  };



})();