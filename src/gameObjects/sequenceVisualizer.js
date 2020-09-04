
//var onBeat = false;
var nextBeats = [];
var onBeat = false;

var fillRectPixel = (x, y, w, h, color) => {
  for (var i = x<0?0:x; i < x + w && i < W; i++) {
    for (var j = y<0?0:y; j < y + h && j < H; j++) {
      setPixel(i, j, ...color);
    }
  }
}
var dekkk;
var sequenceVisualizer = props => {
  var banned = props.banned || [];
  var delta = 0;
  var beatsDisplayed = 2;
  var spacing = W / (beatsDisplayed*2);
  var status = 0;
  var colors = [
    [10, 10, 10],
    [0, 255, 255],
    [0, 160, 100],
    [250, 0, 0],
  ];
  var line = [150, 2, 10, colors[2]];
  var line2 = [152, 1, 6, colors[2]];

  // The beat lines have 6 states
  var beatLines = [127,126,125,125-16,125-32,125-48,125-48,125-32,125-16,125,126,127].map((si) => {
    // Top left of the beat line
    var tl = GameObject([-8, (SIXTEEN * scale) * 8, [si], 1, 10])
    tl.small = true
    tl.visible = false
    const comp = createComplements(tl, ['bl']).pop()
    comp.flipped = true
    comp.visible = false
    return [
      tl,
      comp
    ]
  })
  var scene = scene
  var segments = parseInt(W/12,10)

  return {
    visible: true,
    x: props.x,
    scene: props.scene,
    update: (dt, time) => {
      if (!playingMusic) return;
      // startTime from metronome
      var base = timeBetweenBeats*4
      delta = ((Date.now() - startTime) % base)/base;
      if (onBeat) {
        if (keyOnBeat.beat == current_tick){
          status = 1;  // good!
        } else {
          status = 2; // miss!
        }
      } else {
        if (keyOnBeat.beat == current_tick) {
          status = 3; // bad!
        } else {
          status = 0; // normal
        }
      }
    },
    draw: _ => {
      if (!playingMusic) return;
      // fillRectPixel(0, 150, W, 10, [0, 20, 20]);
      // fillRectPixel(W*0.5-8, 147, 16, 16, colors[status]);
      // fillRectPixel(W*0.5-7, 148, 14, 14, onBeat?colors[2]:colors[0]);
      beatLines.forEach(gp => gp.forEach(l => l.visible = false))
      for (var i = 0; i < beatsDisplayed; i++) {
        var des = ~~((i + delta) * spacing) - 1;
        var currentSegment = parseInt((des*100/(W/2)), 10)
        var targetLine = parseInt(currentSegment/segments,10)
        // fillRectPixel(des, ...line);
        // fillRectPixel(W - des - 2, ...line);
        beatLines[targetLine].forEach(lp => {
          lp.visible = true
          lp.x = des + lp.offsetX
        });
        beatLines[11-targetLine].forEach(lp => {
          lp.visible = true
          lp.x = (W - des - 2) + lp.offsetX
        });

        var a = ~~(des + spacing * 0.5);
        var b = ~~(W - des - 2 - spacing * 0.5);
        if (a < W/2) {
          if (player.combo >= 4) {
            fillRectPixel(a, ...line2);
            fillRectPixel(b, ...line2);
          }
          if (player.combo >= 16) {
            fillRectPixel(a - spacing*0.25, ...line2);
            fillRectPixel(a - spacing*0.75, ...line2);
            fillRectPixel(b + spacing*0.25, ...line2);
            fillRectPixel(b + spacing*0.75, ...line2);
          }
          
        }
      }
    },
    addBeatLinesToScene: function() {
      beatLines.forEach(l => l.forEach(lp => this.scene.add(lp)))
    }
  }
};
