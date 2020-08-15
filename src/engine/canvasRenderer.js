// src/canvasRenderer.js >>>

var animationIndex = 0;
var pixelSize = 2;
//var frames = animations[0];

function draw() {
  //drawBackground();
  graphics.clearRect(0, 0, 320, 240);
  graphics.fillStyle = `hsl(${360*timeEnd*0.0005}, 50%, 30%)`;
  graphics.fillRect(10,10,300,220)
  sceneManager.draw();
}

// ending file
