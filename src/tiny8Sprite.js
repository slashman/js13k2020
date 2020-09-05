var CHAR_OFFSET = 200;
var SCALE = 1;
var palettes = [
[ // Mario
    "#FFFFFF",
    "#020202",
    "#cf1614",
    "#ebc09d",
    "#5671e4",
    "#dfd3d3",
    "#fbf330",
    "#8e5739"
],
[ // Wall
    "#49e7ec",
    "#3368dc"
],
[ // Floor
    "#ab1f65",
    "#020202"
]
];

var rawSprites = [
    "ÈÈÈÈÈÈÌŚÑìÚđÌŚÑìÚđÈÈÈÈÈÈìŊđÌŚÑìŊđÌŚÑÈÈÈÈÈÈÌŚÑìÚđÌŚÑìÚđÈÈÈÈÈÈìŊđÌŚÑìŊđÌŚÑÈÈÈÈÈÈÌŚÑìÚđÌŚÑìÚđÈÈÈÈÈÈ", // Wall / Floor
    "ÈÈÈÈÈÈÈÚđèÈÈÈŬŚČňÈÍìŚđØÈÌŞƓìňÈõŚƓĵŘÈõŚơĵŘÈÌžƑìňÈÈŞƣĬÈÈÍñÚèÈÈñíêČÈÈñíìŌÈÈÎƣîŌÈÈÎƧǄŌÈÈÈǇǇèÈÈÈŚđèÈÈ", // Mario
];

var sprites = rawSprites.map(rs => toSpriteData(charactersToBitsString(rs)));

function drawSprite(i, x , y, pi) {
    drawRawSprite(sprites[i], x, y, pi);
}

function drawRawSprite(sprite, px, py, pi) {
    for (var y = 0; y < 16; y++) {
        for (var x = 0; x < 16; x++) {
            var index = sprite.charAt(y * 16 + x);
            if (pi == 0 && index == 0) {
                // "transparency"
                continue;
            }
            var palette = palettes[pi];
            var color = palette[parseInt(index, 10)];
            c.fillStyle = color;
            c.fillRect((x + px) * SCALE, (y + py) * SCALE, SCALE, SCALE);
        }
    }
}

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