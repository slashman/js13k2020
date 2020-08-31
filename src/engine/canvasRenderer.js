
// src/canvasRenderer.js >>>

var c = document.getElementById('c');
var graphics = c.getContext('2d');

var imageDataBuffer = graphics.createImageData(W, H);
var pixels = imageDataBuffer.data;

function setPixel(x, y, r, g, b, a = 255) {
  var index = 4 * (x + y * imageDataBuffer.width);
  pixels[index+0] = r;
  pixels[index+1] = g;
  pixels[index+2] = b;
  pixels[index+3] = a;
}

function clearPixels() {
  // This doesn't seem to be very expensive, but we don't need it either
  imageDataBuffer = graphics.createImageData(W, H);
  pixels = imageDataBuffer.data;
}

var draw = _ => {
  // clearPixels(); // We don't need to do this if there's a full background, which there should always be?
  sceneManager.draw();

  graphics.save(); // Do we even need to save and restore?
  // draw the buffer
  graphics.putImageData(imageDataBuffer, 0, 0);
  
  if (DEBUG) {
    graphics.font = "26px Courier New";
    graphics.strokeStyle = '#FFF'
    graphics.fillStyle = "red";
    graphics.fillText(`score: ${player.score}`, 0, 180);
    graphics.fillText(`combo: ${player.combo}`, 0, 205);
    graphics.fillText(`${keyOnBeat.performance}`, 200, 180);
    graphics.fillText(`focus: ${player.focus}`, 180, 205);
    graphics.fillText(`maxCombo: ${player.maxCombo}`, 0, 230);

    //graphics.fillText(` performance: `, 0, 230);
  }

  graphics.restore();
}

// ending file
