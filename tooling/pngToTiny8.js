var fs = require('fs');
var PNG = require('pngjs').PNG;

var colors = {};

var currentColor = 0;
function nextColor() {
  return ++currentColor;
}

var spriteAsString = '';

function toBitsString(sprite) {
  var imageData = "";
  sprite.split("").forEach(pixel => {
    bits = parseInt(pixel, 10).toString(2);
    bits = "00" + bits;
    bits = bits.slice(bits.length - 3);
    imageData += bits;
  })
  return imageData;
}

function toBinary(bitString) {
  var totalBytes = bitString.length / 8;
  var bytes = Buffer.alloc(totalBytes);
  var intArray = [];
  for (var i = 0; i < totalBytes; i++) {
    var value = parseInt(bitString.slice(i * 8, (i + 1) * 8), 2);
    intArray.push(value)
    bytes[i] = value;
  }
  var latin1stringescaped = String.fromCharCode.apply(!1, new Uint8Array(intArray)).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\r/g, "\\r");
  process.stdout.write(`var binarySprites=\`${latin1stringescaped}\`;`)
}

fs.createReadStream('resources/c.png')
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on('parsed', function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {

        var idx = (this.width * y + x) << 2;
        var color = (this.data[idx]<<16) +(this.data[idx+1]<<8) + this.data[idx+2];
        if (!colors[color]) colors[color] = nextColor();
        spriteAsString += colors[color];
      }
    }
    var bitsString = toBitsString(spriteAsString);
    toBinary(bitsString);
  });