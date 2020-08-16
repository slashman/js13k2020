
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

// transform strings to byte array
var byteSprite = [];
for (i of binarySprites) {
  var b = i.charCodeAt(), 
  b = 6E4 < b ? 0 : 255 < b ? '€ ‚ƒ„…†‡ˆ‰Š‹Œ Ž  ‘’“”•–—˜™š›œ žŸ'.indexOf(i) + 128 : b;
  byteSprite.push(b)
};

// transform byte array to octal array
var allSprites = [];
for (var i = 0; i<byteSprite.length; i+=3) {
  var triad = (byteSprite[i] << SIXTEEN) + (byteSprite[i+1] << 8) +byteSprite[i+2];
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

// group octal pixels in sprite frames
// assumes horizontal spritesheet hframes = n, vframes = 1
for (var i = 0; i < allSprites.length / SIXTEEN; i+=1) {
  var index = i % hFrames;
  sprites[index] = sprites[index].concat(allSprites.slice(i * SIXTEEN, (i + 1) * SIXTEEN))
}
