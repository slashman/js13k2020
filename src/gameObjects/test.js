
// src/gameObjects/test.js

function TestObject (props) {
  var base = GameObject(props);
  var extended = {
    sprite: sprites[1],
    update: function(dt, time) {
      this.x = Math.sin(time*0.01) + props[0];
      this.y = Math.cos(time*0.01) + props[1];
    },
    draw: function () {
      graphics.save();
      //graphics.translate(this.x, this.y);
      graphics.drawImage(img, this.x, this.y);
      /*for (var j = 0; j < 16; j++) {
        for (var i = 0; i < 16; i++) {
          var index = this.sprite.charAt(j*16+i);
          if (pi==0 && index==0) continue;
          var color = palette[parseInt(index, 10)];
          graphics.fillStyle = color;
          graphics.fillRect(i*scale, j*scale, scale, scale);
        }
      }*/
      graphics.restore();
    }
  }
  extendFunction(base, extended);
  return extended;
}
