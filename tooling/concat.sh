#!/bin/bash
# original script from @gre 
# https://github.com/gre/behind-asteroids/blob/master/scripts/concat.sh
echo "// larga vida al #js13k! "
# pre
cat src/wrappers/pre.js

if [ "$NODE_ENV" == "production" ]; then
  cat src/env/prod.js
else
  cat lib/stats.min.js
  cat src/env/dev.js 
fi;

# definitions
cat src/setup/definitions.js

# libs
cat lib/utils.js
cat lib/zzfx.js
cat lib/zzfxm.min.js
#cat lib/webgl.js
cat lib/keyboardController.js

# shaders
#cd dist;
#for glsl in *.frag *.vert; do
#  name=`echo $glsl | tr '.' '_' | tr '[:lower:]' '[:upper:]'`
#  cat $glsl | ../scripts/wrapjs.sh $name
#  echo
#done
#cd ..;

# game engine declaration
cat src/setup/rawSprites.js
cat src/setup/generatedSprites.js
cat src/engine/gameObject.js
cat src/gameObjects/sprite.js
cat src/gameObjects/items.js

cat resources/mx/deep.js
#cat src/fighter.js
#cat src/font.js
#cat src/tiles.js
#cat src/sfx.js
#cat src/collisionHandler.js

# game control
#cat src/fighterController.js
cat src/gameObjects/player.js

cat src/engine/canvasRenderer.js
#cat src/webglRenderer.js
#cat src/effects.js
cat src/engine/paletteRenderer.js
cat src/engine/scene.js

# game mechanics
cat src/gameSetup.js
# additional scenes
# cat src/scenes/main.js
cat src/scenes/gameHud.js
#cat src/scenes/levelUpScene.js

# main game loop
cat src/engine/gameloop.js

cat src/wrappers/post.js
