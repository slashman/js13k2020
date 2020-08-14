
// src/sfx.js
// define all sound effects
// the frequency is the sixth value index 5

// mutates changes a base sound pitch to make it less repetitive
// sound: sfx configuration
// totalMutation: number of mutations to be generated
function mutates(sound, totalMutations) {
  var sounds = [];
  for (var i = 0; i < totalMutations; i++) {
    var newSound = sound.slice();
    newSound[5] = (i-totalMutations/2)*0.05 + sound[5];
    sounds.push(audio(newSound))
  }
  return sounds;
}

// how to use it:
// declare a base sound configuration
// var basePunchSound = [3,0.38,0.26,0.33,0.81,0.2,0.09,0.62,-0.6799,0.06,0.87,,0.67,0.42,-0.324,,-0.86,-0.88,0.33,-0.78,0.2,0.29,-0.64,0.6];
// generate different variations using mutates
// var punchSounds = mutates(basePunchSound, 3);

//var powerup = audio([1,,0.3504,,0.3541,0.385,,0.2852,,,,,,,,0.6757,,,1,,,,,0.5]);

