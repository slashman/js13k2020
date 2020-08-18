
// src/gameSetup.js
// initialize the game
// setup game player, items and main scene

var mainScene = Scene();
mainScene.viewport = [0, 0, 500, 500]
mainScene.limit = [0, 500]

for (var i = 0; i < 8; i++) {
  var obj1 = GameObject([(SIXTEEN * scale * 5 + 2) * i + 5, 20, [i*4+0,i*4+1,i*4+2,i*4+3], i+3]);
  mainScene.add(obj1);
  var obj2 = GameObject([(SIXTEEN * scale * 5 + 2) * i + 0, 210, [i*4+32,i*4+33,i*4+34,i*4+35], i+3]);
  mainScene.add(obj2);
}

var spriteTest = MainCharacter([60, 60, [0, 1, 2, 3], 5]);
mainScene.add(spriteTest);
mainScene.following = spriteTest;

sceneManager.add(mainScene);


