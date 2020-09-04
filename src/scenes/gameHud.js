// ░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░
// src/gameHud.js
// The HUD
// ░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░
var hudScene = Scene();
var seq = sequenceVisualizer({ x: 0, instrument: 0, scene: hudScene });

// Put game objects in the scene
loadMap(gpiMap, hudScene, {x:0, y: 8});
seq.addBeatLinesToScene();
hudScene.add(seq);

// Load the scene in the game
sceneManager.add(hudScene);

console.log('seq visualizer');
console.log(seq );