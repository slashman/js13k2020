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
    draw: function (spriteId, x, y, pi) {
        this.drawRaw(this.sprites[spriteId], x, y, pi);
    },
    drawRaw: function (sprite, px, py, pi) {
        for (var y = 0; y < 16; y++) {
            for (var x = 0; x < 16; x++) {
                var index = sprite.charAt(y * 16 + x);
                if (index == 0 && pi == 0){
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

// TODO: Read sprites from decoded image data
var mario1 =
    "0000000000000000"+
    "0001111110000000"+
    "0012222221100000"+
    "0122222222210000"+
    "0111331311100000"+
    "1331131333310000"+
    "1331133133310000"+
    "0113331111100000"+
    "0011333331000000"+
    "0122442210000000"+
    "1222244221000000"+
    "1222244441000000"+
    "0155544641000000"+
    "0155777441000000"+
    "0017777710000000"+
    "0011111110000000";

var mario2 =
    "0001111110000000"+
    "0012222221100000"+
    "0122222222210000"+
    "0111331311100000"+
    "1331131333310000"+
    "1331133133310000"+
    "0113331111100000"+
    "0011333331000000"+
    "0122442210000000"+
    "1222244221000000"+
    "1222244441000000"+
    "0155544641000000"+
    "0155777441000000"+
    "0017777710000000"+
    "0011111110000000"+
    "0000000000000000";

var waterfall =
    "0000777700007777"+
    "0000000000000000"+
    "1111000011110000"+
    "1111111111111111"+
    "2222111122221111"+
    "2222222222222222"+
    "3333222233332222"+
    "3333333333333333"+
    "4444333344443333"+
    "4444444444444444"+
    "5555444455554444"+
    "5555555555555555"+
    "6666555566665555"+
    "6666666666666666"+
    "7777666677776666"+
    "7777777777777777";

var grass =
    "0000000000000000"+
    "0000000000000000"+
    "0010100000000000"+
    "0001000000000000"+
    "0000000000000101"+
    "0000000000000010"+
    "0000000000000000"+
    "0000010100000000"+
    "0000001000000000"+
    "0000000000000000"+
    "0000000000000000"+
    "0000000000000000"+
    "0001010000010100"+
    "0000100000001000"+
    "0000000000000000"+
    "0000000000000000";

var flowers =
    "0000000000000000" +
    "0002000000000000" +  
    "0023200000000000"+
    "0002000000000000"+
    "0011100002000000"+
    "0001000023200000"+
    "0000000002000101"+
    "0000000011100010"+
    "0000200001000000"+
    "0002320000000000"+
    "0000200000000200"+
    "0001110000002320"+
    "0000100000000200"+
    "0000000000001110"+
    "0001010000000100"+
    "0000100000000000";

paletteRenderer.saveSprite(0, grass);
paletteRenderer.saveSprite(1, waterfall);
paletteRenderer.saveSprite(2, flowers);
paletteRenderer.saveSprite(3, mario1);
paletteRenderer.saveSprite(4, mario2);

var marioPalette = [
    "#FFFFFF",
    "#020202",
    "#cf1614",
    "#ebc09d",
    "#5671e4",
    "#dfd3d3",
    "#fbf330",
    "#8e5739"
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
    "#ffa400"
];

var rosePalette = [
    "#346f00",
    "#2a4600",
    "#e84723",
    "#a33b24"
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