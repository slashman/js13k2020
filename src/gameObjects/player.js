
// src/player.js >>>
// basic player stats

var basePlayerStat = {
  maxHp: 30,
  damage: 0,
  defense: 0
};


var MainCharacter = props => {
  var self = Robot(props, dancersScene);
  var nextDash = -1;
  self.checkInput = key => {
    switch (key) {
      case inputs.SPACE:
        self.dash(nextDash *= -1);
        break
      case inputs.S:
        self.flipArm(1)
        break
      case inputs.L:
        self.flipArm(0);
        break
      case inputs.D:
        self.turnHead(-1);
        break
      case inputs.K:
        self.turnHead(1);
        break
    }
  }
  self.update = dt => {
    self._update(dt); // Robot
  }
  return self;
}
