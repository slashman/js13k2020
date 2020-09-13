// src/scene.js
// should display different objects in screen, like scenes in phaser

var sceneManager = {
  scenes: [],
  add: scene => sceneManager.scenes.push(scene),
  remove: scene => {
    var index = sceneManager.scenes.indexOf(scene);
    sceneManager.scenes.splice(index, 1);
  },
  update: (time, dt) => sceneManager.scenes.map(scene => scene.update(time, dt)),
  draw: _ => sceneManager.scenes.map( scene => scene.draw()),
};

var Scene = () => {
  var self = {
    x: 0,
    dx: 0,
    b: 1,
    active: true,
    children: [],
    add: gameObject => self.children.push(gameObject),
    remove: gameObject => {
      var index = self.children.indexOf(gameObject);
      index!=-1 && self.children.splice(index, 1);
    },
    applyToChildren: fn => self.children.map(fn),
    update: (time, dt) => self.active && self.applyToChildren(gameObject => gameObject.update(dt, time)),
    draw: _ => self.active && self.applyToChildren( gameObject => gameObject.visible &&gameObject.draw(self.b)),
    fadeIn: _ => addAnimation(self, 'b', 0, 1, 1000),
    fadeOut: _ => addAnimation(self, 'b', 1, 0, 1000),
    onMetronomeTick: noop, // tick
    onMetronomeBeat: noop, // beat
  }
  return self;
}
