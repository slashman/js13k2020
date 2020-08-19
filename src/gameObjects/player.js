
// src/player.js >>>
// basic player stats

var basePlayerStat = {
  maxHp: 30,
  damage: 0,
  defense: 0
};


var MainCharacter = props => {
  var self = Robot(props);
  var speed = 100;
  self.update = dt => {
    self._update(dt); // Robot
    var v = {x:0.0, y:0.0};
    if (keyMap & keys[inputs.LEFT])  v.x = -1.0;
    if (keyMap & keys[inputs.RIGHT]) v.x =  1.0;
    if (keyMap & keys[inputs.UP])    v.y = -1.0;
    if (keyMap & keys[inputs.DOWN])  v.y =  1.0;
    v = normalize(v);
    self.x += v.x*dt*speed;
    self.y += v.y*dt*speed;
    self.x = self.x > 484 ? 484 : self.x < 0 ? 0 : self.x;
    self.y = self.y > 200 ? 200 : self.y < 0 ? 0 : self.y;
  }
  return self;
}
