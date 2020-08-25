var partsConfig = [
[ // heads
    [1], //x8
    [2], //x8
    [2], //16
    [3], //16
    [4], //16
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
    [24],
    [24],
    [24]
]
];

var bigHeads = [2, 3, 4];

var Robot = props => {
    var self = GameObject(props);
    var speed = 150;
    self.minX = self.x - 10;
    self.maxX = self.x + 10;
    self.v = {x:0.0, y:0.0};

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
      headOffset =     [0,1,2,3,2,1][iframe];
      torsoOffset =    [0,1,2,1,0,0][iframe]; // For now, arms have the same offset as torso
      [self.components[0], self.components[1], self.components[6]].forEach(s => s.y += headOffset); // head sprites
      [self.components[2], self.components[3],self.components[4],self.components[5]].forEach(s => s.y += torsoOffset) // torso and arm sprites
    }
    self.setSprites = () => {
      var f = self.rc.map((pi, i) => partsConfig[i][pi])
      self.components.forEach((c,i) => c.frames = f[~~(i/2)])
      if (bigHeads.indexOf(self.rc[0]) != -1) {
        self.components[0].dx = -8;
        [self.components[0], self.components[1]].forEach(s => {
          s.small = false;
        });
      }
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
      if (self.headPosition != 1) {
        self.components[6].visible = true;
        [self.components[0], self.components[1]].forEach(s => s.visible = false);
        self.components[6].flipped = self.headPosition == 0;
      } else {
        self.components[6].visible = false;
        [self.components[0], self.components[1]].forEach(s => s.visible = true);
      }

    }
    self.dash = (dir)=> {
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
      mainScene.add(c[6-i]);
      if (i == 6) { // Sidehead
        x.dy = 0;
        x.dx = 0;
        x.small = false;
        x.visible = false;
      }
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

    self.overridePalette = function(index, color) {
      self.components.forEach(c => c.overridePalette(index, color));
    };
    
    return self;
  };