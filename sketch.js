// CSC30 Major Project
// Carsen Waters
// Mmmmm DD 2026
//
// Extras for Experts:
// - Handling of window resizing while the project is running (windowResized function)
// - p5.collide2d library for collision between shapes (added before in-class demo)
// - Storing game data in JSON file
// - Using Object.keys() and object bracket notation for setting object properties from data file
// - PLACEHOLDER (later look through code to find things)

//Obstacles: movewithcapsule (decide how to do this), switch to polys for shapes (have background use shapes too, figure out how to have circle?), more properties
////LEVEL CLASS OR JUST OBJECTS??? line 110ish (can thinl about it, maybe will need classes when levels have more complex function)
//See if constants needed - probably not, maybe text displays later
//other world walls (also classes)
//fonts?


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

// Shapes
const SHAPES = {
  square: [
    {x: -1/2, y: -1/2},
    {x: 1/2, y: -1/2},
    {x: 1/2, y: 1/2},
    {x: -1/2, y: 1/2},
  ]
};

//////// Data variables for the game's levels and world ////////

let gameData;

let allLevels = [];

let worldBorder;
let worldPortals = [];

//////// Variables for playing the game ////////

let gameState;
let pendingState = STATES.none;
let pendingStateLevel = [];

let player;
let backdrop;

let transition;

// Holds the player's information for when the world state is switched (so they return to the same place when finished a level)
let worldPlayer;

// This object holds all the information for when a level is being played
let levelState = {};

// Size of the view that the drawing will be scaled to
let viewSize;
let screenSize;

//////// Setup and running functions ////////

function preload() {
  // Load game data
  gameData = loadJSON("gamedata.json");
}

function setup() {
  // Make the canvas square, and set modes for drawing
  screenSize = min(windowWidth, windowHeight);
  createCanvas(screenSize, screenSize);
  rectMode(CENTER);
  angleMode(DEGREES);
  colorMode(HSB);
  textAlign(CENTER, CENTER);

  // Set up game data
  for (let levelData of gameData.levels.levelProperties) {
    // The points on the path of the capsule through each level
    let newCapsuleNodes = [];
    let previousNode = levelData.capsulePath[0];
    for (let node of levelData.capsulePath) {
      // For each node, set its properties based on the data object, or the previous node's properties if not specified
      let newNode = structuredClone(previousNode);
      for (let property of Object.keys(node)) {
        newNode[property] = node[property];
      }
      newCapsuleNodes.push(newNode);
      previousNode = newNode;
    }

    // The attacks to avoid during the level
    let newLevelAttacks = [];
    let previousAttack = levelData.attacks[0];
    for (let attack of levelData.attacks) {
      // For each attack, set its properties based on the data object, or the previous attack's properties if not specified
      let newAttack = structuredClone(previousAttack);
      for (let property of Object.keys(attack)) {
        newAttack[property] = attack[property];
      }
      newLevelAttacks.push(newAttack);
      previousAttack = newAttack;
    }
    
    // Add the level to the global array
    let newInfo = levelData.info;
    newInfo.nodes = newCapsuleNodes;
    newInfo.attacks = newLevelAttacks;
    newInfo.progress = false;
    allLevels.push(newInfo);
    
    // let levelInfo = levelData.info;
    // allLevels.push(new Level(levelInfo.name, levelInfo.minorKey, levelInfo.tempo, levelInfo.colorH, newCapsuleNodes));
  }

  let worldData = gameData.world;

  worldBorder = worldData.border;

  for (let portalData of worldData.portals) {
    worldPortals.push(new Portal(allLevels[portalData.levelIndex], portalData.x, portalData.y));
  }

  worldPlayer = worldData.startPlayer;

  transition = worldData.startTransition;
  
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
      moveObstacles();
      movePlayer();
    }
    
    prepareDrawing();
    drawBackground();
    drawPaths();
    drawCapsule();
    drawObstacles();
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
    let worldData = gameData.world;

    player = worldPlayer;
    backdrop = worldData.backdrop;
    viewSize = worldData.viewSize;
    
  } else if (state === STATES.level) {
    worldPlayer = structuredClone(player);

    let levelsData = gameData.levels;
    
    player = levelsData.playerProperties;
    backdrop = {};
    
    levelState.capsule = levelsData.capsuleProperties;
    levelState.path = levelsData.pathProperties;

    levelState.obstacles = [];
    for (let attackData of level.attacks) {
      let newObstacle = new Obstacle(attackData);
      levelState.obstacles.push(newObstacle);
    }
    
    levelState.levelObject = level;
    
    // Set up and register the first frame of the level
    levelState.startTime = millis();
    levelProgress();
    moveCapsule();
    moveObstacles();
    player.x = levelState.capsule.x;
    player.y = levelState.capsule.y;
    
    // Start transition
    levelState.startTime = millis() + transition.duration;
  }
}

function beatsToMillis(beats, bpm) {
  // Calculates the number of milliseconds that the given number of beats at the given tempo take
  return beats * (60000 / bpm);
}

//////// Draw loop functions used in all game states ////////

function movePlayer() {
  let inputRight = keyIsDown(KEYS.right) || keyIsDown(KEYS.d);
  let inputLeft = keyIsDown(KEYS.left) || keyIsDown(KEYS.a);
  let inputDown = keyIsDown(KEYS.down) || keyIsDown(KEYS.s);
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
      if (collideRectPoly(player.x - player.size/2, player.y - player.size/2, player.size, player.size, worldBorder.corners)) {
        player.x -= cos(angle) * player.speed;
      }
      player.y += sin(angle) * player.speed;
      if (collideRectPoly(player.x - player.size/2, player.y - player.size/2, player.size, player.size, worldBorder.corners)) {
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
  let colorFrontH;
  let colorBackH;
  
  if (gameState === STATES.world) {
    focusX = player.x;
    focusY = player.y;
    colorFrontH = backdrop.colorFront.h;
    colorBackH = backdrop.colorBack.h;
    
  } else if (gameState === STATES.level) {
    focusX = levelState.capsule.x;
    focusY = levelState.capsule.y;
    colorFrontH = levelState.levelObject.colorH;
    colorBackH = levelState.levelObject.colorH;
  }
  
  background(colorBackH, backdrop.colorBack.s, backdrop.colorBack.b);
  noStroke();
  fill(colorFrontH, backdrop.colorFront.s, backdrop.colorFront.b);
  
  let shapeSpacing = backdrop.spacing;
  
  // Draw a grid of shapes, filling just the background of the canvas
  for (let shapeX = -viewSize/2 - shapeSpacing + viewSize/2 % shapeSpacing + floor(focusX / shapeSpacing) * shapeSpacing; shapeX <= viewSize/2 + shapeSpacing + ceil(focusX / shapeSpacing) * shapeSpacing; shapeX += shapeSpacing) {
    for (let shapeY = -viewSize/2 - shapeSpacing + viewSize/2 % shapeSpacing + floor(focusY / shapeSpacing) * shapeSpacing; shapeY <= viewSize/2 + shapeSpacing + ceil(focusY / shapeSpacing) * shapeSpacing; shapeY += shapeSpacing) {
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
    
    if (millis() - levelState.startTime >= beatsToMillis(levelState.levelObject.nodes[nodeIndex].timeBeat, levelState.levelObject.tempo)) {
      // If the time before the capsule reaches the node has passed, set the capsule's current node as that one (but not if it's the last one)
      if (nodeIndex < levelState.levelObject.nodes.length - 1) {
        levelState.currentNodeIndex = nodeIndex;
        levelState.lastNodeTime = levelState.startTime + beatsToMillis(levelState.levelObject.nodes[nodeIndex].timeBeat, levelState.levelObject.tempo);
        
      } else {
        // If the last node in the level has been passed, exit to the world state
        levelState.levelObject.progress = true;
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
  let amountBetweenNodes = (millis() - levelState.lastNodeTime) / (beatsToMillis(nextPath.timeBeat, levelState.levelObject.tempo) - beatsToMillis(currentPath.timeBeat, levelState.levelObject.tempo));
  
  // Set capsule, backdrop, and view properties to values between those of the last and next node
  levelCapsule.x = lerp(currentPath.x, nextPath.x, amountBetweenNodes);
  levelCapsule.y = lerp(currentPath.y, nextPath.y, amountBetweenNodes);
  levelCapsule.width = lerp(currentPath.capsuleW, nextPath.capsuleW, amountBetweenNodes);
  levelCapsule.height = lerp(currentPath.capsuleH, nextPath.capsuleH, amountBetweenNodes);
  
  backdrop.shape = currentPath.bdShape;
  backdrop.spacing = lerp(currentPath.bdSpacing, nextPath.bdSpacing, amountBetweenNodes);
  backdrop.size = lerp(currentPath.bdSize, nextPath.bdSize, amountBetweenNodes);
  backdrop.angle = lerp(currentPath.bdAngle, nextPath.bdAngle, amountBetweenNodes);
  
  let newcolorBack = {};
  let newcolorFront = {};
  
  newcolorBack.s = lerp(currentPath.bdColorBack.s, nextPath.bdColorBack.s, amountBetweenNodes);
  newcolorBack.b = lerp(currentPath.bdColorBack.b, nextPath.bdColorBack.b, amountBetweenNodes);
  
  newcolorFront.s = lerp(currentPath.bdColorFront.s, nextPath.bdColorFront.s, amountBetweenNodes);
  newcolorFront.b = lerp(currentPath.bdColorFront.b, nextPath.bdColorFront.b, amountBetweenNodes);
  
  backdrop.colorBack = newcolorBack;
  backdrop.colorFront = newcolorFront;

  viewSize = lerp(currentPath.viewSize, nextPath.viewSize, amountBetweenNodes);
}

function moveObstacles() {
  //
  for (let obstacle of levelState.obstacles) {
    obstacle.move();
  }
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

function drawObstacles() {
  //
  for (let obstacle of levelState.obstacles) {
    obstacle.draw();
  }
}

//////// Classes ////////

class Portal {
  constructor(levelObject, x, y) {
    this.x = x;
    this.y = y;
    this.size = 100;
    this.colorPrimary = {s: 50, b: 40};
    this.colorSecondary = {s: 50, b: 80};
    this.levelObject = levelObject;
    this.playerHover = 0;
    this.hoverSpeed = 0.1;
    this.hoverInfo = [
      {yDirection: -1, width: 450, textSize: 25, textSpacing: 35,
        textLines: [
          this.levelObject.name,
          this.levelObject.tempo + " BPM    " + this.levelObject.minorKey + " minor",
        ]
      },
      {yDirection: 1, width: 350, textSize: 30, textSpacing: 40,
        textLines: [
          "[Level progress]",
          "Press space to enter",
        ]
      },
    ];
  }

  checkPlayer() {
    // Check if the player is touching the portal
    if (collideRectCircle(player.x - player.size/2, player.y - player.size/2, player.size, player.size, this.x, this.y, this.size)) {
      this.playerHover += this.hoverSpeed;

      // Enter the level if space key is pressed and the portal is fully open
      if (keyIsDown(KEYS.space) && this.playerHover >= 1) {
        pendGameState(STATES.level, this.levelObject);
      }
    } else {
      this.playerHover -= this.hoverSpeed;
    }
    this.playerHover = constrain(this.playerHover, 0, 1);
  }

  draw() {
    if (this.levelObject.progress) {
      this.hoverInfo[1].textLines[0] = "Completed";
    } else {
      this.hoverInfo[1].textLines[0] = "Incomplete";
    }


    noStroke();

    // Draw the portal circles
    fill(this.levelObject.colorH, this.colorPrimary.s, this.colorPrimary.b);
    circle(this.x, this.y, this.size * (1 + this.playerHover / 2));

    fill(this.levelObject.colorH, this.colorSecondary.s, this.colorSecondary.b);
    circle(this.x, this.y, this.size * this.playerHover);

    // Display info about the level if the player is on the portal
    if (this.playerHover > 0) {
      // Draw both the top and bottom info boxes
      for (let infoObject of this.hoverInfo) {
        // Draw the base rectangle
        let infoHeight = infoObject.textSpacing * (infoObject.textLines.length + 1);
        let infoY = this.y + infoObject.yDirection * (this.size + infoHeight/2);

        fill(this.levelObject.colorH, this.colorPrimary.s, this.colorPrimary.b);
        rect(this.x, infoY, infoObject.width * this.playerHover, infoHeight * this.playerHover);

        fill(this.levelObject.colorH, this.colorSecondary.s, this.colorSecondary.b);
        textSize(infoObject.textSize * this.playerHover);

        // Draw the text
        let textY;
        if (infoObject.yDirection === -1) {
          textY = this.y - (this.size + infoObject.textSpacing * infoObject.textLines.length);
        } else if (infoObject.yDirection === 1) {
          textY = this.y + (this.size + infoObject.textSpacing);
        }

        for (let textString of infoObject.textLines) {
          text(textString, this.x, lerp(infoY, textY, this.playerHover));
          textY += infoObject.textSpacing;
        }
      }
    }
  }
}

class Obstacle {
  constructor(data) {
    this.data = data;
  }
  
  move() {
    // Check if it's time for the obstacle to exist in the level
    let levelTempo = levelState.levelObject.tempo;
    this.active = millis() - levelState.startTime >= beatsToMillis(this.data.startBeat, levelTempo) && millis() - levelState.startTime <= beatsToMillis(this.data.startBeat, levelTempo) + beatsToMillis(this.data.moveBeats, levelTempo);

    // Move the obstacle by setting the position based on its attack data
    if (this.active) {
      // Amount from the attack start to end (0 to 1)
      let amountThroughMovement = (millis() - levelState.startTime - beatsToMillis(this.data.startBeat, levelState.levelObject.tempo)) / beatsToMillis(this.data.moveBeats, levelState.levelObject.tempo);

      // Set obstacle properties to values between those of the start and end properties
      let xFocus = 0;
      let yFocus = 0;
      if (this.data.moveWithCapsule) {
        xFocus = levelState.capsule.x;
        yFocus = levelState.capsule.y;
      }

      this.x = lerp(xFocus + this.data.xStart, xFocus + this.data.xStart + this.data.xMove, amountThroughMovement);
      this.y = lerp(yFocus + this.data.yStart, yFocus + this.data.yStart + this.data.yMove, amountThroughMovement);
      this.size = lerp(this.data.sizeStart, this.data.sizeStart + this.data.sizeMove, amountThroughMovement);

      // Check for player collision
      //console.log(SHAPES[this.data.shape]); MAKING shapeS SOON!
      if (collideRectRect(player.x - player.size/2, player.y - player.size/2, player.size, player.size, this.x - this.size/2, this.y - this.size/2, this.size, this.size)) {
        // Exit to the world state
        pendGameState(STATES.world, 0);
      }
    }
  }

  draw() {
    // Draw the obstacle
    if (this.active) {
      noStroke();
      fill(levelState.levelObject.colorH, this.data.color.s, this.data.color.b);
      rect(this.x, this.y, this.size);
    }
  }
}

class Level {
  constructor(name, minorKey, tempo, colorH, nodes) {
    this.name = name;
    this.minorKey = minorKey;
    this.tempo = tempo;
    this.colorH = colorH;
    this.nodes = nodes;
    this.progress = false;
  }
}