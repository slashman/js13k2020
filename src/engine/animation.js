
// animation managers
let animations = [];
console.log('animations loaded');
const updateAnimations = dt => animations.forEach((animation, index) => animation.update(dt) && animations.splice(index, 1));

const addAnimation = (gameObject, property, initialValue, targetValue, time, ease, yoyo=false, onEnd=noop) => {
  let t = 0;
  let intervalValue = targetValue - initialValue;
  if(yoyo) onEnd = _=> addAnimation(gameObject, property, targetValue, initialValue, time, ease, true);

  animations.push({
    update: dt => {
      t += dt/time;
      gameObject[property] = initialValue + intervalValue*t;
      t>=1 && onEnd();
      return t>=1;
    }
  });
}

