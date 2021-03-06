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
  self.v = {x:0.0, y:0.0};
  self.isPC = false;

  self.sequence = [];

  self.update = dt => {
    // GUI
    if (self.gc && !self.gc.inErr) {
      self.gc.x = self.x+EIGHT-(self.gc.width/2);
      self.gc.y = self.y+THIRTYTWO;
    }

    // Movement
    self.c.forEach(c => { 
      c.x = self.x + c.dx;
      c.y = self.y + c.dy;
    });
    self.frame = (self.frame + self.frameRate * dt) % 6;
    var iframe = ~~self.frame;
    iframe = (iframe+ self.bounceOffset) % 6;
    headOffset  =    [0,1,2,3,2,1][iframe];
    torsoOffset =    [0,1,2,2,1,0][iframe]; // For now, arms have the same offset as torso
    [self.c[0], self.c[1], self.c[6]].forEach(s => s.y += headOffset); // head sprites
    [self.c[2], self.c[3],self.c[4],self.c[5]].forEach(s => s.y += torsoOffset) // torso and arm sprites
  }
  self.setSprites = (rc) => {
    var f = rc.map((pi, i) => partsConfig[i][pi])
    self.c.forEach((c,i) => c.frames = f[~~(i/2)])
    if (bigHeads.indexOf(rc[0]) != -1) {
      self.c[0].dx = -8;
      [self.c[0], self.c[1]].forEach(s => s.small = false);
    }
  }
  self.arms = [false, false]; // Both down
  self.flipArm = (left) => {
    self.arms[left ? 0 : 1] = !self.arms[left ? 0 : 1];
    self.arms.forEach((s,i) => self.c[4+i].vFlip = s);
  }

  self.headPosition = 1; // Center;
  var selfPalette = paletteRenderer.palettes[self.paletteIndex]
  self.turnHead = (dir) => {
    self.headPosition = wrap(self.headPosition + dir, 4);
    self.c[6].visible = self.headPosition % 2 == 0;
    self.c[6].flipped = self.headPosition === 0;
    [self.c[0], self.c[1]].forEach(s => {
      s.visible = !self.c[6].visible
      self.headPosition === 3
        ? [2,3,4,5,6,7].forEach((i) => s.paletteOverrides[i] = selfPalette[i<6?1:5])
        : s.paletteOverrides = {};
    });
  }
  self.dash = dir => {
    addAnimation(self, 'x', self.x, self.x+dir*10, 100);
    if (self.isPC) zzfx(.7,.5,50,.12,.06,0,3,u,u,50,500,.6,u,.8,15,u,.02,.65,.06,.01);
  };
  self.draw = noop; // We don't draw this gameObject, it's just a container
  self.c = [...new Array(7)].map(x => GameObject([0, 0, [1], i+3, self.paletteIndex]));
  var c = self.c;
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
      if (self.isPC) {
        zzfx(...[u,50,15,u,u,.21,u,1.84,.5,450,u,.7,u,.4,u,.1,.02,u,.01,.01]);
        GUI_CODE_EFFECT(GUI200, -16);
        self.addCombo();
        self.addFocus(self.combo % 2 == 0 ? 1 : 0);
      }
      self.addKey(key);
    } else if (diff < intervals[1]) {
      //keyOnBeat.p = 'good';
      if (self.isPC) {
        zzfx(...[u,6,50,u,.3,.8,u,9,5,90,u,u,u,.7,50,.2,.02,u,.6,.01]);
        GUI_CODE_EFFECT(GUI100, -10);
        self.addCombo();
        self.addFocus(self.combo % 3 == 0 ? 1 : 0);
      }
      self.addKey(key);
    } else {
      self.badKey();
    }

  }
  
  self.overridePalette = function(index, color) {
    self.c.forEach(c => c.overridePalette(index, color));
  };

  self.addKey = function(key) {
    self.sequence.push(key);
    self.gc.setText(
      self.sequence.reduce((com, cod) => com+String.fromCharCode(cod).toLowerCase(),''),
      self.gc.dfltStroke,
      self.gc.dfltFill
    );
    self.gc.b = 1;
    self.gc.inErr = false;
    if (self.sequence.length == 4) {
      GUI_CODE_EFFECT(self.gc,null,300,{y:SIXTEEN});
      self.score += checkStep(self.sequence);
      if (self.score >= level.score) finishGame();
      self.sequence = [];
      setTimeout(() => self.gc.setText(''),300+350);
    }
  }

  self.badKey = function() {
    self.isPC && hudScene.feedback(404);
    // SFX - GECKO
    zzfx(...[self.isPC?.7:.2, u, self.isPC?220:80, u, .1, u, 1, .3, 1, 15, 400, .05, .03, 1.1, u, .4, u, .5]);

    self.gc.setText(self.gc.rawText+'*', 's2l', '401');
    self.gc.x = self.x+EIGHT-(self.gc.width/2);
    self.gc.b = 1;
    self.gc.inErr = true;
    GUI_CODE_EFFECT(self.gc,null,500,{y: self.gc.y+SIXTEEN});
    shakeIt(self.gc,0.1,500);
    setTimeout(() => self.gc.inErr = false, 800);
    self.sequence = [];
    self.addFocus(-1);
  }

  self.addCombo = function() {
    self.combo +=1;
    if (self.combo > self.maxCombo) self.maxCombo = self.combo;
    //zzfx(...lazer);
  }
  
  self.addFocus = function(val) {
    var temp = self.focus;
    self.focus += val;
    self.focus = self.focus>4?4:self.focus;
    if (self.focus < 0) {
      self.focus = 0;
      self.combo = 0;
    }

    if (temp == self.focus || !self.isPC) return;
    if (self.focus == 4) enterZone(...allSlides[rando(0, 4)]);

    if (self.focus === 0) {
      exitZone();
      zzfx(...[1.4,u,338,u,.15,.06,1,.4,.4,.1,-250,.03,.02,.6,-13,u,.11,.74,u,.17]);// SFX - GECKO -- switch up todos al tiempo
      // SFX - GECKO -- switch up todos al tiempo
      // guiFocusSwitches.forEach(g => g.forEach( s => {
      //   s.frame=0;
      //   s.paletteOverrides={3:hexToRgb('574')};
      // }));
    //} else {
      // SFX - GECKO -- switch down
      //zzfx(...[u,.1,349,u,.05,.04,u,.7,70,4,50,-0.12,.03,.8,16,.1,.06,.8,.05]);// SFX - GECKO -- switch down
      // guiFocusSwitches[self.focus-1].forEach(s => {
      //   s.frame=1;
      //   s.paletteOverrides={3:hexToRgb('ou5')};
      // });
    }
  }
  
  return self;
};