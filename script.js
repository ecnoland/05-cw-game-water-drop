// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let score = 0; // Track player score
let waterCan; // Reference to the water can element
let gameTimer; // Timer for game duration
let timeLeft = 30; // Game duration in seconds

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

// Get water can element and set up mouse tracking
waterCan = document.getElementById("water-can");
document.addEventListener("mousemove", moveWaterCan);

function moveWaterCan(event) {
  if (!gameRunning) return;
  
  const gameContainer = document.getElementById("game-container");
  const rect = gameContainer.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  
  // Keep water can within game boundaries
  const canWidth = waterCan.offsetWidth;
  const gameWidth = gameContainer.offsetWidth;
  const minX = canWidth / 2;
  const maxX = gameWidth - canWidth / 2;
  
  const clampedX = Math.max(minX, Math.min(maxX, mouseX));
  waterCan.style.left = `${clampedX - canWidth / 2}px`;
  waterCan.style.transform = 'translateX(0)';
}

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 30;
  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = timeLeft;

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  // Update the timer every second
  gameTimer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Check for collision with water can during fall
  const collisionCheck = setInterval(() => {
    if (checkCollision(drop, waterCan)) {
      // Drop caught!
      score += 10;
      document.getElementById("score").textContent = score;
      drop.remove();
      clearInterval(collisionCheck);
    }
  }, 50);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
    clearInterval(collisionCheck);
  });
}

function checkCollision(drop, waterCan) {
  const dropRect = drop.getBoundingClientRect();
  const canRect = waterCan.getBoundingClientRect();
  
  return !(dropRect.right < canRect.left || 
           dropRect.left > canRect.right || 
           dropRect.bottom < canRect.top || 
           dropRect.top > canRect.bottom);
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(gameTimer);
  
  // Remove any remaining drops
  const drops = document.querySelectorAll('.water-drop');
  drops.forEach(drop => drop.remove());
  
  alert(`Game Over! Your final score: ${score}`);
}
