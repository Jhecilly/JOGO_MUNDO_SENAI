const dino = document.getElementById("dino");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const jumpSound = new Audio("jump.mp3");
const gameOverSound = new Audio("gameover.mp3");
let isJumping = false;
let score = 0;
let gameOver = false;
let flowerInterval;
let flowerIntervals = [];
let flowers = ["flower1.png", "flower2.png"];
let flowerIndex = 0;
let speedMultiplier = 1;
const maxSpeedMultiplier = 2;

const selectedCharacter = localStorage.getItem('selectedCharacter') || 'char1.png';
dino.src = selectedCharacter;

startGame();

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    if (gameOver) {
      restartGame();
    } else if (!isJumping) {
      jump();
    }
  }
});

function jump() {
  isJumping = true;
  jumpSound.play();
  let up = 0;
  const baseJumpSpeed = 5;
  const jumpSpeed = baseJumpSpeed * speedMultiplier;
  const jumpIntervalTime = Math.max(20 / speedMultiplier, 10);

  const jumpInterval = setInterval(() => {
    if (up >= 225) {
      clearInterval(jumpInterval);
      const downInterval = setInterval(() => {
        if (up <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          up -= jumpSpeed;
          dino.style.bottom = up + "px";
        }
      }, jumpIntervalTime);
    } else {
      up += jumpSpeed;
      dino.style.bottom = up + "px";
    }
  }, jumpIntervalTime);
}

function spawnFlower() {
  const flower = document.createElement("img");
  flower.classList.add("flower");
  flower.src = flowers[flowerIndex];
  flowerIndex = (flowerIndex + 1) % flowers.length;

  let pos = 1200;
  flower.style.left = pos + "px";
  flower.style.bottom = "0px";
  flower.style.position = "absolute";
  document.querySelector(".game-container").appendChild(flower);

  const baseFlowerSpeed = 5;
  const flowerSpeed = baseFlowerSpeed * speedMultiplier;
  const moveIntervalTime = Math.max(20 / speedMultiplier, 10);

  const moveInterval = setInterval(() => {
    if (pos < -75) {
      flower.remove();
      clearInterval(moveInterval);
      flowerIntervals = flowerIntervals.filter(id => id !== moveInterval);
      score++;
      scoreDisplay.innerText = "Pontuação: " + score;

      if (score % 10 === 0) {
        speedMultiplier = Math.min(maxSpeedMultiplier, speedMultiplier + 0.1);
      }
    } else {
      pos -= flowerSpeed;
      flower.style.left = pos + "px";

      if (!gameOver && checkPixelCollision(dino, flower)) {
        gameOverSound.play();
        gameOver = true;
        clearInterval(flowerInterval);
        flowerIntervals.forEach(id => clearInterval(id));
        flowerIntervals = [];
        finalScoreDisplay.innerText = score;
        gameOverScreen.style.display = "block";
      }
    }
  }, moveIntervalTime);
  flowerIntervals.push(moveInterval);
}

function startGame() {
  gameOver = false;
  score = 0;
  speedMultiplier = 1;
  scoreDisplay.innerText = "Pontuação: 0";
  gameOverScreen.style.display = "none";
  flowerInterval = setInterval(spawnFlower, 2000);
}

function restartGame() {
  document.querySelectorAll(".flower").forEach(flower => flower.remove());
  flowerIntervals.forEach(id => clearInterval(id));
  flowerIntervals = [];
  gameOver = false;
  score = 0;
  speedMultiplier = 1;
  scoreDisplay.innerText = "Pontuação: 0";
  gameOverScreen.style.display = "none";
  startGame();
}

