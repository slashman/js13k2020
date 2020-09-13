
var keyMap = 0;
// default keyboard
var inputs = {};
var inputs = {
  F: 70,
  D: 68,
  S: 83,
  J: 74,
  K: 75,
  L: 76,
  SPACE: 32,
  ENTER: 13,
  ESC: 27
};

var keys = {};
var inputNames = Object.keys(inputs);
for (var i = 0; i < inputNames.length; i++) {
  var inputName = inputNames[i];
  keys[inputs[inputName]] = (1<<i);
}

var keyOnBeat = { b: -1, p: 0, r: -1};

document.onkeydown = document.onkeyup = e => {
  var key = e.keyCode||e.which;
  if (!keys[key] || inputLocked) return;
  e.preventDefault();

  if (e.type[5] && !(keyMap & keys[key])) {
    if (gameState != 2 && key == inputs.ENTER) {
      handleEnterAction(); 
    } else {
      player.checkInput(key);
      if (subState == 1 && !player.guiCommands.inErr) player.tryBeat(key);
      if (subState == 2 && key == inputs.ENTER) handleEnterAction();
    }
  }
  inputs[key] = !!e.type[5];
};
