// ░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░
// src/gameHud.js
// The HUD
// ░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░
var BOARD_Y = 8;
var NUMBERS_Y = SIXTEEN/2*2;
var CODES_Y = (BOARD_Y+6)*SIXTEEN/2;
var CODES_X = W/2 - (SIXTEEN*3/4);

var hudScene = Scene();
var seq = sequenceVisualizer({ x: 0, y: BOARD_Y, instrument: 0, scene: hudScene });
var numObjects = [];

// The mirror property will be used to draw another sprite in front of the one
// that needs to be mirrored. Something like what we do for the robotz heads.
var gpiMap = [
  "fffffffffhhfffffffff",
  "ggggggggghhggggggggg",
];

// Creates a number sprite from 0 to 9
var createNumber = (baseStroke, baseFill, x, val, y = NUMBERS_Y) => {
  var num = GameObject([x, y, [43,44,45,46,47,60,61,62,63,61], 0, 12]);
  num.small = true;
  if (val) num.frame = val;
  if (baseStroke) num.paletteOverrides = { 6: hexToRgb(baseStroke), 7: hexToRgb(baseFill) };
  return num;
}

// Fake Game Object that creates a number that can grow based on its number of digits
var GUINumber = ({x, y = NUMBERS_Y, visible = true, stroke, fill, playerProp, initial = '0'}) => {
  var initialNumbers = initial.split('').map((n,i) => {
    var num = createNumber(stroke, fill, x, parseInt(n), y);
    num.x += SIXTEEN/2 * i;
    num.visible = visible;
    hudScene.add(num);
    return num;
  })
  var self = {
    x: x,
    y: y,
    numbers: [...initialNumbers],
    prop: playerProp,
    visible: visible,
    update: () => {
      if (self.prop) {
        var num = null;
        var numArray = `${player[self.prop]}`.split('');
  
        if (numArray.length > self.numbers.length) {
          num = createNumber(stroke, fill, self.x);
          // num.x += self.x * self.numbers.length;
          self.numbers.push(num);
          hudScene.add(num);
        } else if (numArray.length < self.numbers.length) {
          hudScene.remove(self.numbers.pop());
        }
  
        // Update the frames for each number
        numArray.forEach((n,i) => {
          var num = parseInt(n);
          self.numbers[i].frame = num;
          self.numbers[i].flipped = num === 9;
          self.numbers[i].vFlip = num === 9;
          self.numbers[i].y = num === 9 ? self.y + 10 : self.y;
          self.numbers[i].x = self.x + (SIXTEEN/2 * i);
        });
      } else {
        self.numbers.forEach((n) => n.visible = self.visible);
      }
    }
  }

  return self;
};

var GUICombo = GUINumber({x:SIXTEEN/2, stroke:'#000000', fill:'#FFFFFF', playerProp:'combo'});
var GUIMaxCombo = GUINumber({x:SIXTEEN/2 * 3, stroke:'#000000', fill:'#FFDA45', playerProp:'maxCombo'});
var GUIScore = GUINumber({x:W - SIXTEEN, playerProp:'score'});
var GUI404 = GUINumber({x:CODES_X, y: CODES_Y, stroke: '#25000D', fill: '#E214A8', initial: '404', visible: false});
var GUI100 = GUINumber({x:CODES_X, y: CODES_Y, initial: '100', visible: false});
var GUI200 = GUINumber({x:CODES_X, y: CODES_Y, stroke: '#293F21', fill: '#C4F129', initial: '200', visible: false});

var guiComboSeparator = GameObject([SIXTEEN/2 * 2, NUMBERS_Y, [78], 0, 12]);
guiComboSeparator.small = true;
guiComboSeparator.overridePalette(6, hexToRgb('#000000'));
guiComboSeparator.overridePalette(7, hexToRgb('#FFFFFF'));

hudScene.add(guiComboSeparator);

// Put game objects in the scene
loadMap(gpiMap, hudScene, {x:0, y: BOARD_Y});
seq.addBeatLinesToScene();
hudScene.add(seq);

// Function overrides ----------------------------------------------------------
hudScene.onMetronomeTick = (tick) => seq.updateLines(tick)
hudScene.update = (time, dt) => {
  if (!hudScene.active) return;
  hudScene.updateFade(dt);

  GUICombo.update();
  GUIMaxCombo.update();
  GUIScore.update();
  GUI404.update();
  GUI100.update();
  GUI200.update();

  // Move numbers based on the one that is on the left (the combo counter)
  guiComboSeparator.x = SIXTEEN/2 * (2 + GUICombo.numbers.length - 1);
  GUIMaxCombo.x = SIXTEEN/2 * (2 + GUICombo.numbers.length);
  
  // Update the position of the score number based on its length
  GUIScore.x = W - SIXTEEN - (SIXTEEN/2 * (GUIScore.numbers.length - 1));

  // Set the performance feedback visible
  GUI404.visible = keyOnBeat.performance === 'bad';
  GUI100.visible = keyOnBeat.performance === 'good';
  GUI200.visible = keyOnBeat.performance === 'perfect';

  hudScene.applyToChildren( gameObject => {
    //if (gameObject.x + 24 > -self.x && gameObject.x < -self.x + 320) {
      gameObject.update(dt, time);
    //}
  })
  hudScene.updateData(time, dt);
};

// Load the scene in the game
sceneManager.add(hudScene);

console.log('seq visualizer');
console.log(seq);