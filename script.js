// script.js atualizado completo com colisão refinada, pontuação por tempo e aumento de velocidade

const dino = document.getElementById("dino");
const ground = document.getElementById("ground");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");
const finalScoreDisplay = document.getElementById("finalScore");
const jumpSound = document.getElementById("jumpSound");
const scoreSound = document.getElementById("scoreSound");
const gameOverSound = document.getElementById("gameOverSound");

let isJumping = false;
let isRunning = false;
let score = 0;
let gameOver = false;
let flowerInterval;
let flowerIntervals = [];
let speedMultiplier = 1;
const maxSpeedMultiplier = 2; // você pode ajustar se quiser mais rápido
let timeScoreInterval;
let gameTime = 0;

function jump() {
  if (isJumping) return;
  isJumping = true;
  jumpSound.play();

  let position = 0;
  let upInterval = setInterval(() => {
    if (position >= 150) {
      clearInterval(upInterval);
      let downInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          position -= 5 * speedMultiplier;
          dino.style.bottom = position + "px";
        }
      }, 20);
    } else {
      position += 5 * speedMultiplier;
      dino.style.bottom = position + "px";
    }
  }, 20);
}

function createFlower() {
  const flower = document.createElement("div");
  flower.classList.add("flower");
  flower.style.left = "100%";
  ground.appendChild(flower);

  let flowerInterval = setInterval(() => {
    let flowerLeft = parseInt(flower.style.left);
    if (flowerLeft < -60) {
      clearInterval(flowerInterval);
      ground.removeChild(flower);
      score++;
      scoreDisplay.innerText = "Pontuação: " + score;
      scoreSound.play();
    } else {
      flower.style.left = flowerLeft - 10 * speedMultiplier + "px";
    }

    // Pega dimensões reais
    let dinoLeft = dino.offsetLeft;
    let dinoBottom = parseInt(window.getComputedStyle(dino).bottom);
    let dinoWidth = dino.offsetWidth;
    let dinoHeight = dino.offsetHeight;

    let flowerWidth = flower.offsetWidth;
    let flowerHeight = flower.offsetHeight;

    // Define hitboxes menores (colisão refinada)
    const dinoHitbox = {
      left: dinoLeft + 10,
      right: dinoLeft + dinoWidth - 10,
      bottom: dinoBottom + 5,
      top: dinoBottom + dinoHeight - 5
    };

    const flowerHitbox = {
      left: flowerLeft + 10,
      right: flowerLeft + flowerWidth - 10,
      bottom: 0,
      top: flowerHeight - 10
    };

    if (
      dinoHitbox.right > flowerHitbox.left &&
      dinoHitbox.left < flowerHitbox.right &&
      dinoHitbox.top > flowerHitbox.bottom &&
      dinoHitbox.bottom < flowerHitbox.top &&
      !gameOver
    ) {
      console.log("Colisão precisa detectada!");
      gameOverSound.play();
      gameOver = true;
      clearInterval(flowerInterval);
      flowerIntervals.forEach(id => clearInterval(id));
      flowerIntervals = [];
      clearInterval(timeScoreInterval);
      finalScoreDisplay.innerText = score;
      gameOverScreen.style.display = "block";
    }
  }, 20);

  flowerIntervals.push(flowerInterval);
}

function spawnFlower() {
  createFlower();
}

function startGame() {
  gameOver = false;
  isJumping = false;
  isRunning = true;
  score = 0;
  gameTime = 0;
  speedMultiplier = 1;
  scoreDisplay.innerText = "Pontuação: 0";
  gameOverScreen.style.display = "none";

  // Gera flores a cada 2 segundos, ajustável com a velocidade
  flowerInterval = setInterval(spawnFlower, 2000);

  // Pontuação por tempo jogado
  timeScoreInterval = setInterval(() => {
    gameTime++;
    score++;
    scoreDisplay.innerText = "Pontuação: " + score;

    if (score % 100 === 0) {
      speedMultiplier = Math.min(maxSpeedMultiplier, speedMultiplier + 0.1);
      console.log("Velocidade aumentada: speedMultiplier =", speedMultiplier);
      clearInterval(flowerInterval);
      const newSpawnRate = Math.max(2000 / speedMultiplier, 500);
      flowerInterval = setInterval(spawnFlower, newSpawnRate);
    }
  }, 1000);
}

function restartGame() {
  clearInterval(flowerInterval);
  clearInterval(timeScoreInterval);
  ground.innerHTML = "";
  ground.appendChild(dino);
  startGame();
}

document.addEventListener("keydown", event => {
  if (event.code === "Space") {
    if (!isRunning) {
      startGame();
    } else {
      jump();
    }
  }
});

document.getElementById("restartButton").addEventListener("click", restartGame);
