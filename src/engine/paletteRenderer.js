
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
        var color = this.palettes[pi][index];
        
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
    //0    ['#FF0000', '#02001F','#FFFFFF','#009E2F','#21FF1A','#0024C2','#008CF0','#50F7F7'] >>> Blue roboto
           [RED, '003', 'vvv', '0j5', '4v3', '04o', '0hu', 'auu'],
    /*1*/  [RED, '004', 'vvv', 't77', 'vd3', '36k', '5ir', 'btt'],
    //2    ['#FF0000', '#1F0200','#FCFF66','#F90B0B','#FF7B00','#941037','#FA4700','#FF9D0A'] >>> Red roboto
           [RED, '300', 'vvc', 'v11', 'vf0', 'i26', 'v80', 'vj1'],
    /*3*/  ['08e', 'emo', 'fpv', '3kr', 'ruu', 'ruu', '3kr', '08e'],
    /*4*/  ['0k0', '0k0', '0d0', '080', '0e0', '0d0', '080', '0e0'],
    /*5*/  ['555', 't57', 'p13', 'l00', 'h00', 'l00', 'p13', 't57'],
    //6    ['#346f00", "#2a4600", "#e84723", "#a33b24", "#000000", "#000000", "#000000", "#000000'],
           [u, u, u, u,u,u,u,u],
    //7    ['#FF0000", "#FFF6F6", "#D82DEB", "#CB71EF", "#C7ADFF", "#E067B3", "#F4A4C4", "#FFDBDF'],
           [RED, 'vuu', 'r5t', 'pet', 'olv', 'scm', 'uko', 'vrr'],
    //8    ["#44891A", "#1B2632", "#F7E26B", "#493C2B", "#A46422", "#2F484E", "#44891A", "#A3CE27"],
           [u, u, u, u, u, u, u, u],
    //9    ["#FF0000", "#221C1A", "#FFF6F6", "#FFD541", "#FFFC40", "#423934", "#796755", "#E4D2AA"],
           [RED, '433', 'vuu', 'vq8', 'vv8', '876', 'fca', 'sql'],
    //10   ["#FF0000", "#221C1A", "#FFFFFF", "#08B23B", "#47F641", "#47F641"],
           [RED, '433', 'vvv', '1m7', '8u8', '8u8'],
    //11   ["#000000", "#000000", "#111111", "#000000", "#111111", "#000000", "#111111", "#000000"],
           [u,u, '222',u, '222',u, '222',u, u],
    //12   ["#FF0000", "#000000", "#25000D", "#E214A8", "#293F21", "#C4F129", "#115E33", "#15C2A5"],
           /* numbers */
           [RED,u, '401', 's2l', '574', 'ou5', '2b6', '2ok'],
    //13   ['#FF0000', '#09070D', '#ECEEEF', '#FF4F69', '#FFDA45', '#353658', '#8B97B6', '#C5CDDB'],
           [RED, '101', '8u8', '6d0', '580', '66b', 'him', 'opr'],
           [RED, '101', 'jr8', 'bo6', '2k5', '3f7', '4a7', '244'],
    //15   ['#000000', '#202020','#404040','#606060','#808080','#a0a0a0','#c0c0c0','#e0e0e0'] >>> grayscale
           ['gko', 'vsc', 'ujv', 'mt1', '3rv', 'veb', 'uvt', 'r5t'],
           ['222', '555', '888', 'aaa', '888', '555', '222', '111'],
           ['000', '111', '222', '333', '444', '555', '666', '777'],
    // 18 ['#FF0000', '#021812', '#C7FFCC', '#00A1E6', '#1ADDFF', '#08676E', '#3F9509', '#B2EA0B'] >>> Green roboto
           [RED, '032', 'ovp', '0ks', '3rv', '1cd', '7i1', 'mt1'],
           //3    ['#FF0000','#11083F','#FDE6FF','#F95875','#FD9BA3','#7354FC','#BF7BFE','#F19AFE'] >>> Pink roboto
           [RED, '217', 'vsv', 'vbe', 'vjk', 'eav', 'nfv', 'ujv'],
           //4    ['#FF0000','#11080B','#F5FFE8','#4386A3','#72E3A7','#B9631D','#F8B02A','#FEE762'] >>> Gold roboto
           ['0k0', '211', 'uvt', '8gk', 'esk', 'nc3', 'vm5', 'vsc'],
            //5    ['#FF0000','#070A18','#DCEAEE','#4D896E','#86D59A','#37465C','#566F95','#80A3C2'] >>> Grey roboto
           ['555', '013', 'rtt', '9hd', 'gqj', '68b', 'adi', 'gko']
];
paletteRenderer.palettesWithTransparecy = [0,1,2,9,10,11,12, 13,18,19,20,21];

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
  
  paletteRenderer.shiftPalette(15, 0, 7, -1);
  paletteRenderer.shiftPalette(16, 0, 7, -1);
}, 150);

var normalizeColor = ({r, g, b}) => {
  if (r < 0) r = 0;
  if (g < 0) g = 0;
  if (b < 0) b = 0;
  return { r, g, b };
}

var fade = ({r, g, b}, brightness = 0.3) => {
  return normalizeColor({ r: r*brightness, g: g*brightness, b: b*brightness });
}
