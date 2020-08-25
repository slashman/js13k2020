var partsConfig = [
[ // heads
    [1],
    [2]
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
    [25],
    [26]
]
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
      iframe = (iframe+ self.bounceOffset) % 6;
      headOffset =     [0,1,2,3,2,1][iframe];
      torsoOffset =    [0,1,2,1,0,0][iframe]; // For now, arms have the same offset as torso
      [self.components[0], self.components[1]].forEach(s => s.y += headOffset); // head sprites
      [self.components[2], self.components[3],self.components[4],self.components[5]].forEach(s => s.y += torsoOffset) // torso and arm sprites
    }
    self.setSprites = () => {
      var f = self.rc.map((pi, i) => partsConfig[i][pi])
      self.components.forEach((c,i) => c.frames = f[~~(i/2)])
    }
    self.arms = [false, false]; // Both down
    self.flipArm = (left) => {
      self.arms[left ? 0 : 1] = !self.arms[left ? 0 : 1];
      self.arms.forEach((s,i) => self.components[4+i].vFlip = s);
    }
    self.headPosition = 1; // Center;
    self.turnHead = (dir) => {
      self.headPosition += dir;
      if (self.headPosition < 0) self.headPosition = 0; // TODO: Compress
      if (self.headPosition > 2) self.headPosition = 2; // TODO: Compress
      self.components[1].visible = self.headPosition == 1;
      if (self.headPosition != 1) {
        self.components[0].dx = 8;
        self.components[0].flipped = self.headPosition == 0;
        self.components[0].frames = partsConfig[3][self.rc[0]];
      } else {
        self.components[0].frames = partsConfig[0][self.rc[0]];
        self.components[0].flipped = false;
        self.components[0].dx = 0;
      }

    }
    self.draw = noop; // We don't draw this gameObject, it's just a container
    self.components = [...new Array(6)].map(x => GameObject([0, 0, [1], i+3, self.paletteIndex]));
    var c = self.components;
    c.forEach((x, i) => {
      x.dx = i < 4 ? (i%2) * 16 : -8 + (i%2) * 32;
      x.dy = i < 4 ? ~~(i/2) * 16 : 16;
      x.flipped = (i%2) != 0;
      mainScene.add(c[5-i]);
    });
    self.setPalette = (index) => {
      c.forEach(x=>x.paletteIndex=index);
    };
    self._update = self.update;

    self.flipArm(false);

    self.tryBeat = key => {
      if (key == self.lastKey) {
        // Nope. Must be different everytime (testing)
        return;
      }
      var value = getBeatFor(Date.now());
      var diff = ((~~value) + 0.5 - value)*100;
      var performance = diff*diff;
      keyOnBeat.rawBeat = value;
      keyOnBeat.beat = ~~value;
      keyOnBeat.performance = performance;
      console.log(value, fullBeatSequence[keyOnBeat.beat] ? 'ok' : `${fullBeatSequence[0][keyOnBeat.beat]} ${fullBeatSequence[1][keyOnBeat.beat]}`)
    }
    
    return self;
  };