
var textureRect = (x, y, width, height, frame, palette) => {
  var self = GameObject([x, y, [frame], 0, palette]);
  self.height = height;
  self.width = width;
  self.setSprite = frame => {
    self.offsetX = frame % 2;
    self.sprite = sprites[~~(frame / 2)]
  };
  self.b = 1;
  self.palette = palette;
  self.setSprite(frame);
  self.draw = _b => {
    for ( let j = ~~self.y; j<self.y + self.height; j++ ) {
      for ( let i = ~~self.x; i < self.x + self.width; i++ ) {
        let {r, g, b} = paletteRenderer.palettes[self.palette][self.sprite[(i%8) + self.offsetX*8 +(j % SIXTEEN) * SIXTEEN]];
        setPixel(i, j, r, g, b, 255*self.b);
      }
    }
  };
  return self;
};
