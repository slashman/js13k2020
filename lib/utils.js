
// utilities

var getRandomValue = (value, offset) => {
  return Math.random()*(value||1) + (offset||0);
}

var randomSign = () => {
  return getRandomValue()>0.5?1:-1;
}

var normalize = vector => {
  var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  return length==0 ? {x: 0, y: 0} : {x: vector.x / length, y: vector.y / length};
}
