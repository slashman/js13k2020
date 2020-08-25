// src/scene.js
// should display different objects in screen, like scenes in phaser

var sceneManager = {
  scenes: [],
  add: scene => {
    scene.init();
    sceneManager.scenes.push(scene);
  },
  update: (time, dt) => {
    for (var i = 0; i < sceneManager.scenes.length; i++) {
      sceneManager.scenes[i].update(time, dt);
    }
  },
  draw: _ => {
    sceneManager.scenes.map( scene => scene.draw())
  }
};

var Scene = () => {
  var self = {
    x: 0,
    dx: 0,
    active: true,
    children: [],
    following: undefined,
    limit: [],
    maxWidth: 320,
    init: noop,
    add: gameObject => self.children.push(gameObject),
    remove: gameObject => {
      var index = self.children.indexOf(gameObject);
      if (index!=-1) {
        self.children.splice(index, 1);
      }
    },
    applyToChildren: fn => { self.children.forEach(fn) },
    updateData: noop, // time, dt
    update: (time, dt) => {
      if (!self.active) return;
      self.applyToChildren( gameObject => {
        if (gameObject.x + 24 > -self.x && gameObject.x < -self.x + 320) {
          gameObject.update(dt, time);
        }
      })
      self.updateData(time, dt);
      
      if (self.moving) {
        self.moving = self.x > -self.targetX && self.x-320 > -self.limit[1];
        if (self.moving) self.x -= 1;
      } else if (self.following) {
        self.x = -(self.following.x-150);
        self.x = ~~self.x;
        if (self.x > -self.limit[0]) {
          self.x = -self.limit[0];
        } else if (self.x <- self.limit[1]+320) {
          self.x = -self.limit[1]+320;
        }
      }
    },
    predraw: noop,
    draw: _ => {
      if(!self.active) return;
      
      self.applyToChildren( gameObject => {
        //if (gameObject.x + 24 > -self.x && gameObject.x < -self.x + 310 && gameObject.visible) {
        if (gameObject.visible) { // TODO: Fix to make metronome visible
          gameObject.draw();
        }
      })
    },
    moveToLimit: (minLimit, maxLimit) => {
      self.moving = true;
      // follows player
      //self.targetX = player.x-150;
      if (self.targetX < minLimit) {
        self.targetX = minLimit;
      }
      self.limit[0] = minLimit;
      self.limit[1] = maxLimit;
    }
  }
  return self;
}

