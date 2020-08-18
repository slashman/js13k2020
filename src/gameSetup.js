
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
  { sprite: 0, palette: 2 },
  { sprite: 1, palette: 1 },
  { sprite: 2, palette: 2 },
  { sprite: 2, palette: 3 }
];

for (var y = 0; y < map.length; y++) {
  for (var x = 0; x < map[y].length; x++) {
    var char = map[y].charAt(x);
    var spriteData = indexToSprite[parseInt(char, 10)];
    var obj = GameObject([(SIXTEEN * scale) * x, (SIXTEEN * scale) * y, [spriteData.sprite], i+3, spriteData.palette]);
    mainScene.add(obj);
  }
}

var spriteTest = MainCharacter([60, 60, [3, 4], 5, 0]);
mainScene.add(spriteTest);
mainScene.following = spriteTest;

sceneManager.add(mainScene);


