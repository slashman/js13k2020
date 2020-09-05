
var keyMap = 0;
// default keyboard
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

var keyOnBeat = { beat: -1, performance: 0, pressed: false, rawBeat: -1};

document.onkeydown = document.onkeyup = e => {
  var key = e.which;
  if (!keys[key]) return;

  if (e.type[5]){
    if(!(keyMap & keys[key])) {
      if (gameState==2) {
        player.tryBeat(key);
        player.checkInput(key);
      } else if(gameState == 0) {
        if (key == inputs.ENTER) startSong();
      }
    }
    keyMap = keyMap|=keys[key];
  } else {
    keyMap^=keys[key];
  }
}
