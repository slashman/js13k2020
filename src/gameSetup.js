
// src/gameSetup.js
// initialize the game
// setup game player, items and main scene

/**
 * GAME STATE possible values
 * intro = 0
 * enemy intro = 1
 * play - song = 2
 * results = 3
 * end = 4
*/
var gameState = 0;

/**
 * GAME SUB STATE
 * countdown: 0
 * playing song: 1
 * end song: 2
*/
var subState = 0;

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

// The mirror property will be used to draw another sprite in front of the one
// that needs to be mirrored. Something like what we do for the robotz heads.
var gpiBoard = {sprite: 27, palette: 9, small: true, mirror: true}
var gpiMap = [
  "fffffffffhhfffffffff",
  "ggggggggghhggggggggg",
]

var indexToSprite = { // Maps the map above to sprite and palette indexes 
  a: { sprite: 32, palette: 7 },
  b: { sprite: 33, palette: 7 },
  c: { sprites: [{ sprite: 41, palette: 8 }, { sprite: 41+8, palette: 8 }] },
  d: { sprite: 40, palette: 8 },
  e: { sprite: 40+8, palette: 8 },
  // GPI: Graphic Player Interface
  f: { ...gpiBoard, vFlip: true },
  g: { ...gpiBoard },
  h: { parts: {sprites: [6,7,6+8,7+8], palette: 9, partIdx:0} },
};

function createComplements(obj, complements = ['tr','bl','br'], small = true) {
  var offsets = {
    tl: [0, 0, false], tr: [8, 0, false], bl: [0, 26, true], br: [8, 26, true]
  }
  var parts = []

  complements.forEach(k => {
    var p = GameObject([
      obj.x + offsets[k][0], obj.y + offsets[k][1],
      obj.frames, obj.frameRate,
      obj.paletteIndex
    ])
    p.offsetX = offsets[k][0]
    p.offsetY = offsets[k][1]
    p.small = small
    p.flipped = k === 'tr' || k === 'br'
    p.vFlip = obj.vFlip || (k === 'bl' || k === 'br')
    parts.push(p)
  })

  return parts
}

function loadMap(map, scene, offset = {x: 0, y: 0}) {
  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      var char = map[y].charAt(x);
      var spriteData = indexToSprite[char];
      if (spriteData.parts) {
        spriteData = [{...spriteData.parts, sprite: spriteData.parts.sprites[spriteData.parts.partIdx++]}]
      } else if (!spriteData.sprites) {
        spriteData = [spriteData];
      } else {
        spriteData = spriteData.sprites;  
      }
      spriteData.forEach(sd => {
        var obj = GameObject([SIXTEEN * (x + offset.x), SIXTEEN * (y + offset.y), [sd.sprite], i+3, sd.palette]);
        obj.small = sd.small || false
        obj.vFlip = sd.vFlip || false
        if (obj.vFlip) obj.y += 10
        scene.add(obj);

        // Draw a mirrored object in front of the created one (like with the
        // heads) --------------------------------------------------------------
        // TODO: There should be a better way to do this for sure
        if (sd.mirror) {
          createComplements(obj,['tr']).forEach(p => scene.add(p))
        }
        // ---------------------------------------------------------------------
      });
    }
  }
}

loadMap(discoMap, discoScene);
loadMap(jungleMap, jungleScene);

jungleScene.active = false;
jungleScene.brightness = 0;

var randomY = [];
for (var i = 0; i < 30; i++) {
  randomY.push(rando(-30, 130));
}
randomY.sort((a,b) => a-b);

var dancingRobots = [];

for (var i = 0; i < 30; i++) {
  var rx = rando(0, 320);
  var ry = randomY[i];
  if (Math.abs(ry - 60) + Math.abs(rx - 100) < 90) { i--; continue;}
  if (Math.abs(ry - 60) + Math.abs(rx - 200) < 90) { i--; continue;}
  var robot = Robot([rx, ry, [], 8, 1], discoScene);
  //robot.rc =; // robot config, [head, arms, torso, sideHead]
  robot.setSprites([dancerHead = rando(0, 4), rando(0, 4), rando(0, 5), dancerHead]);
  robot.bounceOffset = rando(0,4);
  robot.flipArm(rando(0,10) > 4);
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
  enemy.flipArm(danceFrame%4 == 0)
  if (danceFrame%3 == 0) {
    enemy.dash(danceFrame%2 == 0 ? 1 : -1)
  }

  if (danceFrame%4 == 0) {
    enemy.turnHead(danceFrame%3 == 0 ? 1 : -1)
  }
  paletteRenderer.onMetronomeBeat();
}
var theTick = (tick) => {
  hudScene.onMetronomeTick(tick);
  paletteRenderer.onMetronomeTick();
}


var currentLevel = 99;
var buffer = zzfxM(...deepMX);    // Generate the sample data
level = LEVELS[0];
var song;

const loadLevel = levelIndex => {
  if (levelIndex != currentLevel) {
    currentLevel = levelIndex;
    level = LEVELS[currentLevel];
    enemy.setSprites(level.robot);
    deepMX[2] = level.sequence;
    deepMX[3] = level.bpm;
    bpm = level.bpm;
    timeBetweenBeats = 60000 / (level.bpm * 4);
    buffer = zzfxM(...deepMX);
  }

  gameState = 2;
  subState = 0;
  startTime = null;
  current_tick = -1;
  player.combo = 0;
  player.focus = 0;
  player.score = 0;
  player.stats = {};
  player.maxCombo = 0;
  song = zzfxP(...buffer);
  updateMetronome();
}

const startSong = _ => {
  
  subState = 1;
  setTimeout(() => discoScene.fadeOut(), 4000);
  setTimeout(() => { jungleScene.active = true; discoScene.active = false; jungleScene.fadeIn();}, 6000);
  setTimeout(() => jungleScene.fadeOut(), 8000);
  setTimeout(() => { jungleScene.active = false; discoScene.active = true; discoScene.fadeIn();}, 10000);  
  
  song.start();
  current_tick = -1;
  updateMetronome();

  song.onended = _ => {
    subState = 2;
    //gameState = 0;
    setTimeout(() => {
      gameState = 0;
    }, 1500);
  };

}

