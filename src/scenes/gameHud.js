// ░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░
// src/gameHud.js
// The HUD
// ░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░
var BOARD_Y = 7;
var NUMBERS_Y = SIXTEEN/2*2;
var CODES_Y = (BOARD_Y - 1)*SIXTEEN;
var CODES_X = W/2;
var HEY_CHAR = '~';
var PROGRESS_WIDTH = 33;

var hudScene = Scene();
var seq = sequenceVisualizer({ x: 0, y: BOARD_Y, instrument: 0, scene: hudScene });
var numObjects = [];
var gpiMap = [
  "ffffffffffff",
  "gggggggggggg",
];

// ---- [ LETTERS AND NUMBERS ] ------------------------------------------------
var abc = `0123456789abcdefghijklmnopqrstuvwxyz${HEY_CHAR}#=*`;
var abcIndexes = [43, 44, 45, 46, 47, 60, 61, 62, 63, 61, ...arrange(68, 76), ...arrange(84, 92), ...arrange(100, 107), 28, 29, 30, 108];

var createLetter = (baseStroke, baseFill, x, frame, flipped = false) => {
  var letterObj = GameObject([x, 0, abcIndexes, 0, 0]);
  letterObj.small = true;
  letterObj.frame = frame;
  letterObj.flipped = flipped;
  if (baseStroke) letterObj.paletteOverrides = { 1: hexToRgb(baseStroke), 2: hexToRgb(baseFill) };
  return letterObj;
}
var GUIString = (x, y, text, fill, stroke, b=1) => {
  let self = GameObject([x, y]);
  self.setText = text => {
    var letters = text.split('');
    if (letters[0] === HEY_CHAR) letters.push(HEY_CHAR)
    self.x = x - 4 * letters.length;
    self.parts = letters.map((letter, i) => {
      let frame = abc.indexOf(letter);
      return frame != -1 && createLetter(stroke, fill, i * 8, frame, i === text.length);
    });
  };
  self.setText(text);
  self.update = noop;
  self.b = b; // BrightNES
  self.draw = b => self.visible && self.parts.forEach(letter => letter && letter.draw(self.b, self.x, self.y));
  hudScene.add(self);
  return self;
}

var GUI404 = GUIString(CODES_X, CODES_Y, `${HEY_CHAR}#=#`, '401', 's2l', 0); // 404
var GUI100 = GUIString(CODES_X, CODES_Y, '100', u, u, 0);
var GUI200 = GUIString(CODES_X, CODES_Y, `${HEY_CHAR}200`, 'ou5', '574', 0);
// ---- [ LETTERS AND NUMBERS ] ------------------------------------------------

// ---- [ SPEAKERS ] -----------------------------------------------------------
var speakerCfg = [[arrange(22,26),arrange(38,42)], 13];
var LeftSpeaker = MechaGameObject(0, 5*SIXTEEN/2, ...speakerCfg);
var RightSpeaker = MechaGameObject(0, 5*SIXTEEN/2, ...speakerCfg, 1, noop, true);
RightSpeaker.x = W - RightSpeaker.width;
// LeftSpeaker.y += LeftSpeaker.height;
// RightSpeaker.y += RightSpeaker.height;

// ---- [ PROGRESS BAR ] -------------------------------------------------------
var progressCfg = [
  [[11,12,12,12,13,14,15]], 9,
  1,
  function () {
    const _x = this.x+(!this.flipped?4:20);
    const _y = this.y+6;
    // The white background of the progress bar
    fillRectPixel(_x, _y, PROGRESS_WIDTH, 7, [255, 255, 255]);
    // The progress of the player
    if (!this.flipped) {
      const leftProgress = PROGRESS_WIDTH * Math.min(player.score, level.score) / level.score;
      fillRectPixel(_x, _y, leftProgress, 7, [15, 146, 240]);
    }
    else {
      const rightProgress = PROGRESS_WIDTH * enemy.score / level.score;
      fillRectPixel(_x+PROGRESS_WIDTH-rightProgress, _y, rightProgress, 7, [251, 107, 29]);
    }
  }
];
var PlayerProgress = MechaGameObject(5*SIXTEEN/2, 0, ...progressCfg);
var EnemyProgress = MechaGameObject(5*SIXTEEN/2, 0, ...progressCfg, true);
EnemyProgress.x += EnemyProgress.width;
PlayerProgress.y -= 100;
EnemyProgress.y -= 100;

// ---- [ BOARD ] --------------------------------------------------------------
loadMap(gpiMap, hudScene, {x:0, y: BOARD_Y});
seq.addBeatLinesToScene();
hudScene.add(seq);
var DPU = MechaGameObject(10*SIXTEEN/2, 7*SIXTEEN/2, [arrange(117,120),arrange(121,124)], 9);

const GUI_CODE_EFFECT = (GUICode, targetY) => {
  GUICode.b = 1;
  GUICode.y = CODES_Y;
  setTimeout(_ => {
    addAnimation(GUICode, 'b', 1, 0, 300);
    addAnimation(GUICode, 'y', CODES_Y, CODES_Y + targetY, 300);
  }, 60);
}

// Function overrides ----------------------------------------------------------
hudScene.onMetronomeTick = (tick) => {
  seq.updateLines(tick)
  LeftSpeaker.y += LeftSpeaker.dfltY !== LeftSpeaker.y ? -2 : 2;
  RightSpeaker.y += RightSpeaker.dfltY !== RightSpeaker.y ? -2 : 2;
}

hudScene.showLevelElements = () => {
  addAnimation(LeftSpeaker, 'y', LeftSpeaker.y, LeftSpeaker.dfltY, 1000);
  addAnimation(RightSpeaker, 'y', RightSpeaker.y, RightSpeaker.dfltY, 1000);
  addAnimation(PlayerProgress, 'y', -24, PlayerProgress.dfltY, 1150);
  addAnimation(EnemyProgress, 'y', -24, EnemyProgress.dfltY, 1150);
};
// -----------------------------------------------------------------------------

let gameTitle = GUIString(CODES_X, 20, 'rythm not found', 'v0v', '000', 0);
let pressEnter = GUIString(CODES_X, 80, 'press enter', 'vvv','332', 0);
pressEnter.visible = false;
let countdownLabel = GUIString(CODES_X, H/2-8, '3', u, u, 0);
let setPressEnter = lock => {
  inputLocked = lock;
  pressEnter.visible = !lock;
};

setTimeout(_ => {
  addAnimation(gameTitle, 'b', 0, 1, 500);
  addAnimation(gameTitle, 'y', 20, 30, 500).onEnd(_ => setPressEnter(false));
  addAnimation(pressEnter, 'b', 0.2, 1, 500, easeLinear, true);
}, 1000);

// Load the scene in the game
sceneManager.add(hudScene);

paletteRenderer.beatPalette(9, 2, ['vuu', '9st', 'i0d', '8u8', 'v9d']);
paletteRenderer.beatPalette(10, 5, ['1m7', '3o9', '5qb', '7sd']);
// speaker leds
setInterval(_ => {
  paletteRenderer.shiftPalette(13, 2, 4, 1);
}, 100);
paletteRenderer.cyclePaletteIndex(13, 7, ['him', 'opr']);
// paletteRenderer.cyclePaletteIndex(13, 6, ['him', '66b', 'him', 'opr']);

console.log('seq visualizer');
console.log(seq);
