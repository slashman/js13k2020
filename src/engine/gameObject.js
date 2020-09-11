
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
    update: dt => {
      self.frame = (self.frame + self.frameRate * dt) % self.frames.length;
    },
    draw: (b, offsetX=0, offsetY=0) => { // brightness
      paletteRenderer.draw(self.frames[~~self.frame], ~~(self.x + offsetX), ~~(self.y+ offsetY), self.paletteIndex, self.flipped, self.vFlip, self.small, self.paletteOverrides, b);
    },
    overridePalette: (index, color) => {
      self.paletteOverrides[index] = color;
    }
  };
  self._update = self.update;
  return self;
};