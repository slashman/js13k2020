
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
  player.combo = 0;
  player.focus = 0;
  player.score = 0;
  player.stats = {};
  player.maxCombo = 0;
  pressEnter.visible = false;
  updateMetronome();
}

const startSong = _ => {
  
  subState = 1;
  setTimeout( discoScene.fadeOut, 4000);
  setTimeout( _ => { jungleScene.active = true; discoScene.active = false; jungleScene.fadeIn();}, 6000);
  setTimeout( jungleScene.fadeOut, 8000);
  setTimeout( _ => { jungleScene.active = false; discoScene.active = true; discoScene.fadeIn();}, 10000);  
  
  // song start
  song = zzfxP(...buffer);
  current_tick = -1;
  updateMetronome();

  song.onended = _ => {
    subState = 2;
    win = player.score >= level.score;
    addAnimation(countdownLabel, 'b', 0, 1, 350);
    countdownLabel.setText(win ? 'you win' : 'you lose');
    setTimeout(_ => setPressEnter(false), 1000);
  };

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
  displayEnemyScene();
  hudScene.remove(gameTitle);
}

const enterSfx = [, , 610, .13, .37, .84, 2, 1.47, , , 204, .09, .1, , , , , .79, .02];

const handleEnterAction = _ => {
  console.log(gameState);
  switch (gameState) {
    case 0:
      zzfx(...enterSfx);
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
          discoOut();
          displayEnemyScene();
        } else loadLevel();
      }
  }
}

