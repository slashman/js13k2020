
// src/gameSetup.js
// initialize the game
// setup game player, items and main scene

var gameState = 'menu';

var discoScene = Scene();
discoScene.viewport = [0, 0, 500, 500] // Maybe remove
discoScene.limit = [0, 500] // Maybe remove
var jungleScene = Scene();
var dancersScene = Scene();
var uiScene = Scene();

var discoMap = [
  "11111111111111111111",
  "11111111111111111111",
  "11000000000000000011",
  "11000000000000000011",
  "11000000000000000011",
  "11000000000000000011",
  "11000000000000000011",
  "11000000000000000011",
  "11111111111111111111",
  "11111111111111111111"
];

var jungleMap = [
  "22222222222222222222",
  "22222222222222222222",
  "22222222222222222222",
  "22322222222222222222",
  "22422222222222232222",
  "22522222222222242222",
  "22222222222222252222",
  "22222222222222222222",
  "22222222222222222222",
  "22222222222222222222",
];

var indexToSprite = [ // Maps the map above to sprite and palette indexes 
  { sprite: 7, palette: 3 },
  { sprites: [{ sprite: 16, palette: 3 }, { sprite: 32, palette: 4 }] },
  { sprite: 40, palette: 5 },
  { sprite: 33, palette: 5 },
  { sprite: 33+8, palette: 5 },
  { sprite: 33+16, palette: 5 }
];

var scale = 1;

function loadMap(map, scene) {
  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      var char = map[y].charAt(x);
      var spriteData = indexToSprite[parseInt(char, 10)];
      if (!spriteData.sprites) {
        spriteData = [spriteData];
      } else {
        spriteData = spriteData.sprites;  
      }
      spriteData.forEach(sd => {
        var obj = GameObject([(SIXTEEN * scale) * x, (SIXTEEN * scale) * y, [sd.sprite], i+3, sd.palette]);
        scene.add(obj);
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
  robot.rc = [dancerHead = rando(0, 4), rando(0, 4), rando(0, 5), dancerHead]; // robot config, [head, arms, torso, sideHead]
  robot.setSprites();
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
player.rc = [pcHead = 0, 0, 0, pcHead]; // robot config, [head, arms, torso, sideHead]
player.setSprites();
player.bounceOffset = 0;
dancersScene.add(player);
dancersScene.following = player; // TODO: Remove?

var enemy = Robot([200, 60, [3, 4], 8, 2], dancersScene);
enemy.rc = [enemyHead = rando(0, 4), rando(0, 4), rando(0, 5), enemyHead];
enemy.setSprites();
enemy.bounceOffset = 3;
dancersScene.add(enemy);

var seq = sequenceVisualizer({ x: 0, instrument: 0 });
uiScene.add(seq);
console.log('seq visualizer')
console.log(seq )
sceneManager.add(discoScene);
sceneManager.add(jungleScene);
sceneManager.add(dancersScene);
sceneManager.add(uiScene);

paletteRenderer.cyclePaletteIndex(1, 3, ["#e82b3b", "#d81b2b", "#c80b1b", "#b8000b"]);
paletteRenderer.cyclePaletteIndex(1, 4, ["#fb6b1d", "#eb5b0d", "#db4b00", "#cb3b00"]);
paletteRenderer.cyclePaletteIndex(0, 3, ["#08b23b", "#18c24b", "#28d25b", "#38e26b"]);
paletteRenderer.cyclePaletteIndex(0, 4, ["#47f641", "#37ef31", "#27df21", "#17cf11"]);

var danceFrame = 0;
var theBeat = () => {
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

}


var buffer = zzfxM(...deepMX);    // Generate the sample data
const startSong = _ => {
  gameState = 'play';
  startTime = null;
  current_tick = -1;
  player.combo = 0;
  player.focus = 0;
  player.score = 0;
  player.stats = {};
  player.maxCombo = 0;
  var node = zzfxP(...buffer);
  setTimeout(() => discoScene.fadeOut(), 4000);
  setTimeout(() => { jungleScene.active = true; discoScene.active = false; jungleScene.fadeIn();}, 6000);
  setTimeout(() => jungleScene.fadeOut(), 8000);
  setTimeout(() => { jungleScene.active = false; discoScene.active = true; discoScene.fadeIn();}, 10000);
  node.start();
  playingMusic = true;
  past = Date.now();
  updateMetronome();
  console.log(node);
  node.onended = _ => {
    playingMusic = false;
    gameState = 'menu';
  };
}

