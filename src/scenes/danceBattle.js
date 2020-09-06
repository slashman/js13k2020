
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

paletteRenderer.cyclePaletteIndex(1, 3, ["#e82b3b", "#d81b2b", "#c80b1b", "#b8000b"]);
paletteRenderer.cyclePaletteIndex(1, 4, ["#fb6b1d", "#eb5b0d", "#db4b00", "#cb3b00"]);
paletteRenderer.cyclePaletteIndex(0, 3, ["#08b23b", "#18c24b", "#28d25b", "#38e26b"]);
paletteRenderer.cyclePaletteIndex(0, 4, ["#47f641", "#37ef31", "#27df21", "#17cf11"]);

// The dance floor 💃🕺 --------------------------------------------------------
paletteRenderer.beatPalette(7, 2, ["#CB71EF", "#D82DEB"]);
paletteRenderer.tickPalette(7, 3, ["#C7ADFF", "#CB71EF"]);
paletteRenderer.beatPalette(7, 4, ["#EBD1FF", "#C7ADFF", "#CB71EF", "#D82DEB"]);

paletteRenderer.beatPalette(7, 5, ["#E067B3", "#F4A4C4"]);
paletteRenderer.tickPalette(7, 6, ["#F4A4C4", "#FFDBDF"]);
paletteRenderer.tickPalette(7, 7, ["#FFF6F6", "#FFDBDF", "#F4A4C4", "#E067B3"]);

paletteRenderer.beatPalette(7, 1, ["#FFF6F6", "#FFFFFF", "#EBD1FF"]);

// The GPI ---------------------------------------------------------------------
paletteRenderer.beatPalette(9, 2, ["#FFF6F6", "#49E7EC", "#90006C", "#47F641", "#FF4F69"]);
paletteRenderer.beatPalette(10, 5, ["#08b23b", "#18c24b", "#28d25b", "#38e26b"]);


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

