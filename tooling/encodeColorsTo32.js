function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: ~~(parseInt(result[1], 16)/8),
    g: ~~(parseInt(result[2], 16)/8),
    b: ~~(parseInt(result[3], 16)/8)
  } : null;
}


function transform(hexaColor) {
  var color = hexToRgb(hexaColor);
  return `${color.r.toString(32)}${color.g.toString(32)}${color.b.toString(32)}`
}

function transformArray(palettes) {
  return palettes.map(transform).join("', '");
}
