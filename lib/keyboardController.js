
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
  e.type[5]?keyMap|=keys[key]:keyMap^=keys[key];
  if (e.type[5]) {
    var value = getBeatFor(Date.now());
    var diff = ((~~value) + 0.5 - value)*100;
    var performance = diff*diff;
    keyOnBeat.rawBeat = value;
    keyOnBeat.beat = ~~value;
    keyOnBeat.performance = performance;
    console.log(value, fullBeatSequence[keyOnBeat.beat] ? 'ok' : `${fullBeatSequence[0][keyOnBeat.beat]} ${fullBeatSequence[1][keyOnBeat.beat]}`)
  }
}
