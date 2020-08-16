
// src/gameSetup.js
// initialize the game
// setup game player, items and main scene

var mainScene = Scene();

for (var i = 0; i < 5*2; i++) {
  for (var j = 0; j < 5*2; j++) {
    var obj1 = TestObject([(SIXTEEN * scale + 2) * i, (SIXTEEN * scale + 2)*j, (i +10*j)%4]);
    mainScene.add(obj1);
  }
}

sceneManager.add(mainScene);


