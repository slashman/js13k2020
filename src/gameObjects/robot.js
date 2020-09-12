var partsConfig = [
[ // heads
    [1], //x8
    [2], //x8
    [3], //x
    [8], //x8
    [2], //x16
    [3], //16
],
[ // torsos
    [32],
    [33],
    [34],
    [35],
    [36],
],
[ // Arms
    [16],
    [17],
    [18],
    [19],
    [20],
    [21]
],
[ // Side Heads
    [24],
    [25],
    [26],
    [27],
    [28],
    [29],
]
];

var bigHeads = [4, 5];

var Robot = (props, scene) => {
  var self = GameObject(props);
  self.combo = 0;
  self.score = 0;
  self.focus = 0;
  self.maxCombo = 0;
  self.stats = {};
  self.scene = scene;
  var speed = 150;
  self.minX = self.x - 10;
  self.maxX = self.x + 10;
  self.v = {x:0.0, y:0.0};

  self.sequence = [];

  self.update = dt => {

    // Movement
    v = normalize(self.v); // What's this for?
    self.x += v.x*dt*speed;
    self.y += v.y*dt*speed;
    if (self.x < self.minX) { // TODO: Micronize
      self.v.x = 0;
      self.x = self.minX;
    }
    if (self.x > self.maxX) { // TODO: Micronize
      self.v.x = 0;
      self.x = self.maxX;
    }

    self.components.forEach(c => { 
      c.x = self.x + c.dx;
      c.y = self.y + c.dy;
    });
    self.frame = (self.frame + self.frameRate * dt) % 6;
    var iframe = ~~self.frame;
    iframe = (iframe+ self.bounceOffset) % 6;
    headOffset  =    [0,1,2,3,2,1][iframe];
    torsoOffset =    [0,1,2,2,1,0][iframe]; // For now, arms have the same offset as torso
    [self.components[0], self.components[1], self.components[6]].forEach(s => s.y += headOffset); // head sprites
    [self.components[2], self.components[3],self.components[4],self.components[5]].forEach(s => s.y += torsoOffset) // torso and arm sprites
  }
  self.setSprites = (rc) => {
    var f = rc.map((pi, i) => partsConfig[i][pi])
    self.components.forEach((c,i) => c.frames = f[~~(i/2)])
    if (bigHeads.indexOf(rc[0]) != -1) {
      self.components[0].dx = -8;
      [self.components[0], self.components[1]].forEach(s => s.small = false);
    }
  }
  self.arms = [false, false]; // Both down
  self.flipArm = (left) => {
    self.arms[left ? 0 : 1] = !self.arms[left ? 0 : 1];
    self.arms.forEach((s,i) => self.components[4+i].vFlip = s);
  }

  self.headPosition = 1; // Center;
  var selfPalette = paletteRenderer.palettes[self.paletteIndex]
  self.turnHead = (dir) => {
    self.headPosition = wrap(self.headPosition + dir, 4);
    self.components[6].visible = self.headPosition % 2 == 0;
    self.components[6].flipped = self.headPosition === 0;
    [self.components[0], self.components[1]].forEach(s => {
      s.visible = !self.components[6].visible
      self.headPosition === 3
        ? [2,3,4,5,6,7].forEach((i) => s.paletteOverrides[i] = selfPalette[i<6?1:5])
        : s.paletteOverrides = {};
    });
  }
  self.dash = dir => {
    self.v.x = dir;
  };
  self.draw = noop; // We don't draw this gameObject, it's just a container
  self.components = [...new Array(7)].map(x => GameObject([0, 0, [1], i+3, self.paletteIndex]));
  var c = self.components;
  c.forEach((x, i) => {
    x.small = true; // Unless big head
    x.dx = i < 4 ? (i%2) * 8 : -8 + (i%2) * 24;
    x.dy = i < 4 ? ~~(i/2) * 16 : 16;
    x.flipped = (i%2) != 0;
    self.scene.add(c[6-i]);
    if (i == 6) { // Sidehead
      x.dy = 0;
      x.dx = 0;
      x.small = false;
      x.visible = false;
    }
  });
  
  self.setPalette = index => c.forEach(x => x.paletteIndex = index);
  self._update = self.update;

  self.tryBeat = key => {
    var value = getBeatFor(Date.now());
    if ((~~value) == keyOnBeat.b) return; // beat already hit
    keyOnBeat.r = value;
    keyOnBeat.b = ~~value;
    var diff = keyOnBeat.r - keyOnBeat.b - 0.5;
    
    // permisive beat
    var intervals = [0.2, 0.5];
    var theBeat = keyOnBeat.b % 4 == 0;
    if (!theBeat && self.combo < 4) {
      self.badKey();
      return;
    }
    if (keyOnBeat%2 == 1 && self.combo < 16) {
      self.badKey();
      return;
    }
    if (!theBeat) {
      intervals = [0.1, 0.45];
    }
    diff = Math.abs(diff);
    if (diff < intervals[0]) {
      // keyOnBeat.p = 'perfect';
      zzfx(...[.6, 0.3, 508 + key, .03, .14, .22, 1, 1.93, -53.9, .2, u, .02, -0.01, -0.2, -0.1, u, u, .8, .03, .01]);
      GUI_CODE_EFFECT(GUI200, -16);
      self.addCombo();
      self.addKey(key);
      self.addFocus(self.combo % 2 == 0 ? 1 : 0);
    } else if (diff < intervals[1]) {
      //keyOnBeat.p = 'good';
      zzfx(...[.6, 0.3, 308+key, .03, .14, .22, 1, 1.93, -53.9, .2, u, .02, -0.01, -0.2, -0.1, u, u, .8, .03, .01]);
      GUI_CODE_EFFECT(GUI100, -10);
      self.addCombo();
      self.addKey(key);
      self.addFocus(self.combo % 3 == 0 ? 1 : 0);
    } else {
      self.badKey();
    }

  }
  
  self.overridePalette = function(index, color) {
    self.components.forEach(c => c.overridePalette(index, color));
  };

  self.addKey = function(key) {
    self.sequence.push(key);
    if (self.sequence.length == 4) {
      console.log('send command');
      self.score += checkStep(self.sequence);
      self.sequence = [];
    }
  }

  self.badKey = function() {
    GUI_CODE_EFFECT(GUI404, 5);
    //keyOnBeat.p = 'bad';
    zzfx(...[.6, 0.8, 0, .03, .14, .22, 4, 1.93, -53.9, .2, u, .02, -0.01, -0.2, -0.1, u, u, .8, .03, .01]);
    self.sequence = [];
    self.addFocus(-2);
  }

  self.addCombo = function() {
    self.combo +=1;
    if (self.combo > self.maxCombo) self.maxCombo = self.combo;
    //zzfx(...lazer);
  }
  
  self.addFocus = function(val) {
    self.focus += val;
    self.focus = self.focus>5?5:self.focus;
    if (self.focus < 0) {
      self.focus = 0;
      self.combo = 0;
    }
  }
  
  return self;
};