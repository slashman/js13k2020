
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
  Z: 90,
  W: 87, // To support Azerty layout
  X: 88,
  SPACE: 32,
  ENTER: 13,
  ESC: 27,
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
};

var keys = {};
var inputNames = Object.keys(inputs);
for (var i = 0; i < inputNames.length; i++) {
  var inputName = inputNames[i];
  keys[inputs[inputName]] = (1<<i);
}

var keyOnBeat = { beat: -1, performance: 0, pressed: false, rawBeat: -1};
//const lazer = [, , 549, .03, , .15, 1, .99, , -0.7, , , , 2.9, , , .02, .77, .05];
  

document.onkeydown = document.onkeyup = e => {
  var key = e.keyCode||e.which;
  if (!keys[key]) return;
  e.preventDefault();

  //zzfx(...[, , 156, .02, .07, 0, 3, 2.65, -0.6, , 461, .2, , , -4.7, , , , .12]);
  if (e.type[5]) {
    if(!(keyMap & keys[key])) {
     // console.log('alo?')
      if (gameState != 2 && key == inputs.ENTER) {
        handleEnterAction();
        
      } else {
        //if (gameState==2) {
          player.checkInput(key);
          if (subState == 1 && !e.shiftKey) player.tryBeat(key);
          if (subState == 2 && key == inputs.ENTER) {
            console.log(win);
            //loadLevel(wrap(currentLevel + (win?1:0), 4));
            handleEnterAction();
          }
        //}
      }

    }
    //keyMap = keyMap|=keys[key];
  }
  inputs[key] = !!e.type[5];
  
}
