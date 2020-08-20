
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
  { sprite: 7, palette: 3 },
  { sprite: 7, palette: 3 },
  { sprite: 7, palette: 3 }
];

var scale = 1;

for (var y = 0; y < map.length; y++) {
  for (var x = 0; x < map[y].length; x++) {
    var char = map[y].charAt(x);
    var spriteData = indexToSprite[parseInt(char, 10)];
    var obj = GameObject([(SIXTEEN * scale) * x, (SIXTEEN * scale) * y, [spriteData.sprite], i+3, spriteData.palette]);
    mainScene.add(obj);
  }
}

var spriteTest = MainCharacter([60, 60, [3, 4], 8, 0]);
spriteTest.rc = [0, 0, 0]; // robot config, [head, torso, wheels]
spriteTest.setSprites();
spriteTest.bounceOffset = 0;
mainScene.add(spriteTest);
mainScene.following = spriteTest;

var robot2 = Robot([60, 60, [3, 4], 8, 1]);
robot2.rc = [1, 0, 0]; // robot config, [head, torso, wheels]
robot2.setSprites();
robot2.bounceOffset = 1;
mainScene.add(robot2);

var robot3 = Robot([95, 65, [3, 4], 8, 1]);
robot3.rc = [1, 1, 0]; // robot config, [head, torso, wheels]
robot3.setSprites();
robot3.bounceOffset = 3;
mainScene.add(robot3);

sceneManager.add(mainScene);


