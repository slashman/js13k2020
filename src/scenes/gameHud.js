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
var abc = `0123456789adefghijklmnoprstuwy${HEY_CHAR}#=*`;
var abcIndexes = [43, 44, 45, 46, 47, 60, 61, 62, 63, 61,72, 73, 74, 75, 76, 88, 89, 90, 91, 92, 104, 105, 106, 107, 108, 120, 121, 122, 123, 124, 94, 110, 111, 71];

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
var speakerCfg = {parts: [arrayFromTo(22,26),arrayFromTo(38,42)], palette: 13}
var LeftSpeaker = MechaGameObject({x: 0, y: 5*SIXTEEN/2, ...speakerCfg});
var RightSpeaker = MechaGameObject({x: 0, y: 5*SIXTEEN/2, ...speakerCfg, mirrored: true});
RightSpeaker.x = W - RightSpeaker.width;
LeftSpeaker.y += LeftSpeaker.height;
RightSpeaker.y += RightSpeaker.height;
console.log('h:', LeftSpeaker.height);

// ---- [ PROGRESS BAR ] -------------------------------------------------------
var progressCfg = {
  parts: [[11,12,12,12,13,14,15]], palette: 9,
  drawBehind: function () {
    const _x = this.x+(!this.flipped?4:20);
    const _y = this.y+6;
    // The white background of the progress bar
    fillRectPixel(_x, _y, PROGRESS_WIDTH, 7, [255, 255, 255]);
    // The progress of the player
    if (!this.flipped) {
      const leftProgress = PROGRESS_WIDTH * player.score / level.score;
      fillRectPixel(_x, _y, leftProgress, 7, [15, 146, 240]);
    }
    else {
      const rightProgress = PROGRESS_WIDTH * enemy.score / level.score;
      fillRectPixel(_x+PROGRESS_WIDTH-rightProgress, _y, rightProgress, 7, [251, 107, 29]);
    }
  }
};
var PlayerProgress = MechaGameObject({x: 5*SIXTEEN/2, y: 0, ...progressCfg});
var EnemyProgress = MechaGameObject({x: 5*SIXTEEN/2, y: 0, ...progressCfg, mirrored: true});
EnemyProgress.x += EnemyProgress.width;
PlayerProgress.y -= 100;
EnemyProgress.y -= 100;

// ---- [ BOARD ] --------------------------------------------------------------
loadMap(gpiMap, hudScene, {x:0, y: BOARD_Y});
seq.addBeatLinesToScene();
hudScene.add(seq);
var DPU = MechaGameObject({x: 10*SIXTEEN/2, y: 7*SIXTEEN/2, parts: [arrayFromTo(100,103),arrayFromTo(116,119)], palette: 9});

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
  addAnimation(pressEnter, 'b', 0.2, 1, 500, u, true);
}, 1000);

// Load the scene in the game
sceneManager.add(hudScene);

console.log('seq visualizer');
console.log(seq);
