
//var onBeat = false;
var nextBeats = [];
var onBeat = false;

var fillRectPixel = (x, y, w, h, color) => {
  for (var i = x; i < x + w && i < W; i++) {
    for (var j = y; j < y + h && j < H; j++) {
      setPixel(i, j, ...color);
    }
  }
}
var dekkk;
var sequenceVisualizer = props => {
  var banned = props.banned || [];
  var delta = 0;
  var beatsDisplayed = 3;
  var spacing = W / (beatsDisplayed*2);
  var status = 0;
  var colors = [
    [10, 10, 10],
    [0, 255, 255],
    [0, 160, 100],
    [250, 0, 0],
  ];
  var line = [150, 2, 10, colors[2]];
  return {
    visible: true,
    x: props.x,
    update: (dt, time) => {
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
      fillRectPixel(0, 150, W, 10, [0, 20, 20]);
      fillRectPixel(W*0.5-8, 147, 16, 16, colors[status]);
      fillRectPixel(W*0.5-7, 148, 14, 14, onBeat?colors[2]:colors[0]);
      for (var i = 0; i < beatsDisplayed; i++) {
        var des = ~~((i + delta) * spacing) - 1;
        fillRectPixel(des, ...line);
        fillRectPixel(W - des - 2, ...line);
      }
    }
  }
};
