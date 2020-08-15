
// src/gameSetup.js
// initialize the game
// setup game player, items and main scene

var mainScene = Scene({});

mainScene.create = function(){};
for (var i = 0; i < 19*2; i++) {
  for (var j = 0; j < 14*2; j++) {
    var obj1 = TestObject([10*i, 10*j]);
    mainScene.add(obj1);
  }
}

sceneManager.add(mainScene);


