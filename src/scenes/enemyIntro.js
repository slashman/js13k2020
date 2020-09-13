

var enemyScene = Scene();

//loadMap(discoMap, enemyScene);

enemyScene.add(textureRect(0, 0, W, H, 103, 15));
partsZoneScene.forEach(enemyScene.add);

var theEnemies = [];
for (var i=0; i<LEVELS.length; i++) {
  var localEnemy = Robot([i*36 + 16, 60, [], 8, 11], enemyScene);
  localEnemy.setSprites(LEVELS[i].robot);
  localEnemy.basePalette = LEVELS[i].palette;
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
  theEnemies[currentLevel].setPalette(theEnemies[currentLevel].basePalette);
  enemyScene.fadeIn();
  //theEnemies.forEach((enemy, i) => addAnimation(enemy, 'y', 130, 60, i*500 + 400));
  setTimeout( _ => {
    theEnemies.forEach((enemy, i) => {
      addAnimation(enemy, 'x', enemy.x, i == currentLevel ? W/2-8 : enemy.x, 800);
      addAnimation(enemy, 'y', enemy.y, i == currentLevel ? 50 : 148, 800);
      // SFX - GECKO - cuando aparece el enemigo
      zzfx(...[.7,10,30,u,.5,1.1,u,.4,2,-2,10,50,.7,.3,u,u,.04,.3,1]);  // SFX - GECKO - cuando aparece el enemigo
      enterZone(...closeEnemyHorizontal);
    })
  }, 1200);

  setTimeout(_ => setPressEnter(false), 2400);
}
enemyScene.add(pressEnter);

const enemyOut = _ => {
  enemyScene.fadeOut();
  exitZone();
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
