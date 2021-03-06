
var bpm = 100;
//var time_signature_botton = 4;
//var beat_interval = 60 / bpm * 4 / time_signature_botton;
//var sixteenth_time = beat_interval / 16;
var timeBetweenBeats = 60000/(bpm*4);

var current_tick = -1;
//var sequence = [0, 1, 1, 2, 3, 4, 4]; // from the deep song, should be dynamic I think
var fullBeatSequence = [[], []];
//var fullBeatSequenceB = [];

let startTime = null;

getBeatFor = (time) => {
  return (time - startTime + timeBetweenBeats/2) / (timeBetweenBeats);
}

updateMetronome = () => {
  if (gameState != 2 || subState == 2) return;
  let now = Date.now();
  if (!startTime) {
    startTime = now ;//+ timeBetweenBeats;
    level.sequence.forEach(value => {
      fullBeatSequence[0] = fullBeatSequence[0].concat(deepMX[1][value][1].slice(2));
      fullBeatSequence[1] = fullBeatSequence[1].concat(deepMX[1][value][2].slice(2));
    })
  };
  var currentTickIndex = ~~((now - startTime) / timeBetweenBeats);
  if (current_tick != currentTickIndex) {
    // check if the player miss the last beat
    if (current_tick%4==0 && keyOnBeat.b!=current_tick) player.addFocus(-1);
    current_tick = currentTickIndex;
    onBeat = !(current_tick%4);
    //onBeat = !!fullBeatSequence[current_tick];
    if (onBeat) {
      theBeat();
    };
    theTick(current_tick);
  }
  setTimeout(() => {
    updateMetronome();
  }, 1)
}
