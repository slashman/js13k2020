
// src/gameObject.js >>
// declare game classes

// params delivered as an array [x, y, [imgs], frameRate]
var GameObject = props => {
  var self = {
    x: props[0],
    y: props[1],
    visible: true,
    frame: 0,
    frameRate: props[3],
    frames: props[2].map(index => imgs[index]),
    update: dt => {
      self.frame = (self.frame + self.frameRate * dt) % self.frames.length;
    },
    draw: _ => {
      graphics.drawImage(self.frames[~~self.frame], ~~self.x, ~~self.y);
    }
  };
  self._update = self.update;
  return self;
};

