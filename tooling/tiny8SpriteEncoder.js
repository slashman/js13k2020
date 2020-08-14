var CHAR_OFFSET = 200; // TODO: This doesn't work, need 32 or lower

// Transforms a raw bitmap into a string of byte triads
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
   
// Transforms a string of bits into a string of characters
function toCharacters(binary) {
    var bytes = [];
    if (binary.length % 8 != 0) {
        throw new Error("bye"); // TODO: Fill
    }
    var totalBytes = binary.length / 8;
    for (var i = 0; i < totalBytes; i++) {
        bytes[i] = binary.slice(i*8, (i+1)*8);
    }
    var ret = '';
    bytes.forEach(bin => {
        var charcode = parseInt(bin, 2) + CHAR_OFFSET;
        console.log(charcode + "-> [" + String.fromCharCode(charcode) + "]");
        /*if (charcode > 126) {
            ret += '-'; // Need to use only values 32 to 126 hmm.
        } else {*/
            ret += String.fromCharCode(charcode);
        //}
    });
    return ret;
}
  
// Action!
  
var rawSprite =
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

rawSprite = // Wall / floor 
    "0000000000000000"+
    "0111101111011111"+
    "0111101111011111"+
    "0000000000000000"+
    "1110111101111011"+
    "1110111101111011"+
    "0000000000000000"+
    "0111101111011111"+
    "0111101111011111"+
    "0000000000000000"+
    "1110111101111011"+
    "1110111101111011"+
    "0000000000000000"+
    "0111101111011111"+
    "0111101111011111"+
    "0000000000000000";
 
var bitsString = toBitsString(rawSprite);
var characters = toCharacters(bitsString);
console.log(characters);