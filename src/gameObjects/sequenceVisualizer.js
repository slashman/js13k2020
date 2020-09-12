
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

var sequenceVisualizer = props => {
  var delta = 0;
  var beatsDisplayed = 2;
  var spacing = W / (beatsDisplayed*2);
  //var status = 0;
  var colors = [
    [10, 10, 10],
    [0, 255, 255],
    [0, 160, 100],
    [250, 0, 0],
  ];
  var line2 = [128, 1, 4, colors[2]];
  var lineIndexes = arrange(27,31);
  var beatLines = [];

  // The beat lines have 6 states
  [...lineIndexes, ...lineIndexes.reverse()].forEach((si, idx) => {
    // Top left of the beat line
    var tl = GameObject([-8, SIXTEEN  * props.y, [si], 1, 10])
    tl.flipped = idx > 5
    tl.small = true
    tl.visible = false
    var comp = createComplements(tl, [2]).pop()
    comp.flipped = idx <= 5
    comp.visible = false
    beatLines.push([tl, comp])
  })
  var scene = scene
  var segments = parseInt(W/8,10)

  return {
    visible: true,
    x: props.x,
    scene: props.scene,
    currentLine: 0,
    prevLine: 0,
    update: _ => {
      if (gameState != 2 || subState == 2) return;
      // startTime from metronome
      var base = timeBetweenBeats*4
      delta = ((Date.now() - startTime) % base)/base;
    },
    draw: _ => {
      beatLines.forEach(gp => gp.forEach(l => l.visible = false));
      if (gameState!=2 || subState == 2) return;
      for (var i = 0; i < beatsDisplayed; i++) {
        var des = ~~((i + delta) * spacing) - 1;
        var currentSegment = ~~(des*segments*10/W);
        var targetLine = ~~(currentSegment/segments);
        beatLines[targetLine].forEach(lp => {
          lp.visible = true
          lp.x = des-4 + lp.offsetX;
        });
        beatLines[(beatLines.length-1)-targetLine].forEach(lp => {
          lp.visible = true
          lp.x = (W - des - 2) + lp.offsetX;
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
    },
    updateLines: function(tick) {
      this.currentLine = wrap(tick, beatLines.length / 2)
    }
  }
};
