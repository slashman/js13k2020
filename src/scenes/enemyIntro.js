

var enemyScene = Scene();

loadMap(discoMap, enemyScene);
var theEnemies = [];
for (var i=0; i<LEVELS.length; i++) {
  var localEnemy = Robot([i*36 + 16, 60, [], 8, 9], enemyScene);
  localEnemy.setSprites(LEVELS[i].robot);
  localEnemy.bounceOffset = 0;
  enemyScene.add(localEnemy);
  theEnemies.push(localEnemy);
}

//sceneManager.add(enemyScene);
//dancersScene.active = false;

var targetEnemyPos = [W/2, 50];
const enemyIntro = _ => {
  setPressEnter(true);
  theEnemies.forEach((enemy, i) => {
    enemy.x = i * 36 + 16;
    enemy.y = 60;
  });
  enemyScene.active = true;
  enemyScene.brightness = 0;
  theEnemies[currentLevel].setPalette(RED_ROBOTO);
  enemyScene.fadeIn();
  //theEnemies.forEach((enemy, i) => addAnimation(enemy, 'y', 130, 60, i*500 + 400));
  setTimeout( _ => {
    theEnemies.forEach((enemy, i) => {
      addAnimation(enemy, 'x', enemy.x, i == currentLevel ? W/2-8 : enemy.x, 800);
      addAnimation(enemy, 'y', enemy.y, i == currentLevel ? 40 : 148, 800);
      // SFX - GECKO - cuando aparece el enemigo
    })
  }, 1200);

  setTimeout(_ => setPressEnter(false), 2400);
}
enemyScene.add(pressEnter);

const enemyOut = _ => {
  enemyScene.fadeOut();
  enemyScene.active = false;
  pressEnter.visible = false;
  discoIntro();
  inputLocked = true;
  setTimeout(_ => {
    inputLocked = false;
    loadLevel();
  }, 1000);
}

sceneManager.add(enemyScene);
enemyScene.active = false;
