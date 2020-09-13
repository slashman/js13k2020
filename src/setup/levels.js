
const LEVELS = [
  { sequence: [0, 1], bpm: 80, score: 2000, robot: [1, 3, 5, 1],palette:2},
  { sequence: [1, 2, 0], bpm: 100, score: 3000, robot: [2, 1, 2, 2],palette:18},
  { sequence: [3, 1, 3, 2], bpm: 120, score: 4500, robot: [5, 0, 3, 5],palette:19},
  { sequence: [0, 2, 3, 2], bpm: 144, score: 6000, robot: [3, 4, 4, 3],palette:20},
  { sequence: [3, 0, 1, 3, 2], bpm: 160, score: 10000, robot: [4, 2, 1, 4],palette:21}
]


// variations -
// one key  =========
// all equal = 111
// two keys =========
// two and two = 222
// three and one = 333
// three keys =======
// two and one one = 444
// four keys  ======
// four keys = 555

function checkStep (sequence) {
  const map = {};
  for(i in sequence) {
    if (!map[sequence[i]]) map[sequence[i]] = 0;
    map[sequence[i]]++;
  }
  var variations = Object.keys(map).length;
  if (variations>2)variations++;
  if (variations == 2 && map[sequence[0]] != 2) {
    variations += 1;
  }
  return 111*variations; 
}
