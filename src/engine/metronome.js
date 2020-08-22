
var bpm = 125;
var playingMusic = true;
var time_signature_botton = 4;
var beat_interval = 60 / bpm * 4 / time_signature_botton;
var sixteenth_time = beat_interval / 16;

var current_beat = 0;
var current_time = 0;
var current_tick = 0;

var indexBeat = 0;
var indexSequence = 0;
var sequence = [1, 1, 2, 3, 4, 4]; // from the deep song, should be dynamic I think

let past = Date.now();
var updateMetronome = () => {
  let now = Date.now();
  let delta = (now - past)/1000;
  past = now;
  if (!playingMusic) return;
  if (playingMusic && current_time == 0 && current_tick == 0) {
    console.log('Sync')
  }
  current_time += delta
  var next_beat = ~~((current_time + delta / 2) / sixteenth_time)
  current_tick += next_beat
  if (current_tick >= 4) {
    //console.log('pum!', current_tick, delta)
    current_tick -= 4
    current_beat += 1
    // change pattern
    if (current_beat >= 64) {
      current_beat = 0;
      indexSequence +=1;
      // IMPROVE
      if (indexSequence >= sequence.length) {
        indexSequence = 0;
      }
    }
    if (deepMX[1][sequence[indexSequence]][1][2 + current_beat]) {
      theBeat();
    }

    
  }
  if (next_beat >= 1) {
    current_time = current_time - (next_beat * sixteenth_time)
  }
  setTimeout(() => {
    updateMetronome();
  }, 1);
}
