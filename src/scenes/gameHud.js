// ░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░
// src/gameHud.js
// The HUD
// ░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░
var BOARD_Y = 7;
var NUMBERS_Y = SIXTEEN/2*2;
var CODES_Y = (BOARD_Y - 1)*SIXTEEN;
var CODES_X = W/2;

var hudScene = Scene();
var seq = sequenceVisualizer({ x: 0, y: BOARD_Y, instrument: 0, scene: hudScene });
var numObjects = [];

// The mirror property will be used to draw another sprite in front of the one
// that needs to be mirrored. Something like what we do for the robotz heads.
var gpiMap = [
  "fffffhhfffff",
  "ggggghhggggg",
];

var abc = '0123456789adefghijklmnoprstuwy';
var abcIndexes = [43, 44, 45, 46, 47, 60, 61, 62, 63, 61,72, 73, 74, 75, 76, 88, 89, 90, 91, 92, 104, 105, 106, 107, 108, 120, 121, 122, 123, 124];

var createLetter = (baseStroke, baseFill, x, frame) => {
  var letterObj = GameObject([x, 0, abcIndexes, 0, 0]);
  letterObj.small = true;
  letterObj.frame = frame;
  if (baseStroke) letterObj.paletteOverrides = { 1: hexToRgb(baseStroke), 2: hexToRgb(baseFill) };
  return letterObj;
}
var GUIString = (x, y, text, fill, stroke, b=1) => {
  let self = GameObject([x, y]);
  self.setText = text => {
    var letters = text.split('');
    self.x = x - 4 * letters.length;
    self.parts = letters.map((letter, i) => {
      let frame = abc.indexOf(letter);
      return frame != -1 && createLetter(stroke, fill, i * 8, frame);
    });
  };
  self.setText(text);
  self.update = noop;
  self.b = b;
  self.draw = b => self.visible && self.parts.forEach(letter => letter && letter.draw(self.b, self.x, self.y));
  hudScene.add(self);
  return self;
}

var GUI404 = GUIString(CODES_X, CODES_Y, '404', '401', 's2l', 0);
var GUI100 = GUIString(CODES_X, CODES_Y, '100', u, u, 0);
var GUI200 = GUIString(CODES_X, CODES_Y, '200', '574', 'ou5', 0);

const GUI_CODE_EFFECT = (GUICode, targetY) => {
  GUICode.b = 1;
  GUICode.y = CODES_Y;
  setTimeout(_ => {
    addAnimation(GUICode, 'b', 1, 0, 300);
    addAnimation(GUICode, 'y', CODES_Y, CODES_Y + targetY, 300);
  }, 60);
}

// Put game objects in the scene
loadMap(gpiMap, hudScene, {x:0, y: BOARD_Y});
seq.addBeatLinesToScene();
hudScene.add(seq);

// Function overrides ----------------------------------------------------------
hudScene.onMetronomeTick = (tick) => seq.updateLines(tick)

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
