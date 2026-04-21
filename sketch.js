// CSC30 Major Project
// Carsen Waters
// Mmmmm DD 2026
//
// Extras for Experts:
// -Placeholder

//just check the rubric again to be sure

//WHERE IN THE CODE DO I PUT THE CLASSES
//Data files of some kind?? //IS NODE INFO OK TO BE HERE? IF SO SHOULD IT BE A CONSTANT?? //should i make data files for portal info
//See if constants needed (shapes???player size etc??)
//other world walls, also classes

//////// Classes //////// can rename/move later

class Portal {
  constructor(levelIndex, x, y) {
    this.x = x;
    this.y = y;
    this.size = 100;
    this.color = {s: 50, b: 40};
    this.levelIndex = levelIndex;
    this.playerHover = false;
  }

  checkPlayer() {
    if (collideRectCircle(player.x - player.size/2, player.y - player.size/2, player.size, player.size, this.x, this.y, this.size)) {
      //placeholder for portal info drawing
      this.color.b = 80;

      if (keyIsDown(KEYS.space)) {
        pendGameState(STATES.level, levels[this.levelIndex]);
      }
    } else {
      //placeholder for no portal info drawing
      this.color.b = 40;
    }
  }

  draw() {
    noStroke();
    fill(levels[this.levelIndex].colorH, this.color.s, this.color.b);
    circle(this.x, this.y, this.size);
  }
}

//////// Constants ////////

// Key codes
const KEYS = {
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  a: 65,
  d: 68,
  s: 83,
  w: 87,
};

// Game states
const STATES = {
  none: "",
  world: "world",
  level: "level",
};

//////// Data for the game's levels ////////

// The points on the path of the capsule through each level
let allNodes = [
  [
    {timeBeats: 0, x: 0, y: 0, capsuleW: 100, capsuleH: 100, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: {s: 0, b: 0}, frontColor: {s: 0, b: 10}}},
    {timeBeats: 4, x: 0, y: 0, capsuleW: 100, capsuleH: 100, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: {s: 0, b: 0}, frontColor: {s: 0, b: 10}}},
    {timeBeats: 8, x: 400, y: 0, capsuleW: 100, capsuleH: 100, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: {s: 50, b: 10}, frontColor: {s: 50, b: 20}}},
    {timeBeats: 12, x: 400, y: -200, capsuleW: 200, capsuleH: 100, backdropData: {shape: "square", spacing: 100, size: 50, angle: 360, backColor: {s: 50, b: 10}, frontColor: {s: 50, b: 20}}},
    {timeBeats: 20, x: -400, y: -200, capsuleW: 200, capsuleH: 100, backdropData: {shape: "square", spacing: 100, size: 50, angle: 360, backColor: {s: 50, b: 10}, frontColor: {s: 50, b: 20}}},
    {timeBeats: 24, x: -400, y: 0, capsuleW: 200, capsuleH: 200, backdropData: {shape: "square", spacing: 100, size: 75, angle: 360, backColor: {s: 50, b: 10}, frontColor: {s: 50, b: 20}}},
    {timeBeats: 30, x: 0, y: 400, capsuleW: 200, capsuleH: 200, backdropData: {shape: "square", spacing: 100, size: 75, angle: 360, backColor: {s: 100, b: 20}, frontColor: {s: 100, b: 5}}},
    {timeBeats: 34, x: 0, y: 0, capsuleW: 100, capsuleH: 100, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: {s: 0, b: 0}, frontColor: {s: 0, b: 10}}},
    {timeBeats: 36, x: 0, y: 0, capsuleW: 100, capsuleH: 100, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: {s: 0, b: 0}, frontColor: {s: 0, b: 10}}},
  ],
  [
    {timeBeats: 0, x: 0, y: 0, capsuleW: 150, capsuleH: 150, backdropData: {shape: "square", spacing: 75, size: 60, angle: 0, backColor: {s: 0, b: 0}, frontColor: {s: 25, b: 15}}},
    {timeBeats: 8, x: 0, y: 0, capsuleW: 150, capsuleH: 150, backdropData: {shape: "square", spacing: 75, size: 60, angle: 0, backColor: {s: 0, b: 0}, frontColor: {s: 25, b: 15}}},
    {timeBeats: 16, x: -300, y: 150, capsuleW: 150, capsuleH: 100, backdropData: {shape: "square", spacing: 75, size: 60, angle: 45, backColor: {s: 0, b: 0}, frontColor: {s: 25, b: 15}}},
    {timeBeats: 24, x: -300, y: 450, capsuleW: 250, capsuleH: 100, backdropData: {shape: "square", spacing: 75, size: 60, angle: 45, backColor: {s: 0, b: 0}, frontColor: {s: 75, b: 15}}},
    {timeBeats: 28, x: -150, y: 600, capsuleW: 250, capsuleH: 100, backdropData: {shape: "square", spacing: 75, size: 60, angle: -45, backColor: {s: 0, b: 0}, frontColor: {s: 75, b: 15}}},
    {timeBeats: 32, x: 0, y: 450, capsuleW: 250, capsuleH: 100, backdropData: {shape: "square", spacing: 75, size: 60, angle: 45, backColor: {s: 0, b: 0}, frontColor: {s: 75, b: 15}}},
    {timeBeats: 36, x: 150, y: 600, capsuleW: 250, capsuleH: 100, backdropData: {shape: "square", spacing: 75, size: 60, angle: -45, backColor: {s: 0, b: 0}, frontColor: {s: 75, b: 15}}},
    {timeBeats: 40, x: 300, y: 450, capsuleW: 250, capsuleH: 100, backdropData: {shape: "square", spacing: 75, size: 60, angle: 45, backColor: {s: 0, b: 0}, frontColor: {s: 75, b: 15}}},
    {timeBeats: 48, x: 450, y: 150, capsuleW: 50, capsuleH: 50, backdropData: {shape: "square", spacing: 75, size: 30, angle: 45, backColor: {s: 0, b: 0}, frontColor: {s: 25, b: 15}}},
    {timeBeats: 52, x: 450, y: 150, capsuleW: 50, capsuleH: 50, backdropData: {shape: "square", spacing: 75, size: 30, angle: 45, backColor: {s: 0, b: 0}, frontColor: {s: 25, b: 15}}},
    {timeBeats: 53, x: 300, y: 150, capsuleW: 50, capsuleH: 50, backdropData: {shape: "square", spacing: 75, size: 30, angle: 45, backColor: {s: 0, b: 0}, frontColor: {s: 25, b: 15}}},
    {timeBeats: 54, x: 300, y: 0, capsuleW: 50, capsuleH: 50, backdropData: {shape: "square", spacing: 75, size: 30, angle: 45, backColor: {s: 0, b: 0}, frontColor: {s: 25, b: 15}}},
    {timeBeats: 60, x: 0, y: 0, capsuleW: 150, capsuleH: 150, backdropData: {shape: "square", spacing: 75, size: 60, angle: 0, backColor: {s: 0, b: 0}, frontColor: {s: 25, b: 15}}},
    {timeBeats: 64, x: 0, y: 0, capsuleW: 150, capsuleH: 150, backdropData: {shape: "square", spacing: 75, size: 60, angle: 0, backColor: {s: 0, b: 0}, frontColor: {s: 25, b: 15}}},
  ]
];

let levels = [
  {name: "Test name", tempo: 120, colorH: 240, nodes: allNodes[0]},
  {name: "Another level", tempo: 168, colorH: 120, nodes: allNodes[1]}
];

let worldBorder = {color: {h: 0, s: 0, b: 25}, corners: [
  {x: 0, y: -500},
  {x: 300, y: -500},
  {x: 300, y: 0},
  {x: 600, y: 0},
  {x: 600, y: 200},
  {x: -400, y: 200},
  {x: -400, y: -500},
]};

let worldPortals = [
  new Portal(0, 400, 100),
  new Portal(1, -200, -300)
];

//////// Variables for playing the game ////////

let gameState;
let pendingState = STATES.none;
let pendingStateLevel = [];

let player;
let backdrop;

// Holds the player's information for when the world state is switched (so they return to the same place when finished a level)
let worldPlayer = {x: 0, y: 0, size: 10, speed: 5, color: {h: 0, s: 0, b: 100}};

// This object holds all the information for when a level is being played
let levelState = {};

let transition = {duration: 1000, color: {h: 0, s: 0, b: 0}, active: false, switchTime: 0};

// Size of the view that the drawing will be scaled to
let viewSize = 800;
let screenSize;

//////// Setup and running functions ////////

function setup() {
  // Make the canvas square, and set modes for drawing
  screenSize = min(windowWidth, windowHeight);
  createCanvas(screenSize, screenSize);
  rectMode(CENTER);
  angleMode(DEGREES);
  colorMode(HSB);

  setGameState(STATES.world);
}

function windowResized() {
  screenSize = min(windowWidth, windowHeight);
  resizeCanvas(screenSize, screenSize);
}

function draw() {
  if (gameState === STATES.world) {
    if (!transition.active) {
      movePlayer();
      checkPortals();
    }

    prepareDrawing();
    drawBackground();
    drawBorder();
    drawPortals();
    drawPlayer();
    
  } else if (gameState === STATES.level) {
    if (!transition.active) {
      levelProgress();
      moveCapsule();
      movePlayer();
    }
    
    prepareDrawing();
    drawBackground();
    drawPaths();
    drawCapsule();
    drawPlayer();
  }
  checkTransition();
  drawTransition();
}

function pendGameState(state, level = []) {
  if (!transition.active) {
    // Store the next game state so it can be set at the end of the draw loop
    pendingState = state;
    pendingStateLevel = level;

    transition.active = true;
    transition.switchTime = millis() + transition.duration;
  }
}

function setGameState(state, level = []) {
  // Change the game state and set up the new state
  gameState = state;

  if (state === STATES.world) {
    player = worldPlayer;
    backdrop = {shape: "circle", spacing: 100, size: 50, angle: 0, backColor: {h: 0, s: 0, b: 0}, frontColor: {h: 0, s: 0, b: 10}};
    
  } else if (state === STATES.level) {
    worldPlayer = structuredClone(player);
    
    player = {x: 0, y: 0, size: 10, speed: 5, color: {h: 0, s: 0, b: 100}};
    backdrop = {};
    
    levelState.capsule = {border: 5, color: {h: 0, s: 0, b: 40}};
    levelState.path = {border: 5, color: {h: 0, s: 0, b: 30}};
    
    levelState.levelObject = level;

    // Register the first frame of the level
    levelState.startTime = millis();
    levelProgress();
    moveCapsule();

    levelState.startTime = millis() + transition.duration;
  }
}

function beatsToMillis(beats, bpm) {
  // Calculates the number of milliseconds that the given number of beats at the given tempo take
  return beats * (60000 / bpm);
}

//////// Draw loop functions used in all game states ////////

function movePlayer() {
  // Right arrow or D key
  let inputRight = keyIsDown(KEYS.right) || keyIsDown(KEYS.d);
  // Left arrow or A key
  let inputLeft = keyIsDown(KEYS.left) || keyIsDown(KEYS.a);
  // Down arrow or S key
  let inputDown = keyIsDown(KEYS.down) || keyIsDown(KEYS.s);
  // Up arrow or W key
  let inputUp = keyIsDown(KEYS.up) || keyIsDown(KEYS.w);

  // Convert input into movement direction
  let angle = inputRight * 360 * inputUp + inputLeft * 180 + inputDown * 90 + inputUp * 270;
  if (inputRight !== inputLeft && inputDown !== inputUp) {
    angle = angle / 2;
  }

  if (gameState === STATES.world) {
    // Move player and collide with world border
    if (inputRight !== inputLeft || inputDown !== inputUp) {
      player.x += cos(angle) * player.speed;
      if (collideRectPoly(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size, worldBorder.corners)) {
        player.x -= cos(angle) * player.speed;
      }
      player.y += sin(angle) * player.speed;
      if (collideRectPoly(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size, worldBorder.corners)) {
        player.y -= sin(angle) * player.speed;
      }
    }

  } else if (gameState === STATES.level) {
    // Move player
    if (inputRight !== inputLeft || inputDown !== inputUp) {
      player.x += cos(angle) * player.speed;
      player.y += sin(angle) * player.speed;
    }

    // Keep the player in the capsule
    let currentCapsule = levelState.capsule;
    
    player.x = constrain(player.x, currentCapsule.x - (currentCapsule.width/2 - player.size/2), currentCapsule.x + (currentCapsule.width/2 - player.size/2));
    player.y = constrain(player.y, currentCapsule.y - (currentCapsule.height/2 - player.size/2), currentCapsule.y + (currentCapsule.height/2 - player.size/2));
  }
}

function prepareDrawing() {
  // Scale the scene so things take up the same space in the window regardless of how big it is
  scale(screenSize / viewSize);

  // Translate the scene so everything is centered on the player (in world state) or the capsule (in game state)
  if (gameState === STATES.world) {
    translate(viewSize/2 - player.x, viewSize/2 - player.y);

  } else if (gameState === STATES.level) {
    translate(viewSize/2 - levelState.capsule.x, viewSize/2 - levelState.capsule.y);

  }
}

function drawBackground() {
  // Center the drawing on the player (in world state) or the capsule (in game state)
  let focusX;
  let focusY;
  let frontColorH;
  let backColorH;

  if (gameState === STATES.world) {
    focusX = player.x;
    focusY = player.y;
    frontColorH = backdrop.frontColor.h;
    backColorH = backdrop.backColor.h;

  } else if (gameState === STATES.level) {
    focusX = levelState.capsule.x;
    focusY = levelState.capsule.y;
    frontColorH = levelState.levelObject.colorH;
    backColorH = levelState.levelObject.colorH;
  }
  
  background(backColorH, backdrop.backColor.s, backdrop.backColor.b);
  noStroke();
  fill(frontColorH, backdrop.frontColor.s, backdrop.frontColor.b);
  
  let shapeSpacing = backdrop.spacing;
  
  // Draw a grid of shapes, filling just the background of the canvas
  for (let shapeX = -viewSize/2 + viewSize/2 % (shapeSpacing/2) + floor(focusX / shapeSpacing) * shapeSpacing; shapeX <= viewSize/2 + ceil(focusX / shapeSpacing) * shapeSpacing; shapeX += shapeSpacing) {
    for (let shapeY = -viewSize/2 + viewSize/2 % (shapeSpacing/2) + floor(focusY / shapeSpacing) * shapeSpacing; shapeY <= viewSize/2 + ceil(focusY / shapeSpacing) * shapeSpacing; shapeY += shapeSpacing) {
      push();
      translate(shapeX, shapeY);
      rotate(backdrop.angle);
      
      if (backdrop.shape === "square") {
        square(0, 0, backdrop.size);
      } else if (backdrop.shape === "circle") {
        circle(0, 0, backdrop.size);
      }
      pop();
    }
  }
}

function drawPlayer() {
  // Draw the player
  noStroke();
  fill(player.color.h, player.color.s, player.color.b);
  square(player.x, player.y, player.size);
}

function checkTransition() {
  // Check if it's time to change the game state or finish the transition
  if (pendingState !== STATES.none && millis() >= transition.switchTime) {
    setGameState(pendingState, pendingStateLevel);
  
    pendingState = STATES.none;
    pendingStateLevel = [];
  }
  if (transition.active && millis() >= transition.switchTime + transition.duration) {
    transition.active = false;
  }
}

function drawTransition() {
  // Draw the transition as a fade to black based on how close the current time is to the switch time
  if (transition.active) {
    background(transition.color.h, transition.color.s, transition.color.b, 1 - abs(millis() - transition.switchTime) / transition.duration);
  }
}

//////// Draw loop funcitons used in the world game state ////////

function checkPortals() {
  // Check all the portals for player collision
  for (let portal of worldPortals) {
    portal.checkPlayer();
  }
}

function drawBorder() {
  // Draw the world border polygon by filling everything outside of it using a mask
  push();
  beginClip({invert: true});
  beginShape();
  for (let corner of worldBorder.corners) {
    vertex(corner.x, corner.y);
  }
  endShape(CLOSE);
  endClip();
  background(worldBorder.color.h, worldBorder.color.s, worldBorder.color.b);
  pop();
}

function drawPortals() {
  // Draw the world's portals ////This will include other world features eventually, in a seperate loop or its own function
  for (let portal of worldPortals) {
    portal.draw();
  }
}

//////// Draw loop functions used in the level game state ////////

function levelProgress() {
  // Gets the current progress through the level and through the paths

  levelState.currentNodeIndex = 0;
  levelState.lastNodeTime = levelState.startTime;
  
  // Check the level's nodes in order
  for (let nodeIndex = 0; nodeIndex < levelState.levelObject.nodes.length; nodeIndex += 1) {

    if (millis() - levelState.startTime >= beatsToMillis(levelState.levelObject.nodes[nodeIndex].timeBeats, levelState.levelObject.tempo)) {
      // If the time before the capsule reaches the node has passed, set the capsule's current node as that one (but not if it's the last one)
      if (nodeIndex < levelState.levelObject.nodes.length - 1) {
        levelState.currentNodeIndex = nodeIndex;
        levelState.lastNodeTime = levelState.startTime + beatsToMillis(levelState.levelObject.nodes[nodeIndex].timeBeats, levelState.levelObject.tempo);

      } else {
        // If the last node in the level has been passed, exit to the world state
        pendGameState(STATES.world, 0);
      }
      
    } else {
      // Exit the loop (with the current node still set as the previous node checked)
      break;
    }
  }
}

function moveCapsule() {
  // Move the capsule along the path by setting the position based on the current node and time
  let levelCapsule = levelState.capsule;

  let currentPath = levelState.levelObject.nodes[levelState.currentNodeIndex];
  let nextPath = levelState.levelObject.nodes[levelState.currentNodeIndex + 1];
  
  // Amount from the last node to the next one (0 to 1)
  let amountBetweenNodes = (millis() - levelState.lastNodeTime) / (beatsToMillis(nextPath.timeBeats, levelState.levelObject.tempo) - beatsToMillis(currentPath.timeBeats, levelState.levelObject.tempo));

  // Set capsule and backdrop properties to values between those of the last and next node
  levelCapsule.x = lerp(currentPath.x, nextPath.x, amountBetweenNodes);
  levelCapsule.y = lerp(currentPath.y, nextPath.y, amountBetweenNodes);
  levelCapsule.width = lerp(currentPath.capsuleW, nextPath.capsuleW, amountBetweenNodes);
  levelCapsule.height = lerp(currentPath.capsuleH, nextPath.capsuleH, amountBetweenNodes);
  
  backdrop.shape = currentPath.backdropData.shape;
  backdrop.spacing = currentPath.backdropData.spacing;
  backdrop.size = lerp(currentPath.backdropData.size, nextPath.backdropData.size, amountBetweenNodes);
  backdrop.angle = lerp(currentPath.backdropData.angle, nextPath.backdropData.angle, amountBetweenNodes);
  
  let newBackColor = {};
  let newFrontColor = {};
 
  newBackColor.s = lerp(currentPath.backdropData.backColor.s, nextPath.backdropData.backColor.s, amountBetweenNodes);
  newBackColor.b = lerp(currentPath.backdropData.backColor.b, nextPath.backdropData.backColor.b, amountBetweenNodes);
  
  newFrontColor.s = lerp(currentPath.backdropData.frontColor.s, nextPath.backdropData.frontColor.s, amountBetweenNodes);
  newFrontColor.b = lerp(currentPath.backdropData.frontColor.b, nextPath.backdropData.frontColor.b, amountBetweenNodes);

  backdrop.backColor = newBackColor;
  backdrop.frontColor = newFrontColor;
}

function drawPaths() {
  // Draw the path of the capsule for the current level
  stroke(levelState.path.color.h, levelState.path.color.s, levelState.path.color.b);
  strokeWeight(levelState.path.border);
  
  let levelLines = levelState.levelObject.nodes;
  
  for (let lineIndex = 0; lineIndex < levelLines.length - 1; lineIndex += 1) {
    let startNode = levelLines[lineIndex];
    let endNode = levelLines[lineIndex + 1];  

    line(startNode.x, startNode.y, endNode.x, endNode.y);
  }
}

function drawCapsule() {
  // Draws the capsule so that the border is entirely on the outside
  let currentCapsule = levelState.capsule;
  
  noFill();
  stroke(currentCapsule.color.h, currentCapsule.color.s, currentCapsule.color.b);
  strokeWeight(currentCapsule.border);
  rect(currentCapsule.x, currentCapsule.y, currentCapsule.width + currentCapsule.border, currentCapsule.height + currentCapsule.border);
}