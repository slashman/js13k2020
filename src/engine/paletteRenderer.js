function splitSpriteData(spriteData, left) {
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
    shiftPalette: function (paletteId, start = 0, end = 7, direction = 1) {
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
    registerMetroPalette: function(target, paletteId, index, colorCycle) {
        target.push({
            paletteId,
            index,
            colorCycle: colorCycle.map(hex => hexToRgb(hex)),
            cycleIndex: 0,
            dir: 1
        })
    },
    tickPalette: function (paletteId, index, colorCycle) {
        this.registerMetroPalette(this.tickPalettes, ...arguments)
    },
    beatPalette: function (paletteId, index, colorCycle) {
        this.registerMetroPalette(this.beatPalettes, ...arguments)
    },
    metronomeCycle: function(target) {
        target.forEach((p) => {
            p.cycleIndex += p.dir;
            if (p.cycleIndex === p.colorCycle.length - 1) {
                p.dir = -1;
            } else if (p.cycleIndex === 0) {
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
                if (flip) {
                    index = sprite[(ry + 1) * w - 1 - x];
                }
                if (index == 0 && this.palettesWithTransparecy.includes(pi)){
                    // Palette 0 considers color 0 as "transparency"
                    continue;
                }
                var palette = this.palettes[pi];
                var color = palette[parseInt(index, 10)];
                if (overrides[index])
                    color = overrides[index];
                if (brightness != 1) 
                    color = fade(color, brightness);
                setPixel(x + px, y + py + vfo, color.r, color.g, color.b, 255);
            }
        }
    }
}

paletteRenderer.setSprites(sprites); // Using global variable tsk tsk


var marioPalette = [
    "#e8c498",
    "#ff0000",
    "#3b324a",
    "#6e8ece",
    "#0000ff",
    "#5bc4dc",
    "#d47564",
    "#257953"
];

paletteRenderer.palettes = [
    // Transparency // Outline // Shine // Cold Light // Warm Light // Cold Base // Base // Warm Base
    /*0*/  ["#FF0000", "#050320", "#ffffff", "#08b23b", "#47f641", "#1831a7", "#2890dc", "#5ee9e9"],
    /*1*/  ["#FF0000", "#050320", "#ffffff", "#e83b3b", "#fb6b1d", "#1831a7", "#2890dc", "#5ee9e9"],
    /*2*/  ["#FF0000", "#260503", "#fbff86", "#e83b3b", "#fb6b1d", "#7a3045", "#cd683d", "#fbb954"],
    /*3*/  ["#064273", "#76b6c4", "#7fcdff", "#1da2d8", "#def3f6", "#def3f6", "#1da2d8", "#064273"],
    /*4*/  ["#00a400", "#00a400", "#006f00", "#004600", "#007000", "#006f00", "#004600", "#007000"],
    /*5*/  ["#2e2e2e", "#e82b3b", "#c80b1b", "#a80000", "#880000", "#a80000", "#c80b1b", "#e82b3b"],
    /*6*/  ["#346f00", "#2a4600", "#e84723", "#a33b24", "#000000", "#000000", "#000000", "#000000"],
    /*7*/  ["#FF0000", "#FFF6F6", "#D82DEB", "#CB71EF", "#C7ADFF", "#E067B3", "#F4A4C4", "#FFDBDF"],
    /*8*/  ["#44891A", "#1B2632", "#F7E26B", "#493C2B", "#A46422", "#2F484E", "#44891A", "#A3CE27"],
    /*9*/  ["#221C1A", "#221C1A", "#FFF6F6", "#FFD541", "#FFFC40", "#423934", "#796755", "#E4D2AA"],
    /*10*/ ["#FF0000", "#221C1A", "#FFFFFF", "#08B23B", "#47F641", "#47F641"],
];
paletteRenderer.palettesWithTransparecy = [0,1,2,10]

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

paletteRenderer.palettes = paletteRenderer.palettes.map(palette => palette.map(hex => hexToRgb(hex)));

// Waterfall effect
setInterval(function() {
    paletteRenderer.shiftPalette(3, 1, 7, 1);
}, 100);

function randomPastel(){
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
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
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

function darker(rgb){
    var percent = 70;
    var r = rgb.r;
    var g = rgb.g;
    var b = rgb.b;
    r = Math.floor(r - (256 - r) * percent / 100);
    g = Math.floor(g - (256 - g) * percent / 100);
    b = Math.floor(b - (256 - b) * percent / 100);
    if (r < 0) r = 0;
    if (g < 0) g = 0;
    if (b < 0) b = 0;
    return {r,g,b};
  }


function fade(rgb, brightness = 0.3){
    var r = rgb.r;
    var g = rgb.g;
    var b = rgb.b;
    r *= brightness;
    g *= brightness;
    b *= brightness;
    if (r < 0) r = 0;
    if (g < 0) g = 0;
    if (b < 0) b = 0;
    return {r,g,b};
  }