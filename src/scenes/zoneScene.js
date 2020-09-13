
var zoneScene = Scene();

var partsZoneScene = [p1=textureRect(0, 0, 0, 0, 108, 15), p2=textureRect(0, 0, 0, 0, 108, 15)];

partsZoneScene.forEach(zoneScene.add);

// close horizontal
const enterZone = (p1X, p1Y, p1W, p1H, p1Xt, p1Yt, p1Wt, p1Ht, p2X, p2Y, p2W, p2H, p2Xt, p2Yt, p2Wt, p2Ht, _texture, _paletteIndex) => {
  p1.b = 1;
  p2.b = 1;
  
  var texture = isNaN(_texture) ? [108, 109, 110][rando(0, 2)]:_texture;
  p1.setSprite(texture);
  p2.setSprite(texture);
  var paletteIndex = isNaN(_paletteIndex) ? [3, 15, 16][rando(0, 2)]: _paletteIndex;
  p1.palette = paletteIndex;
  p2.palette = paletteIndex;

  addAnimation(p1, 'x', p1X, p1Xt, 600);
  addAnimation(p1, 'y', p1Y, p1Yt, 600);
  addAnimation(p1, 'width', p1W, p1Wt, 600);
  addAnimation(p1, 'height', p1H, p1Ht, 600);
  
  addAnimation(p2, 'x', p2X, p2Xt, 600);
  addAnimation(p2, 'y', p2Y, p2Yt, 600);
  addAnimation(p2, 'width', p2W, p2Wt, 600);
  addAnimation(p2, 'height', p2H, p2Ht, 600);
};

const exitZone = _ => {
  addAnimation(p1, 'b', 1, 0, 200);
  addAnimation(p2, 'b', 1, 0, 200);
}

sceneManager.add(zoneScene);

const H2 = H;

var resetTransition = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
console.log(resetTransition);

var closeHorizontal = [
  // p1
  0, 0, 0, H2, 
  0, 0, W/2, H2,
  // p2
  W,   0, 0, H2,
  W/2, 0, W/2, H2
];

var openHorizontal = [
  // p1
  W/2, 0,   0, H2, 
  0,   0, W/2, H2,
  // p2
  W/2, 0,   0, H2,
  W/2, 0, W/2, H2
];

var closeVertical = [
  // p1
  0, 0, W, 0,
  0, 0, W, H2/2,
  // p2
  0,   H2, W, 0,
  0, H2/2, W, H2/2
];

var openVertical = [
  // p1
  0, H2/2, W, 0,
  0, 0, W, H2 / 2,
  // p2
  0, H2/2, W, 0,
  0, H2/2, W, H2 / 2
];

var openCenter = [
  // p1
  W/2, H2/2, 0, 0,
  0, 0, W, H2,
  // p2
  0, 0, 0, 0,
  0, 0, 0, 0
];

// pending to update
var closeEnemyHorizontal = [
  // p1
  0, 0, W, -20,
  0, 0, W, 45,
  // p2
  0, H, W, 0,
  0, 90, W, H - 90,
  0,
  3
];
var allSlides = [closeHorizontal, openHorizontal, closeVertical, openVertical, openCenter];

