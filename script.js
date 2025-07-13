const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const shipImg = new Image();
const alienImg = new Image();
const boltImg = new Image();
shipImg.src = "assets/ship.png";
alienImg.src = "assets/alien.png";
boltImg.src = "assets/bolt.png";

let keys = {};
let ship = { x: 370, y: 550, width: 60, height: 60, speed: 5 };
let bolts = [];
let aliens = [];
let gameOver = false;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Create aliens
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 8; col++) {
    aliens.push({ x: 80 * col + 30, y: 60 * row + 30, width: 40, height: 40, alive: true });
  }
}

function shootBolt() {
  bolts.push({ x: ship.x + ship.width / 2 - 5, y: ship.y, width: 10, height: 20, speed: 7 });
}

function update() {
  if (gameOver) return;

  if (keys["ArrowLeft"] && ship.x > 0) ship.x -= ship.speed;
  if (keys["ArrowRight"] && ship.x < canvas.width - ship.width) ship.x += ship.speed;
  if (keys[" "]) {
    if (!keys._shooting) {
      shootBolt();
      keys._shooting = true;
    }
  } else {
    keys._shooting = false;
  }

  // Move bolts
  bolts.forEach(b => b.y -= b.speed);
  bolts = bolts.filter(b => b.y > 0);

  // Move aliens
  aliens.forEach(a => a.y += 0.2);
  if (aliens.some(a => a.y > ship.y - 40)) gameOver = true;

  // Collision
  bolts.forEach(bolt => {
    aliens.forEach(alien => {
      if (alien.alive &&
          bolt.x < alien.x + alien.width &&
          bolt.x + bolt.width > alien.x &&
          bolt.y < alien.y + alien.height &&
          bolt.y + bolt.height > alien.y) {
        alien.alive = false;
        bolt.y = -100; // Move bolt off screen
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

  bolts.forEach(b => ctx.drawImage(boltImg, b.x, b.y, b.width, b.height));
  aliens.forEach(a => {
    if (a.alive) ctx.drawImage(alienImg, a.x, a.y, a.width, a.height);
  });

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "48px sans-serif";
    ctx.fillText("Game Over", canvas.width / 2 - 130, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game once all images are loaded
let assetsLoaded = 0;
[shipImg, alienImg, boltImg].forEach(img => {
  img.onload = () => {
    assetsLoaded++;
    if (assetsLoaded === 3) gameLoop();
  };
});
