
// src/canvasRenderer.js >>>

var c = document.getElementById('c');
var graphics = c.getContext('2d');

var imageDataBuffer = graphics.createImageData(W, H);
var pixels = imageDataBuffer.data;

function setPixel(x, y, r, g, b, a = 255) {
  var index = 4 * (x + y * imageDataBuffer.width);
  a = a/255;
  var [aa, cc] = [a, 1 - a];
  pixels[index] = aa*r + cc*pixels[index];
  pixels[index + 1] = aa*g + cc*pixels[index+1];
  pixels[index + 2] = aa*b + cc*pixels[index+2];
  pixels[index + 3] = 255;
}

function clearPixels() {
  // This doesn't seem to be very expensive, but we don't need it either
  imageDataBuffer = graphics.createImageData(W, H);
  pixels = imageDataBuffer.data;
}

var draw = _ => {
  clearPixels(); // We don't need to do this if there's a full background, which there should always be?
  //graphics.clearRect(0, 0, W, H);
  sceneManager.draw();

  graphics.save(); // Do we even need to save and restore?
  // draw the buffer
  graphics.putImageData(imageDataBuffer, 0, 0);
  
  graphics.restore();
}

// The mirror property will be used to draw another sprite in front of the one
// that needs to be mirrored. Something like what we do for the robotz heads.
var gpiBoard = { sprite: 43, palette: 9, small: true, mirror: true }
var indexToSprite = { // Maps the map above to sprite and palette indexes 
  a: { sprite: 56, palette: 7 },
  b: { sprite: 57, palette: 7 },
  c: { sprites: [{ sprite: 62, palette: 8 }, { sprite: 63, palette: 8 }] },
  // GPI: Graphic Player Interface
  f: { ...gpiBoard, vFlip: true },
  g: { ...gpiBoard },
};

// tl = 0
// tr = 1
// bl = 2
// br = 3
var createComplements = (obj, complements = [1, 2, 3], small = true) => {
  var offsets = [
    [0, 0], [8, 0], [0, 26], [8, 26]
  ];

  return complements.map(k => {
    var p = GameObject([
      obj.x + offsets[k][0], obj.y + offsets[k][1],
      obj.frames, obj.frameRate,
      obj.paletteIndex
    ]);
    p.offsetX = offsets[k][0];
    p.offsetY = offsets[k][1];
    p.small = small;
    p.flipped = k != 3;
    p.vFlip = obj.vFlip || k != 1;
    return p;
  });
}

var loadMap = (map, scene, offset = { x: 0, y: 0 }) =>{
  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      var char = map[y].charAt(x);
      var spriteData = indexToSprite[char];
      if (spriteData.parts) spriteData = [{ ...spriteData.parts, sprite: spriteData.parts.sprites[spriteData.parts.partIdx++] }]
      else if (!spriteData.sprites) spriteData = [spriteData];
      else spriteData = spriteData.sprites;
      
      spriteData.forEach(sd => {
        var obj = GameObject([SIXTEEN * (x + offset.x), SIXTEEN * (y + offset.y), [sd.sprite], i + 3, sd.palette]);
        obj.small = sd.small || false
        obj.vFlip = sd.vFlip || false
        if (obj.vFlip) obj.y += 10
        scene.add(obj);

        // Draw a mirrored object in front of the created one (like with the
        // heads) --------------------------------------------------------------
        // TODO: There should be a better way to do this for sure
        if (sd.mirror) createComplements(obj, [1]).forEach(p => scene.add(p));
        // ---------------------------------------------------------------------
      });
    }
  }
}

// ending file
