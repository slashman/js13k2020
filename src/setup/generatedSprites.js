
// src/generatedSprites.js 
// sprites generated with npm run build-sprites
// all sprites declarations should be listed here.

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

var hFrames = 8;
var vFrames = 7;
var sprites = [];
for ( var i = 0; i<hFrames*vFrames; i++) {
  sprites.push([]);
}

// group octal pixels in sprite frames
// assumes horizontal spritesheet hframes = n, vframes = 1
console.log(allSprites.length)
for (var i = 0; i < allSprites.length / SIXTEEN; i+=1) {
  var hIndex = i % hFrames;
  var vIndex = ~~(i/(SIXTEEN*hFrames));
  var index = hIndex + vIndex*hFrames
  sprites[index] = sprites[index].concat(allSprites.slice(i * SIXTEEN, (i + 1) * SIXTEEN))
}
