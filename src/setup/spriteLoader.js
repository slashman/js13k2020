
// src/spriteLoader.js
// read and process the sprites to generate images
var CHAR_OFFSET = 200;
var scale = 3;
const pi = 2;
var palette = palettes[pi];


// Transforms a string of byte triads into a raw bitmap
function toSpriteData(bitsString) {
  var totalTriads = bitsString.length / 3;
  var triads = [];
  for (var i = 0; i < totalTriads; i++) {
      triads[i] = bitsString.slice(i*3, (i+1)*3);
  }
  return triads.map(triad => parseInt(triad, 2)).join('');
}
   
// Converts a string of characters into a string of bits
function charactersToBitsString(string) {
  var allBits = "";
  for (var i = 0; i < string.length; i++) {
    var charCode = string.charCodeAt(i);
    var bits = (charCode - CHAR_OFFSET).toString(2);
    bits = "0000000" + bits;
    allBits += bits.slice(bits.length - 8);
  }
  return allBits;
}

//var sprites = rawSprites.map(rs => toSpriteData(charactersToBitsString(rs)));

function drawSprite(sprite) {
  graphics.save();
  graphics.translate(0, 0);
  for (var j = 0; j < 16; j++) {
    for (var i = 0; i < 16; i++) {
      var index = sprite[j*16+i];
      if (index==1) continue;
      var color = palette[parseInt(index, 10)];
      graphics.fillStyle = color;
      graphics.fillRect(i*scale, j*scale, scale, scale);
    }
  }
  graphics.restore();
}

drawSprite(sprites[0])

var data = graphics.getImageData(0, 0, 16, 16);
var dataURL = c.toDataURL('image/png');
const img = new Image();

img.onload = function () {
}

img.src = dataURL;


