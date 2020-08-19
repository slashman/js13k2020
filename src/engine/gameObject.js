
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
    update: dt => {
      self.frame = (self.frame + self.frameRate * dt) % self.frames.length;
    },
    draw: _ => {
      paletteRenderer.draw(self.frames[~~self.frame], ~~self.x, ~~self.y, self.paletteIndex, self.flipped);
    }
  };
  self._update = self.update;
  return self;
};

var partsConfig = [
  [ // heads
    [0],
    [6]
  ],
  [ // torsos
    [2],
    [8]
  ],
  [ // wheels
    [4],
    [8]
  ],
];

var Robot = props => {
  var self = GameObject(props);
  self.update = dt => {
    self.components.forEach(c => { 
      c.x = self.x + c.dx;
      c.y = self.y + c.dy;
    });
  }
  self.setSprites = () => {
    var f = self.rc.map((pi, i) => partsConfig[i][pi])
    self.components.forEach((c,i) => c.frames = f[~~(i/2)])
  }
  self.draw = noop; // We don't draw this gameObject, it's just a container
  var ngo = () => GameObject([0, 0, [1], i+3, self.paletteIndex]);
  self.components = [...new Array(6)].map(x => ngo());
  var c = self.components;
  c.forEach((x, i) => {
    x.dx = (i%2) * 16;
    x.dy = ~~(i/2) * 16;
    x.flipped = x.dx == 16
    mainScene.add(x)
  });
  self._update = self.update;
  return self;
};