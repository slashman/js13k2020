
// src/gameObject.js >>
// declare game classes

// params delivered as an array [x, y, [spriteIndex], frameRate, paletteIndex]
var GameObject = props => {
  var self = {
    x: props[0],
    y: props[1],
    visible: true,
    frame: 0,
    frameRate: props[3],
    frames: props[2],
    paletteIndex: props[4],
    paletteOverrides: {},
    small: false,
    offsetX: 0,
    offsetY: 0,
    update: dt => self.frame = (self.frame + self.frameRate * dt) % self.frames.length,
    draw: (b, offsetX=0, offsetY=0) => paletteRenderer.draw(self.frames[~~self.frame], ~~(self.x + offsetX), ~~(self.y+ offsetY), self.paletteIndex, self.flipped, self.vFlip, self.small, self.paletteOverrides, b),
    overridePalette: (index, color) => self.paletteOverrides[index] = color
  };
  self._update = self.update;
  return self;
};

var createPart = (x, y, mechaIndexes, frame, palette) => {
  const partObj = GameObject([x, y, mechaIndexes, 0, palette]);
  partObj.small = true;
  partObj.frame = frame;
  return partObj;
};
var MechaGameObject = (x, y, parts, palette, b = 1, drawBehind = noop, mirrored = false) => {
  const self = GameObject([x, y]);
  self.dfltX = x;
  self.dfltY = y;
  self.width = 0;
  self.height = parts.length * SIXTEEN;
  self.parts = [];
  parts.forEach((section, j) => {
    self.width = section.length * SIXTEEN / 2;
    var spritesheet = [...section];
    if (mirrored) spritesheet.reverse();
    spritesheet.forEach((_, i) => self.parts.push(createPart(i*8, y+(j*SIXTEEN), spritesheet, i, palette)))
  })
  self.width
  self.update = noop;
  self.b = b;
  self.flipped = mirrored;
  self.drawBehind = drawBehind;
  self.draw = () => {
    if (!self.visible) return
    self.drawBehind();
    self.parts.forEach(part => {
      part.flipped = self.flipped;
      part.draw(self.b, self.x, self.y);
    });
  };

  hudScene.add(self);
  return self;
};