
// utilities

var getRandomValue = (value=1, offset=0) => Math.random()*value + offset;

var rando = (from, to) => ~~(getRandomValue(to-from + 1, from));

var randomSign = _ => getRandomValue() > 0.5 ? 1 : -1;

var normalize = vector => {
  var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  return length==0 ? {x: 0, y: 0} : {x: vector.x / length, y: vector.y / length};
}

/**
 * Returns 0 if num is max, and max - 1 if num is -1.
 * @param {Number} num The number to compare against max.
 * @param {Number} max The amount that defines if the number should go to 0.
 */
var wrap = (num, max) => (num + max)%max // Thanks CBroe: https://stackoverflow.com/a/16964329
