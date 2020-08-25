
var keyMap = 0;
// default keyboard
var inputs = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39, 
  PUNCH: 83,
  KICK: 68,
  JUMP: 32,
  ENTER: 13,
  ESC: 27,
  Z: 90,
  X: 88,
  A: 65,
  S: 83
};

var keys = {};
var inputNames = Object.keys(inputs);
for (var i = 0; i < inputNames.length; i++) {
  var inputName = inputNames[i];
  keys[inputs[inputName]] = (1<<i);
}

var keyOnBeat = { beat: -1, performance: 0, pressed: false, rawBeat: -1};

document.onkeydown = document.onkeyup = e => {
  var key = e.which;
  if (!keys[key]) return;
  e.type[5]?keyMap|=keys[key]:keyMap^=keys[key];
  if (e.type[5]) {
    if (key == 90 || key == 88 || key == 65 || key == 83) {
      player.tryBeat(key);
    }
    if (key == 90 || key == 88) {
      player.flipArm(key == 90);
    }
    if (key == 65 || key == 83) {
      player.turnHead(key == 65 ? -1 : 1);
    }
  }
}
