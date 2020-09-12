
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
/*

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
*/

var STEPS = [
  {
    name: "wakawaka",
    score: 500,
    steps: [90, 88, 88, 90 ] // TODO: String representation i.e. "ZXXZ"
  },
  {
    name: "egyptian",
    score: 1500,
    poses: [ "E", "E"], // TODO: String representation i.e. "EE" 
    steps: [ 32, 32 ] // TODO: String representation i.e. "  "
  },
  {
    name: "egyptian", // TODO: Handle mirrored poses better
    score: 1500,
    poses: [ "F", "F"], // TODO: String representation i.e. "FF" 
    steps: [ 32, 32 ] // TODO: String representation i.e. "  "
  },
  {
    name: "isis",
    score: 1500,
    poses: [ "E", "B"],
    steps: [ 32, 32 ]
  },
  {
    name: "isis",
    score: 1500,
    poses: [ "B", "E"],
    steps: [ 32, 32 ]
  },
  
  {
    name: "isis",
    score: 1500,
    poses: [ "F", "A"],
    steps: [ 32, 32 ]
  },
  {
    name: "isis",
    score: 1500,
    poses: [ "A", "F"],
    steps: [ 32, 32 ]
  },
  {
    name: "ramses",
    score: 1500,
    poses: [ "E", "F"], // TODO: String representation i.e. "EF" 
    steps: [ 32, 32 ] // TODO: String representation i.e. "  "
  },
  {
    name: "ramses", // ramses II, just mirrored poses
    score: 1500,
    poses: [ "F", "E"], // TODO: String representation i.e. "FE" 
    steps: [ 32, 32 ] // TODO: String representation i.e. "  "
  },
  {
    name: "luli",
    score: 100,
    steps: [32, 32, 32, 32 ] // TODO: String representation i.e. "    "
  }
]
function checkStep (sequence) {
  console.log("poses", sequence);
 // if (sequence.length == 2) debugger;
  var step = STEPS.find(s => 
    JSON.stringify(s.steps) == JSON.stringify(sequence.map(s => s[0]).slice(-s.steps.length)) &&
    (s.poses ? JSON.stringify(s.poses) == JSON.stringify(sequence.map(s => s[1]).slice(-s.steps.length)) : true)
  );
  if (step) {
    console.log(step.name + "!")
    gameTitle.setText(step.name);
  }
}