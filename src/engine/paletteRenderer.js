
var splitSpriteData = (spriteData, left) =>{
  var splitSprite = [];
  var xOffset = left ? 0 : 8;
  for (var y = 0; y < 16; y++) {
    for (var x = 0; x < 8; x++) {
      splitSprite[y * 8 + x] = spriteData[y * 16 + x + xOffset];
    }
  }
  return splitSprite;
}

var paletteRenderer = {
  sprites: [],
  sprites8: [],
  beatPalettes: [],
  tickPalettes: [],
  setSprites: function (spriteData) {
    this.sprites = spriteData;
    spriteData.forEach((s,i) => {
      this.sprites8[i * 2] = splitSpriteData(s, true);
      this.sprites8[i * 2 + 1] = splitSpriteData(s);
    })
  },
  shiftPalette: function (paletteId, start = 0, end = 7) {
    var palette = this.palettes[paletteId];
    var lastColor = palette[end];
    for (var i = 0; i < end - start; i++) {
      palette[end - i] = palette[end - 1 - i];
    }
    palette[start] = lastColor;
  },
  cyclePaletteIndex: function (paletteId, index, colorCycle) {
    var cycleIndex = 0;
    var dir = 1;
    colorCycle = colorCycle.map(hex => hexToRgb(hex));
    return setInterval(() => {
      cycleIndex += dir;
      if (cycleIndex == colorCycle.length - 1) {
        dir = -1;
      } else if (cycleIndex == 0) {
        dir = 1;
      }
      this.palettes[paletteId][index] = colorCycle[cycleIndex];
    }, 200);
  },
  // registerMetroPalette
  rmp: function(target, paletteId, index, colorCycle) {
    target.push({
      paletteId,
      index,
      colorCycle: colorCycle.map(hex => hexToRgb(hex)),
      cycleIndex: 0,
      dir: 1
    })
  },
  tickPalette: function () {
    this.rmp(this.tickPalettes, ...arguments)
  },
  beatPalette: function () {
    this.rmp(this.beatPalettes, ...arguments)
  },
  metronomeCycle: function (target) {
    target.forEach(p => {
      p.cycleIndex += p.dir;
      if (p.cycleIndex == p.colorCycle.length - 1) {
        p.dir = -1;
      } else if (p.cycleIndex == 0) {
        p.dir = 1;
      }
      this.palettes[p.paletteId][p.index] = p.colorCycle[p.cycleIndex];
    })
  },
  onMetronomeTick: function () {
    this.metronomeCycle(this.tickPalettes)
  },
  onMetronomeBeat: function () {
    this.metronomeCycle(this.beatPalettes)
  },
  draw: function (spriteId, x, y, pi, flip, vflip, small, overrides, brightness) {
    this.drawRaw(small ? this.sprites8[spriteId] : this.sprites[spriteId], x, y, pi, flip, vflip, small, overrides, brightness);
  },
  drawRaw: function (sprite, px, py, pi, flip, vflip, small, overrides, brightness) { // TODO: Just receive a gameObject and use its attributes
    var w = small ? 8 : 16;
    for (var y = 0; y < 16; y++) {
      for (var x = 0; x < w; x++) {
        var ry = vflip ? 16 - 1 - y : y;
        var vfo = vflip ? -10 : 0;
        var index = sprite[ry * w + x];
        if (flip) index = sprite[(ry + 1) * w - 1 - x];
        
        // Palette 0 considers color 0 as "transparency"
        if (index == 0 && this.palettesWithTransparecy.includes(pi)) continue;
        var color = this.palettes[pi][parseInt(index, 10)];
        
        if (overrides[index]) color = overrides[index];
        if (brightness != 1) color = fade(color, brightness);
        setPixel(x + px, y + py + vfo, color.r, color.g, color.b, 255*brightness);
      }
    }
  }
}

paletteRenderer.setSprites(sprites); // Using global variable tsk tsk


paletteRenderer.palettes = [
    // Transparency // Outline // Shine // Cold Light // Warm Light // Cold Base // Base // Warm Base
    /*0*/  ['v00', '004', 'vvv', '1m7', '8u8', '36k', '5ir', 'btt'],
    /*1*/  ['v00', '004', 'vvv', 't77', 'vd3', '36k', '5ir', 'btt'],
    /*2*/  ['v00', '400', 'vvg', 't77', 'vd3', 'f68', 'pd7', 'vna'],
    /*3*/  ['08e', 'emo', 'fpv', '3kr', 'ruu', 'ruu', '3kr', '08e'],
    /*4*/  ['0k0', '0k0', '0d0', '080', '0e0', '0d0', '080', '0e0'],
    /*5*/  ['555', 't57', 'p13', 'l00', 'h00', 'l00', 'p13', 't57'],
    //6    ['#346f00", "#2a4600", "#e84723", "#a33b24", "#000000", "#000000", "#000000", "#000000'],
           ['6d0', '580', 't84', 'k74',u,u,u,u],
    //7    ['#FF0000", "#FFF6F6", "#D82DEB", "#CB71EF", "#C7ADFF", "#E067B3", "#F4A4C4", "#FFDBDF'],
           ['v00', 'vuu', 'r5t', 'pet', 'olv', 'scm', 'uko', 'vrr'],
    //8    ["#44891A", "#1B2632", "#F7E26B", "#493C2B", "#A46422", "#2F484E", "#44891A", "#A3CE27"],
           ['8h3', '346', 'usd', '975', 'kc4', '599', '8h3', 'kp4'],
    //9    ["#FF0000", "#221C1A", "#FFF6F6", "#FFD541", "#FFFC40", "#423934", "#796755", "#E4D2AA"],
           ['v00', '433', 'vuu', 'vq8', 'vv8', '876', 'fca', 'sql'],
    //10   ["#FF0000", "#221C1A", "#FFFFFF", "#08B23B", "#47F641", "#47F641"],
           ['v00', '433', 'vvv', '1m7', '8u8', '8u8'],
    //11   ["#000000", "#000000", "#111111", "#000000", "#111111", "#000000", "#111111", "#000000"],
           [u,u, '222',u, '222',u, '222',u, u],
    //12   ["#FF0000", "#000000", "#25000D", "#E214A8", "#293F21", "#C4F129", "#115E33", "#15C2A5"],
           /* numbers */
           ['v00',u, '401', 's2l', '574', 'ou5', '2b6', '2ok'],
    //13   ['#FF0000", "#09070D", "#ECEEEF", , , "#353658", "#8B97B6", "#C5CDDB'], ?????
           ['v00', '433', 'vuu', 'vq8', 'vv8', '876', 'fca', 'sql'],
];
paletteRenderer.palettesWithTransparecy = [0,1,2,9,10,11,12, 13]

var parseColor = val => parseInt(val, 32)*8;
var hexToRgb = hex => {
  return hex ? {
    r: parseColor(hex[0]),
    g: parseColor(hex[1]),
    b: parseColor(hex[2])
  } : {r: 0, g: 0, b: 0};
}

paletteRenderer.palettes = paletteRenderer.palettes.map(palette => palette.map(hexToRgb));

// Waterfall effect
setInterval(_ => {
  paletteRenderer.shiftPalette(3, 1, 7, 1);
}, 100);

var randomPastel = _ => {
  var array = hslToRgb(Math.random(), 0.7, 0.5);
  return {
    r: array[0], g: array[1], b: array[2]
  }
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
var hslToRgb = (h, s, l) => {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = (p, q, t) => {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

var normalizeColor = ({r, g, b}) => {
  if (r < 0) r = 0;
  if (g < 0) g = 0;
  if (b < 0) b = 0;
  return { r, g, b };
}

var darker = ({r, g, b}) => {
  var percent = 70;
  r = ~~(r - (256 - r) * percent / 100);
  g = ~~(g - (256 - g) * percent / 100);
  b = ~~(b - (256 - b) * percent / 100);
  
  return normalizeColor({r , g, b});
}


var fade = ({r, g, b}, brightness = 0.3) => {
  return normalizeColor({ r: r*brightness, g: g*brightness, b: b*brightness });
}
