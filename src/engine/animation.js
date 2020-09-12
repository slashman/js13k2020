
// animation managers
let animations = [];
console.log('animations loaded');
const updateAnimations = dt => animations.forEach((animation, index) => animation.update(dt) && animations.splice(index, 1));

const addAnimation = (gameObject, property, initialValue, targetValue, time, ease, yoyo=false) => {
  let t = 0;
  let intervalValue = targetValue - initialValue;
  let _onEnd = noop;
  var animation = {
    onEnd: fn => _onEnd = fn,
    update: dt => {
      t += dt / time;
      gameObject[property] = initialValue + intervalValue * t;
      t >= 1 && _onEnd();
      return t >= 1;
    }
  };
  if (yoyo) animation.onEnd( _=> addAnimation(gameObject, property, targetValue, initialValue, time, ease, true));
  animations.push(animation);
  return animation;
}

