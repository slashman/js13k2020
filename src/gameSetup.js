
// src/gameSetup.js
// initialize the game
// setup game player, items and main scene

var mainScene = Scene({});

mainScene.create = function(){};
for (var i = 0; i < 10*2; i++) {
  for (var j = 0; j < 10*2; j++) {
    var obj1 = TestObject([(16 * scale + 2) * i, (16 * scale + 2)*j]);
    mainScene.add(obj1);
  }
}

sceneManager.add(mainScene);


