
// src/player.js >>>
// basic player stats

var basePlayerStat = {
  maxHp: 30,
  damage: 0,
  defense: 0
};


var MainCharacter = props => {
  var self = Robot(props);
  self.update = dt => {
    if (keyMap & keys[inputs.LEFT])  self.dash(-1);
    if (keyMap & keys[inputs.RIGHT]) self.dash(1);
    /*if (keyMap & keys[inputs.UP])    self.v.y = -1.0;
    if (keyMap & keys[inputs.DOWN])  self.v.y =  1.0;*/
    self._update(dt); // Robot
  }
  return self;
}
