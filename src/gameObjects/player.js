
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
    case inputs.Z: case inputs.W: // AZERTY
      self.flipArm(1)
      break
    case inputs.X:
      self.flipArm(0);
      break
    case inputs.LEFT:
      self.setHead(0);
      break
    case inputs.RIGHT:
      self.setHead(2);
      break
    case inputs.DOWN:
      self.setHead(1);
      break
    case inputs.UP:
      self.setHead(3);
      break
    }
    self.stats[key] = self.stats[key] ? self.stats[key] + 1 : 1;
  }
  self.update = dt => {
    self._update(dt); // Robot
  }
  return self;
}
