
// animation managers
let animations = [];
console.log('animations loaded');
const updateAnimations = dt => animations.forEach((animation, index) => animation.update(dt) && animations.splice(index, 1));

const easeLinear = t => t;
const easeRandom = Math.random;

const addAnimation = (gameObject, property, initialValue, targetValue, time, ease=easeLinear, yoyo=false) => {
  if (initialValue == targetValue) return gameObject[property] = targetValue;
  let t = 0;
  let intervalValue = targetValue - initialValue;
  let _onEnd = noop;
  var animation = {
    onEnd: fn => _onEnd = fn,
    update: dt => {
      t += dt / time;
      gameObject[property] = initialValue + intervalValue * ease(t);
      if (t >= 1) {
        gameObject[property] = targetValue;
         _onEnd();
      }
      return t >= 1;
    }
  };
  if (yoyo) animation.onEnd( _=> addAnimation(gameObject, property, targetValue, initialValue, time, ease, true));
  animations.push(animation);
  return animation;
}

const shakeIt = (gameObject, intensity, time) => {
  let x = gameObject.x;
  let y = gameObject.y;
  addAnimation(gameObject, 'x', x - intensity, x + intensity, time, easeRandom).onEnd(_ => gameObject.x = x);
  addAnimation(gameObject, 'y', y - intensity, y + intensity, time, easeRandom).onEnd(_ => gameObject.y = y);
}

// use shake it: shakeIt(pressEnter, 1, 2000);