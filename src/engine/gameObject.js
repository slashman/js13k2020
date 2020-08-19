
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

var partsConfig = {
  heads: [
    [0],
    [6]
  ],
  torsos: [
    [2],
    [8]
  ],
  wheels: [
    [4],
    [8]
  ],
};

var Robot = props => {
  var self = GameObject(props);
  self.update = dt => {
    self.components.forEach(c => { 
      c.x = self.x + c.dx;
      c.y = self.y + c.dy;
    });
  }
  self.setSprites = () => {
    self.head1.frames = partsConfig.heads[self.head];
    self.head2.frames = partsConfig.heads[self.head];
    self.torso1.frames = partsConfig.torsos[self.torso];
    self.torso2.frames = partsConfig.torsos[self.torso];
    self.wheels1.frames = partsConfig.wheels[self.wheels];
    self.wheels2.frames = partsConfig.wheels[self.wheels];
  }
  self.draw = noop; // We don't draw this gameObject, it's just a container
  self.head1 = GameObject([0, 0, [1], i+3, self.paletteIndex]);
  self.head1.dx = 0;
  self.head1.dy = 0;
  self.head2 = GameObject([0, 0, [1], i+3, self.paletteIndex]);
  self.head2.flipped = true;
  self.head2.dx = 16;
  self.head2.dy = 0;
  
  self.torso1 = GameObject([0, 0, [1], i+3, self.paletteIndex]);
  self.torso1.dx = 0;
  self.torso1.dy = 16;
  self.torso2 = GameObject([0, 0, [1], i+3, self.paletteIndex]);
  self.torso2.flipped = true;
  self.torso2.dx = 16;
  self.torso2.dy = 16;

  self.wheels1 = GameObject([0, 0, [1], i+3, self.paletteIndex]);
  self.wheels1.dx = 0;
  self.wheels1.dy = 32;
  self.wheels2 = GameObject([0, 0, [1], i+3, self.paletteIndex]);
  self.wheels2.flipped = true;
  self.wheels2.dx = 16;
  self.wheels2.dy = 32;

  self.components = [];
  self.components.push(self.head1);
  self.components.push(self.head2);
  self.components.push(self.torso1);
  self.components.push(self.torso2);
  self.components.push(self.wheels1);
  self.components.push(self.wheels2);
  mainScene.add(self.head1);
  mainScene.add(self.head2);
  mainScene.add(self.torso1);
  mainScene.add(self.torso2);
  mainScene.add(self.wheels1);
  mainScene.add(self.wheels2);
  self._update = self.update;

  return self;
};