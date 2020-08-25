
// src/gameSetup.js
// initialize the game
// setup game player, items and main scene

var mainScene = Scene();
mainScene.viewport = [0, 0, 500, 500]
mainScene.limit = [0, 500]

var map = [
  "11111111111111111111",
  "11111111111111111111",
  "00000000000002000300",
  "00000002000000000000",
  "00030000000000020000",
  "11111111111111111111",
  "11111111111111111111",
  "00000001110200000000",
  "00020001110000020000",
  "00000001110300000000"
];

var indexToSprite = [ // Maps the map above to sprite and palette indexes 
  { sprite: 7, palette: 3 },
  { sprites: [{ sprite: 16, palette: 3 }, { sprite: 32, palette: 4 }] },
  { sprite: 7, palette: 3 },
  { sprite: 7, palette: 3 }
];

var scale = 1;

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
      mainScene.add(obj);
    });
  }
}

var randomY = [];
for (var i = 0; i < 40; i++) {
  randomY.push(rando(0, 100));
}
randomY.sort((a,b) => a-b);

for (var i = 0; i < 40; i++) {
  var robot = Robot([rando(0, 300), randomY[i], [], 8, rando(0,2)]);
  robot.rc = [rando(0, 4), rando(0, 4), rando(0, 5), 4]; // robot config, [head, torso, wheels]
  robot.setSprites();
  robot.bounceOffset = rando(0,4);
  robot.flipArm(rando(0,10) > 4);
  mainScene.add(robot);
}

var player = MainCharacter([60, 60, [3, 4], 8, 0]);
player.rc = [0, 0, 0, 3]; // robot config, [head, torso, wheels] // TODO: head and sidehead are the same
player.setSprites();
player.bounceOffset = 0;
mainScene.add(player);
mainScene.following = player;

var robot3 = Robot([95, 65, [3, 4], 8, 0]);
robot3.rc = [0, 1, 0, 0];
robot3.setSprites();
robot3.bounceOffset = 3;
mainScene.add(robot3);
mainScene.add(sequenceVisualizer({x: 16, instrument: 1, banned: []}));
mainScene.add(sequenceVisualizer({x: 0, instrument: 0}));

sceneManager.add(mainScene);

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
  var toggleBeat = danceFrame % 2 == 0;
  //robot3.x += 6*(toggleBeat?-1:1); 
  robot3.setPalette(toggleBeat?0:1);
  //if (danceFrame%3 == 0)
    robot3.flipArm(danceFrame%4 == 0)

}
console.log(robot3)
var buffer = zzfxM(...deepMX);    // Generate the sample data

var node = zzfxP(...buffer);
//node.loop = true;
console.log(deepMX[1][0])
past = Date.now();
node.start();
console.log(node);
updateMetronome();


