
// src/gameSetup.js
// initialize the game
// setup game player, items and main scene

/**
 * GAME STATE possible values
 * intro = 0
 * enemy intro = 1
 * play - song = 2
 * results = 3
 * end = 4
*/
var gameState = 0;

/**
 * GAME SUB STATE
 * countdown: 0
 * playing song: 1
 * end song: 2
*/
var subState = 0;

var currentLevel = -1;
var buffer = zzfxM(...deepMX);    // Generate the sample data
level = LEVELS[0];
var song;
var win = false;

const loadLevel = levelIndex => {
  enemyScene.active = false;
  discoScene.active = true;

  gameState = 2;
  subState = 0;
  startTime = null;
  current_tick = -1;
  enemy.score = 0;
  enemy.combo = 0;
  enemy.focus = 0;
  player.combo = 0;
  player.addFocus(-4);
  player.score = 0;
  pressEnter.visible = false;

  hudScene.showLevelElements();
  updateMetronome();
}

const startSong = _ => {
  
  subState = 1;
  //setTimeout( discoScene.fadeOut, 4000);
  //setTimeout( _ => { jungleScene.active = true; discoScene.active = false; jungleScene.fadeIn();}, 6000);
  //setTimeout( jungleScene.fadeOut, 8000);
  //setTimeout( _ => { jungleScene.active = false; discoScene.active = true; discoScene.fadeIn();}, 10000);  
  
  // song start
  song = zzfxP(...buffer);
  song.loop = true;
  current_tick = -1;
  updateMetronome();
}

const finishGame = _ => {
  exitZone();
  song.stop();
  subState = 2;
  win = player.score >= level.score;
  if (win) {
  zzfx(...[u,u,196,u,.3,.9,u,1.84,,50,500,.05,.08,.3,u,u,.16,.91]);// SFX - GECKO -- win
  }else {
  zzfx(...[u,u,196,u,.8,.9,u,.3,8,u,-6,u,.03,.3,u,u,.32,0,1]);  // SFX - GECKO -- lose
  }
  addAnimation(countdownLabel, 'b', 0, 1, 350);
  countdownLabel.setText(win ? 'you win' : 'you lose');
  setTimeout(_ => setPressEnter(false), 1000);
}

const displayEnemyScene = _ => {
  gameState = 1;
  subState = 0;
  level = LEVELS[++currentLevel];
  enemy.setSprites(level.robot);
  deepMX[2] = level.sequence;
  deepMX[3] = level.bpm;
  bpm = level.bpm;
  timeBetweenBeats = 60000 / (level.bpm * 4);
  buffer = zzfxM(...deepMX);

  enemyIntro();
}

const startGame = _ => {
  //gameState = 1;
  setTimeout(() => {
    sceneManager.remove(zoneScene);
    partsZoneScene.forEach(zoneScene.remove);
  }, 100);
  displayEnemyScene();
  //enterZone(resetTransition);
  exitZone();
  hudScene.remove(gameTitle);
}

const startSfx = [0.5,u,u,.2,1,u,1,.5,20,10,10,.7,.7,u,.9,.4,u,u,.7];
const enterSfx = [0.7,u,u,u,.3,u,1,u,2.2,1.5,750,.15,.14,u,u,.4];

const handleEnterAction = _ => {
  //console.log(gameState);
  switch (gameState) {
    case 0:
      zzfx(...startSfx);
      startGame();
      break;
    case 1:
      zzfx(...enterSfx);
      enemyOut();
      break;
    case 2:
      if (subState==2) {
        if (win) {
          pressEnter.visible = false;
          if (currentLevel == 4) {
            gameState = 5;
            addAnimation(enemy, 'y', enemy.y, H, 600);
            addAnimation(player, 'x', player.x, W/2-8, 600);
            hudScene.add(GUIString(CODES_X, 20, 'thanks for playing', 'v0v', '000', 1));
            enterZone(...allSlides[rando(0, 4)]);
            return true;
          }
          discoOut();
          displayEnemyScene();
        } else loadLevel();
      }
  }
}

