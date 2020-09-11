

var enemyScene = Scene();

loadMap(discoMap, enemyScene);
var theEnemies = [];
for (var i=0; i<LEVELS.length; i++) {
  var localEnemy = Robot([i*36 + 16, 60, [], 8, 11], enemyScene);
  localEnemy.setSprites(LEVELS[i].robot);
  localEnemy.bounceOffset = 0;
  enemyScene.add(localEnemy);
  theEnemies.push(localEnemy);
}

//sceneManager.add(enemyScene);
//dancersScene.active = false;

const enemyIntro = _ => {
  enemyScene.active = true;
  enemyScene.brightness = 0;
  theEnemies[currentLevel].setPalette(2);
  enemyScene.fadeIn();
  pressEnter.visible = true;
}

const enemyOut = _ => {
  enemyScene.fadeOut();
  enemyScene.active = false;
  pressEnter.visible = false;
  discoIntro();
  setTimeout(() => {
    loadLevel();
  }, 1000);
}

sceneManager.add(enemyScene);
enemyScene.active = false;
