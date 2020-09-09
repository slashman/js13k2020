
const LEVELS = [
  { sequence: [0, 1], bpm: 80, score: 6000, robot: [1, 3, 5, 1], moves: []},
  { sequence: [1, 2, 3], bpm: 100, score: 12000, robot: [2, 1, 2, 2], moves: []},
  { sequence: [3, 4, 3, 2], bpm: 120, score: 18000, robot: [5, 0, 3, 5], moves: []},
  { sequence: [3, 4, 3, 2, 3], bpm: 144, score: 20000, robot: [3, 4, 4, 3], moves: []},
  { sequence: [3, 4, 3, 4, 3, 3, 4], bpm: 160, score: 30000, robot: [4, 2, 1, 4], moves: []}
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
