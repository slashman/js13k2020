
//var onBeat = false;
var nextBeats = [];
var onBeat = false;
var sequenceVisualizer = props => {
  var banned = props.banned || [];
  return {
    x: props.x,
    draw: _ => {
      for(var i=2;i<21;i++){
        for(var j=0;j<160;j++){
          setPixel(props.x + i, j, 0, 20, 20, 255);
        }
      }

      for (var i = current_tick; i < current_tick+24 && i < fullBeatSequence[props.instrument].length; i += 1) {
        var beat = fullBeatSequence[props.instrument][i];
        var b = (i - current_tick);

        if (beat && banned.indexOf(beat) ==-1) {
          setPixel(props.x + 9, 151 - b * 6, 250, 20, 0, 255);
          setPixel(props.x + 9, 150 - b * 6, 250, 20, 0, 255);
          setPixel(props.x + 10, 151 - b * 6, 250, 20, 0, 255);
          setPixel(props.x + 10, 150 - b * 6, 250, 20, 0, 255);
          setPixel(props.x + 11, 149 - b * 6, 200, 200, 100, 255);
          setPixel(props.x + 11, 151 - b * 6, 200, 200, 100, 255);
          setPixel(props.x + 11, 150 - b * 6, 200, 200, 100, 255);
          setPixel(props.x + 11, 152 - b * 6, 200, 200, 100, 255);
          setPixel(props.x + 12, 151 - b * 6, 250, 0, 0, 255);
          setPixel(props.x + 12, 150 - b * 6, 250, 0, 0, 255);
          setPixel(props.x + 13, 150 - b * 6, 250, 0, 0, 255);
          setPixel(props.x + 13, 151 - b * 6, 250, 0, 0, 255);
        }
      }
      for (let i = 0; i < 5; i++) {
        setPixel(props.x + 6 + i, 150, 250, onBeat ? 0 : 255, 0, 255);
        setPixel(props.x + 6 + i, 151, 250, onBeat ? 0 : 255, 0, 255);
        setPixel(props.x + 6 + i, 151, 250, onBeat ? 0 : 255, 0, 255);
        setPixel(props.x + 12 + i, 150, 250, onBeat ? 0 : 255, 0, 255);
        setPixel(props.x + 12 + i, 151, 250, onBeat ? 0 : 255, 0, 255);
        setPixel(props.x + 12 + i, 151, 250, onBeat ? 0 : 255, 0, 255);
      }
    },
    update: noop
  }
};
