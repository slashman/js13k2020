
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
  X: 88
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
  if (e.type[5] && (key == 90 || key == 88)) {
    player.tryBeat(key);
  }
}
