
var keyMap = 0;
// default keyboard
var inputs = {};
/*var inputs = {
  F: 70,
  D: 68,
  S: 83,
  J: 74,
  K: 75,
  L: 76,
  SPACE: 32,
  ENTER: 13,
  ESC: 27
};*/

var keys = {};
/*var inputNames = Object.keys(inputs);
for (var i = 0; i < inputNames.length; i++) {
  var inputName = inputNames[i];
  keys[inputs[inputName]] = (1<<i);
}*/

var keyOnBeat = { beat: -1, performance: 0, pressed: false, rawBeat: -1};

document.onkeydown = document.onkeyup = e => {
  //console.log(e);
  var key = e.key||e.code;
  e.preventDefault();
  //console.log(key);
  //if (!keys[key]) return;

  if (e.type[5] && !inputs[key]) {
    //if(!(keyMap & keys[key])) {
     // console.log('alo?')
      if (gameState != 2) {
        handleEnterAction();
      } else {
        //if (gameState==2) {
          player.checkInput(key);
          if (subState == 1) player.tryBeat(key);
          if (subState == 2) {
            console.log(win);
            loadLevel(wrap(currentLevel + (win?1:0), 4));
          }
        //}
      //}

    }
    //keyMap = keyMap|=keys[key];
  }
  inputs[key] = !!e.type[5];
  
}
