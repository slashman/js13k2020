
var bpm = 120;
var playingMusic = true;
//var time_signature_botton = 4;
//var beat_interval = 60 / bpm * 4 / time_signature_botton;
//var sixteenth_time = beat_interval / 16;
var timeBetweenBeats = 60000/(bpm*4);

var current_tick = -1;
var sequence = [0, 1, 1, 2, 3, 4, 4]; // from the deep song, should be dynamic I think
var fullBeatSequence = [[], []];
//var fullBeatSequenceB = [];

let past = Date.now();
let startTime = null;

getBeatFor = (time) => {
  console.log('time for beat', (time - startTime));
  return (time - startTime + timeBetweenBeats/2) / (timeBetweenBeats);
}

updateMetronome = () => {
  if (!playingMusic) return;
  let now = Date.now();
  if (!startTime) {
    startTime = now ;//+ timeBetweenBeats;
    sequence.forEach(value => {
      fullBeatSequence[0] = fullBeatSequence[0].concat(deepMX[1][value][1].slice(2));
      fullBeatSequence[1] = fullBeatSequence[1].concat(deepMX[1][value][2].slice(2));
    })
  };
  var currentTickIndex = ~~((now - startTime) / timeBetweenBeats);
  if (current_tick != currentTickIndex) {
    current_tick = currentTickIndex;
    onBeat = !(current_tick%4);
    //onBeat = !!fullBeatSequence[current_tick];
    if (onBeat) {
      theBeat()
    };
  }
  setTimeout(() => {
    updateMetronome();
  }, 1)
}
