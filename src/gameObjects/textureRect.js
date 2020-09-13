
var textureRect = (x, y, width, height, frame, palette) => {
  var self = GameObject([x, y, [frame], 0, palette]);
  var sprite = sprites[~~(frame/2)];  
  var offsetX = frame%2;
  self.height = height;
  self.width = width;
  self.draw = _b => {
    for ( let j = ~~self.y; j<self.y + self.height; j++ ) {
      for ( let i = ~~self.x; i < self.x + self.width; i++ ) {
        let {r, g, b} = paletteRenderer.palettes[palette][sprite[(i%8) + offsetX*8 +(j % SIXTEEN) * SIXTEEN]];
        setPixel(i, j, r, g, b, 255*_b);
      }
    }
  };
  return self;
};
