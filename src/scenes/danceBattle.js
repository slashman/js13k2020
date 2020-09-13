
var discoScene = Scene();
//var jungleScene = Scene();
var dancersScene = Scene();

var discoMap = [
  "abababababab",
  "babababababa",
  "abababababab",
  "babababababa",
  "abababababab",
  "babababababa",
  "abababababab",
  "babababababa",
  "abababababab"
];

/*
var jungleMap = [
  "cccccccccccc",
  "cccccccccccc",
  "cccccccccccc",
  "cccccccccccc",
  "cccccccccccc",
  "cccccccccccc",
  "cccccccccccc",
  "cccccccccccc",
  "cccccccccccc"
];*/

loadMap(discoMap, discoScene);
//loadMap(jungleMap, jungleScene);

//jungleScene.active = false;
//jungleScene.brightness = 0;


var randomY = [];
for (var i = 0; i < 30; i++) {
  randomY.push(rando(-16, 130));
}
randomY.sort((a, b) => a - b);

var dancingRobots = [];

for (var i = 0; i < 12; i++) {
  var rx = rando(-30, 30);
  var ry = randomY[i];
  if (Math.abs(ry - 60) + Math.abs(rx - 100) < 90) { i--; continue; }
  if (Math.abs(ry - 60) + Math.abs(rx - 200) < 90) { i--; continue; }
  var robot = Robot([rx, ry, [], 8, rando(18, 21)], discoScene);
  //robot.rc =; // robot config, [head, arms, torso, sideHead]
  robot.setSprites([dancerHead = rando(0, 4), rando(0, 4), rando(0, 5), dancerHead]);
  robot.bounceOffset = rando(0, 4);
  robot.flipArm(rando(0, 10) > 4);
  dancingRobots.push(robot);
  discoScene.add(robot);
}

partsZoneScene.forEach(dancersScene.add);
var player = MainCharacter([EIGHT*7, THIRTYTWO, [3, 4], 8, 0]);


//player.rc = ; // robot config, [head, arms, torso, sideHead]
player.setSprites([pcHead = 0, 0, 0, pcHead]);
player.bounceOffset = 0;
player.isPC = true;
dancersScene.add(player);
dancersScene.following = player; // TODO: Remove?

var validKeys = [ inputs.F, inputs.D, inputs.S, inputs.J, inputs.K, inputs.L ];
var enemy = Robot([W-EIGHT*7-SIXTEEN, THIRTYTWO, [3, 4], 8, 2], dancersScene);
enemy.setSprites([enemyHead = rando(0, 4), rando(0, 4), rando(0, 5), enemyHead]);
enemy.bounceOffset = 3;
dancersScene.add(enemy);

sceneManager.add(discoScene);
//sceneManager.add(jungleScene);
sceneManager.add(dancersScene);

// cycle palette does somekind of hearthbeat effect
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


var danceFrame = 0;
var prevTickBeat = -1;
var theBeat = _ => {
  if (subState == 0) {
    var nextTickBeat = ~~(current_tick / 4);
    if (prevTickBeat != nextTickBeat) {
      zzfx(...[,30,18,.06,.04,.15,1,1.8,9,-0.6,750,.07,u,.2,u,u,.04,0,.05]);// SFX - GECKO -- countdown
      countdownLabel.setText(['3', '2', '1', 'dance', ''][nextTickBeat]);
      prevTickBeat = nextTickBeat;
    }
    current_tick == 16 && addAnimation(countdownLabel, 'b', 1, 0, 100)&&startSong();
    return;
  }
  
  if (!enemy.guiCommands.inErr) {
    danceFrame++;
    if (danceFrame > 9) danceFrame = 0;
    enemy.flipArm(danceFrame % 4 == 0)
    danceFrame % 3 == 0 && enemy.dash(danceFrame % 2 == 0 ? 1 : -1);
    danceFrame % 4 == 0 && enemy.turnHead(danceFrame % 3 == 0 ? 1 : -1);
    var perforbot = getRandomValue();
    if (perforbot < 0.85) enemy.tryBeat(randoArrel(validKeys)); // do perfect
    else if (perforbot < 0.95) setTimeout(() => enemy.tryBeat(randoArrel(validKeys)), 100); // do good
  }

  paletteRenderer.onMetronomeBeat();
  hudScene.onMetronomeBeat();
}
var theTick = tick => {
  hudScene.onMetronomeTick(tick);
  paletteRenderer.onMetronomeTick();
}

const discoIntro = _ => {
  initHUDpositions();
  discoScene.active = true;
  dancersScene.active = true;
  dancersScene.fadeIn();
  discoScene.fadeIn();
  addAnimation(countdownLabel, 'b', 0, 1, 100);
}

const discoOut = _ => {
  discoScene.active = false;
  dancersScene.active = false;
  dancersScene.fadeOut();
  discoScene.fadeOut();
}

discoOut();
