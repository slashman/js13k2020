
// src/spriteLoader.js
// read and process the sprites to generate images
var scale = 1;
var pi = 0;
var palette = palettes[pi];

var generateSpriteImage = sprite =>{
  graphicsPreloader.save();
  graphicsPreloader.clearRect(0, 0, SIXTEEN, SIXTEEN);
  graphicsPreloader.translate(0, 0);
  for (var j = 0; j < 256; j++) {
    var index = sprite[j];
    if (index==1) continue;
    var color = palette[parseInt(index, 10)];
    graphicsPreloader.fillStyle = color;
    graphicsPreloader.fillRect((j % SIXTEEN) * scale, ~~(j / SIXTEEN)*scale, scale, scale);
  }
  graphicsPreloader.restore();
  var dataURL = l.toDataURL('image/png');
  const img = new Image();
  img.src = dataURL;
  return img;
}

var imgs = sprites.map(sprite=>generateSpriteImage(sprite));


