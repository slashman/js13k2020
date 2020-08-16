
// src/gameObject.js >>
// declare game classes

// params delivered as an array [x, y]
var GameObject = props => ({
  x: props[0],
  y: props[1],
  visible: true,
  update: noop,
  draw: noop
});

