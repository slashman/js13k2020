var paletteRenderer = {
    sprites: [],
    saveSprite: function (spriteId, spriteData) {
        this.sprites[spriteId] = spriteData;
    },
    shiftPalette: function (paletteId, start, end, direction) {
        var palette = this.palettes[paletteId];
        var lastColor = palette[7];
        for (var i = 0; i < 7; i++) {
            palette[7 - i] = palette[6 - i];
        }
        palette[0] = lastColor;
    },
    draw: function (spriteId, x, y, pi, flip) {
        this.drawRaw(this.sprites[spriteId], x, y, pi, flip);
    },
    drawRaw: function (sprite, px, py, pi, flip) {
        for (var y = 0; y < 16; y++) {
            for (var x = 0; x < 16; x++) {
                var index = sprite[y * 16 + x];
                if (flip) {
                    index = sprite[(y + 1) * 16 - 1 - x];
                }
                if (index == 1 && pi == 0){
                    // Palette 0 considers color 0 as "transparency"
                    continue;
                }
                var palette = this.palettes[pi];
                var color = palette[parseInt(index, 10)];
                setPixel(x + px, y + py, color.r, color.g, color.b, 255);
            }
        }
    }
}

paletteRenderer.sprites = sprites; // Using global variable tsk tsk


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

var oceanPalette = [
    "#064273",
    "#76b6c4",
    "#7fcdff",
    "#1da2d8",
    "#def3f6",
    "#def3f6",
    "#1da2d8",
    "#064273"
];

var grassPalette = [
    "#346f00",
    "#2a4600",
    "#c87000",
    "#ffa400",

    "#000000", // else it breaks
    "#000000",
    "#000000",
    "#000000"
];

var rosePalette = [
    "#346f00",
    "#2a4600",
    "#e84723",
    "#a33b24",

    "#000000", // else it breaks
    "#000000",
    "#000000",
    "#000000"
];

paletteRenderer.palettes = [
    marioPalette,
    oceanPalette,
    grassPalette,
    rosePalette,
];

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
    paletteRenderer.shiftPalette(1);
}, 100);