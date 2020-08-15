
// src/gameObject.js >>
// declare game classes

function GameObject(props) {
  return {
    x: props[0],
    y: props[1],
    visible: true,
    update: function(dt, time) {},
    draw: function() {}
  }
}

