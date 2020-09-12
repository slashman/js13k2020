
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
    //switch (key) {
     // case :
    if(randomSign()>0) self.dash(nextDash *= -1);
       // break
      //case inputs.S:
    if (randomSign() > 0) self.flipArm(1)
        //break
      //case inputs.L:
    if (randomSign() > 0) self.flipArm(0);
        //break
      //case inputs.D:
    if (randomSign() > 0) self.turnHead(-1);
        //break
      //case inputs.K:
    if (randomSign() > 0) self.turnHead(1);
        //break
    //}
    self.stats[key] = self.stats[key] ? self.stats[key] + 1 : 1;
  }
  self.update = dt => {
    self._update(dt); // Robot
    if (!PlayerCommands.inErr) {
      PlayerCommands.x = self.x+EIGHT-(PlayerCommands.width/2);
      PlayerCommands.y = self.y + THIRTYTWO;
    }
  }
  return self;
}
