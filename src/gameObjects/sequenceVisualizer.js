
var onBeat = false;
var sequenceVisualizer = {
  draw: _ => {
    for(var i=2;i<21;i++){
      for(var j=0;j<160;j++){
        setPixel(i, j, 0, 20, 20, 255);
      }
    }
    onBeat = false;
    for (var i = 0; i < 64; i += 1) {
      var beat = deepMX[1][sequence[indexSequence]][1][i + 2];
      var b = (i - current_beat);

      if (beat && b >= 0 && b < 24) {
        setPixel(9, 151 - b * 2 * 3, 250, 20, 0, 255);
        setPixel(9, 150 - b * 2 * 3, 250, 20, 0, 255);
        setPixel(10, 151 - b * 2 * 3, 250, 20, 0, 255);
        setPixel(10, 150 - b * 2 * 3, 250, 20, 0, 255);
        setPixel(11, 149 - b * 2 * 3, 200, 200, 100, 255);
        setPixel(11, 151 - b * 2 * 3, 200, 200, 100, 255);
        setPixel(11, 150 - b * 2 * 3, 200, 200, 100, 255);
        setPixel(11, 152 - b * 2 * 3, 200, 200, 100, 255);
        setPixel(12, 151 - b * 2 * 3, 250, 0, 0, 255);
        setPixel(12, 150 - b * 2 * 3, 250, 0, 0, 255);
        setPixel(13, 150 - b * 2 * 3, 250, 0, 0, 255);
        setPixel(13, 151 - b * 2 * 3, 250, 0, 0, 255);
      }
      onBeat = onBeat || b == 0 && beat;
    }
    for (let i = 0; i < 5; i++) {
      setPixel(6 + i, 150, 250, onBeat ? 0 : 255, 0, 255);
      setPixel(6 + i, 151, 250, onBeat ? 0 : 255, 0, 255);
      setPixel(6 + i, 151, 250, onBeat ? 0 : 255, 0, 255);
      setPixel(12 + i, 150, 250, onBeat ? 0 : 255, 0, 255);
      setPixel(12 + i, 151, 250, onBeat ? 0 : 255, 0, 255);
      setPixel(12 + i, 151, 250, onBeat ? 0 : 255, 0, 255);
    }
  },
  update: noop
};
