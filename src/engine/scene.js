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
    brightness: 1,
    fadeSpd: 0,
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
    updateFade: dt => {
      if (!self.fading) {
        return;
      }
      self.brightness += self.fadeSpd * dt;
      if (self.brightness > 1) {
        self.fading = false;
        self.brightness = 1;
      }
      if (self.brightness < 0) {
        self.fading = false;
        self.brightness = 0;
      }
    },
    update: (time, dt) => {
      if (!self.active) return;
      self.updateFade(dt)
      
      self.applyToChildren( gameObject => {
        //if (gameObject.x + 24 > -self.x && gameObject.x < -self.x + 320) {
          gameObject.update(dt, time);
        //}
      })
      self.updateData(time, dt);

    },
    predraw: noop,
    draw: _ => {
      if(!self.active) return;
      
      self.applyToChildren( gameObject => {
        //if (gameObject.x + 24 > -self.x && gameObject.x < -self.x + 310 && gameObject.visible) {
        if (gameObject.visible) { // TODO: Fix to make metronome visible
          gameObject.draw(self.brightness);
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
    },
    fadeIn: _ => {
      self.fading = true;
      self.fadeSpd = 1;
      self.brightness = 0;
    },
    fadeOut: _ => {
      self.fading = true;
      self.fadeSpd = -1;
      self.brightness = 1;
    }
  }
  return self;
}

