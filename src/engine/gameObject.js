
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
    self.frame = (self.frame + self.frameRate * dt) % 6;
    var iframe = ~~self.frame;
    headOffset =     [0,1,2,3,2,1][iframe];
    torsoOffset =    [0,1,2,1,0,0][iframe];
    [self.components[0], self.components[1]].forEach(s => s.y += headOffset); // head sprites
    [self.components[2], self.components[3]].forEach(s => s.y += torsoOffset) // torso sprites
  }
  self.setSprites = () => {
    var f = self.rc.map((pi, i) => partsConfig[i][pi])
    self.components.forEach((c,i) => c.frames = f[~~(i/2)])
  }
  self.draw = noop; // We don't draw this gameObject, it's just a container
  self.components = [...new Array(6)].map(x => GameObject([0, 0, [1], i+3, self.paletteIndex]));
  var c = self.components;
  c.forEach((x, i) => {
    x.dx = (i%2) * 16;
    x.dy = ~~(i/2) * 16;
    x.flipped = x.dx == 16
    mainScene.add(c[5-i]);
  });
  self._update = self.update;
  return self;
};