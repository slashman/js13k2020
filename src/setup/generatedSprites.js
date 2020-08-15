
// src/generatedSprites.js 
// sprites generated with npm run build-sprites
// all sprites declarations should be listed here.

var palettes = [
  [
    '#305182',
    '0',
    '#4192c3',
    '#71e392',
    '#a2ffcb',
    '#db4161',
    '#ebebeb',
    '#ebebeb'
  ],
  [
    '#ebebeb',
    '0',
    '#a2ffcb',
    '#4192c3',
    '#db4161',
    '#305182',
    '#71e392',
    '#ebebeb',
  ],
  [
    '#4192c3',
    '0',
    '#305182',
    '#ebebeb',
    '#71e392',
    '#a2ffcb',
    '#db4161',
    '#ebebeb'
  ],
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

var byteSprite = [];
//for (i of `$I$I$I$I$I$I$I$I$RHI$HI$I$I$RHI$iI$RHI$RHI$iI$"I$¢M"I$II$I$¤¬$I$£qI$i"I$¬"I$¬dI$¤¬"I%¬I$bI%l¼l%uÜ¤I$®dI$¬¼dI%l·ùl(åü®$ü¼lQ$ì¿ýlI'lÙm'å÷û¬I)d¿ý,%l·ùm'}þÛÿ'Û}'ï÷ûý'lÙ'É¶ÛIÉ;ÉÛ±'}Û'}þÛÉÉ'Ï¶;xI;Ï¾ÛIñ'É¾ÛIñ'É¶ÛxI$ìvøâI'm¶;y;Ï¶Ûy'Ï¶ÛbI$q8I'¶;lI'm¶;bI$í¶;bI$I$I$ûI$¶ûbI$vøâI$I$I$I$I$'lI$q8I`) {
for (i of binarySprites) {
  var b = i.charCodeAt(), 
  b = 6E4 < b ? 0 : 255 < b ? "€ ‚ƒ„…†‡ˆ‰Š‹Œ Ž  ‘’“”•–—˜™š›œ žŸ".indexOf(i) + 128 : b;
  byteSprite.push(b)
};

var allSprites = [];
for (var i = 0; i<byteSprite.length; i+=3) {
  var triad = (byteSprite[i] << 16) + (byteSprite[i+1] << 8) +byteSprite[i+2];
  for ( var j=0; j<8; j++) {
    allSprites.push((triad>>(21-j*3)) & 7);
  }
}

var hFrames = 4;
var vFrames = 1;
var sprites = [];
for ( var i = 0; i<hFrames*vFrames; i++) {
  sprites.push([]);
}

for (var i = 0; i<allSprites.length; i+=16) {
  var algo = i/16;
  var hIndex = algo % hFrames;
  var vIndex = ~~(algo/(16*hFrames));
  var index = ~~(hIndex + vIndex * hFrames);
  sprites[index] = sprites[index].concat(allSprites.slice(i, i+16))
}
