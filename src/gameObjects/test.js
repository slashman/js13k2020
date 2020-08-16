
// src/gameObjects/test.js
// to avoid this, replace for:
// - base if super
// - self if own properties
// test object [x, y, sprite:image]
var TestObject = props => {
  var base = GameObject(props);
  var self = {
    sprite: imgs[props[2]],
    update: (_dt, time) => {
      base.x = Math.sin(time*0.01) + props[0];
      base.y = Math.cos(time*0.01) + props[1];
    },
    draw: _ => {
      graphics.save();
      graphics.drawImage(self.sprite, ~~base.x, ~~base.y);
      graphics.restore();
    }
  }
  return extendFunction(base, self);
}
