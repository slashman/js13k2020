
var discoScene = Scene();
var jungleScene = Scene();
var dancersScene = Scene();

var discoMap = [
  "abababababababababab",
  "babababababababababa",
  "abababababababababab",
  "babababababababababa",
  "abababababababababab",
  "babababababababababa",
  "abababababababababab",
  "babababababababababa",
  "abababababababababab",
  "babababababababababa"
];

var jungleMap = [
  "cccccccccccccccdcccc",
  "cccccccccdcccccecccc",
  "cccccccccecccccccccc",
  "ccdccccccccccccccccc",
  "cceccccccccccccdcccc",
  "cccccccccccccccecccc",
  "ccccccccccccccdccccc",
  "ccccccdccccccceccccc",
  "cccccceccccccccccccc",
  "cccccccccccccccccccc",
];

loadMap(discoMap, discoScene);
loadMap(jungleMap, jungleScene);

jungleScene.active = false;
jungleScene.brightness = 0;


var randomY = [];
for (var i = 0; i < 30; i++) {
  randomY.push(rando(-30, 130));
}
randomY.sort((a, b) => a - b);

var dancingRobots = [];

for (var i = 0; i < 30; i++) {
  var rx = rando(0, 320);
  var ry = randomY[i];
  if (Math.abs(ry - 60) + Math.abs(rx - 100) < 90) { i--; continue; }
  if (Math.abs(ry - 60) + Math.abs(rx - 200) < 90) { i--; continue; }
  var robot = Robot([rx, ry, [], 8, 1], discoScene);
  //robot.rc =; // robot config, [head, arms, torso, sideHead]
  robot.setSprites([dancerHead = rando(0, 4), rando(0, 4), rando(0, 5), dancerHead]);
  robot.bounceOffset = rando(0, 4);
  robot.flipArm(rando(0, 10) > 4);
  var warmBase = randomPastel();
  var base = darker(warmBase);
  var coldBase = darker(base);
  robot.overridePalette(5, coldBase);
  robot.overridePalette(6, base);
  robot.overridePalette(7, warmBase);
  dancingRobots.push(robot);
  discoScene.add(robot);
}

var player = MainCharacter([100, 60, [3, 4], 8, 0]);



//player.rc = ; // robot config, [head, arms, torso, sideHead]
player.setSprites([pcHead = 0, 0, 0, pcHead]);
player.bounceOffset = 0;
dancersScene.add(player);
dancersScene.following = player; // TODO: Remove?

var enemy = Robot([200, 60, [3, 4], 8, 2], dancersScene);
enemy.setSprites([enemyHead = rando(0, 4), rando(0, 4), rando(0, 5), enemyHead]);
enemy.bounceOffset = 3;
dancersScene.add(enemy);

sceneManager.add(discoScene);
sceneManager.add(jungleScene);
sceneManager.add(dancersScene);

paletteRenderer.cyclePaletteIndex(1, 3, ['t57', 'r35', 'p13', 'n01']);
paletteRenderer.cyclePaletteIndex(1, 4, ['vd3', 'tb1', 'r90', 'p70']);
paletteRenderer.cyclePaletteIndex(0, 3, ['1m7', '3o9', '5qb', '7sd']);
paletteRenderer.cyclePaletteIndex(0, 4, ['8u8', '6t6', '4r4', '2p2']);

// The dance floor 💃🕺 --------------------------------------------------------
paletteRenderer.beatPalette(7, 2, ['pet', 'r5t']);
paletteRenderer.tickPalette(7, 3, ['olv', 'pet']);
paletteRenderer.beatPalette(7, 4, ['tqv', 'olv', 'pet', 'r5t']);

paletteRenderer.beatPalette(7, 5, ['scm', 'uko']);
paletteRenderer.tickPalette(7, 6, ['uko', 'vrr']);
paletteRenderer.tickPalette(7, 7, ['vuu', 'vrr', 'uko', 'scm']);

paletteRenderer.beatPalette(7, 1, ['vuu', 'vvv', 'tqv']);

// The GPI ---------------------------------------------------------------------
paletteRenderer.beatPalette(9, 2, ['vuu', '9st', 'i0d', '8u8', 'v9d']);
paletteRenderer.beatPalette(10, 5, ['1m7', '3o9', '5qb', '7sd']);


var danceFrame = 0;
var theBeat = () => {
  if (subState == 0) {
    console.log(current_tick);
    if (current_tick == 16) {
      startSong();
    }
    return;
  }
  danceFrame++;
  if (danceFrame > 9) {
    danceFrame = 0;
  }
  //var toggleBeat = danceFrame % 2 == 0;
  //robot3.x += 6*(toggleBeat?-1:1); 
  //enemy.setPalette(toggleBeat?0:1);
  //if (danceFrame%3 == 0)
  enemy.flipArm(danceFrame % 4 == 0)
  if (danceFrame % 3 == 0) {
    enemy.dash(danceFrame % 2 == 0 ? 1 : -1)
  }

  if (danceFrame % 4 == 0) {
    enemy.turnHead(danceFrame % 3 == 0 ? 1 : -1)
  }
  paletteRenderer.onMetronomeBeat();
}
var theTick = (tick) => {
  hudScene.onMetronomeTick(tick);
  paletteRenderer.onMetronomeTick();
}

const discoIntro = _ => {
  discoScene.active = true;
  dancersScene.active = true;
  dancersScene.fadeIn();
  discoScene.fadeIn();
}

const discoOut = _ => {
  discoScene.active = false;
  dancersScene.active = false;
  dancersScene.fadeOut();
  discoScene.fadeOut();
}

discoOut();

