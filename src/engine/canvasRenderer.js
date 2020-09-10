
// src/canvasRenderer.js >>>

var c = document.getElementById('c');
var graphics = c.getContext('2d');

var imageDataBuffer = graphics.createImageData(W, H);
var pixels = imageDataBuffer.data;

function setPixel(x, y, r, g, b, a = 255) {
  var index = 4 * (x + y * imageDataBuffer.width);
  pixels[index] = r;
  pixels[index + 1] = g;
  pixels[index + 2] = b;
  pixels[index + 3] = a;
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
    graphics.font = "16px Lucida Console";
    graphics.strokeStyle = '#FFF'
    graphics.fillStyle = "red";
    //graphics.fillText(`SCORE: ${player.score}`, 0, 180);
    //graphics.fillText(`COMBO: ${player.combo}`, 0, 205);
    //graphics.fillText(`${keyOnBeat.performance}`, 200, 180);
    //graphics.fillText(`FOCUS: ${player.focus}`, 180, 205);
    //graphics.fillText(`MAX COMBO: ${player.maxCombo}`, 0, 230);
    graphics.fillText(`S: ${player.sequence}`, 0, 230);
    var text = '';
    if (gameState==2) {
      graphics.fillStyle = "black";
      if (subState == 0) {
       text = ['3', '2', '1', 'DANCE!'][~~(current_tick / 4)];
      } else if(subState == 2) {
        text = win?'YOU WIN':'YOU LOSE';
      }
    } else if (gameState!=2) {
      text = 'PRESS ENTER';
    }
    graphics.textAlign ='center';
    graphics.fillText(text, 192/2, 120);

    //graphics.fillText(` performance: `, 0, 230);
  }

  graphics.restore();
}


var gpiBoard = { sprite: 27, palette: 9, small: true, mirror: true }
var indexToSprite = { // Maps the map above to sprite and palette indexes 
  a: { sprite: 32, palette: 7 },
  b: { sprite: 33, palette: 7 },
  c: { sprites: [{ sprite: 41, palette: 8 }, { sprite: 41 + 8, palette: 8 }] },
  d: { sprite: 40, palette: 8 },
  e: { sprite: 40 + 8, palette: 8 },
  // GPI: Graphic Player Interface
  f: { ...gpiBoard, vFlip: true },
  g: { ...gpiBoard },
  h: { parts: { sprites: [6, 7, 6 + 8, 7 + 8], palette: 9, partIdx: 0 } },
};

var createComplements = (obj, complements = ['tr', 'bl', 'br'], small = true) => {
  var offsets = {
    tl: [0, 0, false], tr: [8, 0, false], bl: [0, 26, true], br: [8, 26, true]
  };

  return complements.map(k => {
    var p = GameObject([
      obj.x + offsets[k][0], obj.y + offsets[k][1],
      obj.frames, obj.frameRate,
      obj.paletteIndex
    ]);
    p.offsetX = offsets[k][0];
    p.offsetY = offsets[k][1];
    p.small = small;
    p.flipped = k === 'tr' || k === 'br';
    p.vFlip = obj.vFlip || (k === 'bl' || k === 'br');
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
        if (sd.mirror) createComplements(obj, ['tr']).forEach(p => scene.add(p));
        // ---------------------------------------------------------------------
      });
    }
  }
}

// ending file
