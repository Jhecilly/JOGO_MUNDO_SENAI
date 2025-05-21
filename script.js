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
let speedMultiplier = 1; // Multiplicador de velocidade inicial
const maxSpeedMultiplier = 2; // Limite máximo de velocidade (2x)

// Carrega o personagem selecionado
const selectedCharacter = localStorage.getItem('selectedCharacter') || 'char1.png';
dino.style.backgroundImage = `url('${selectedCharacter}')`;
dino.style.backgroundSize = "cover";

// Inicia o jogo automaticamente
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
  const baseJumpSpeed = 5; // Velocidade base do pulo
  const jumpSpeed = baseJumpSpeed * speedMultiplier; // Ajusta com o multiplicador
  const jumpIntervalTime = Math.max(20 / speedMultiplier, 10); // Intervalo diminui com a velocidade

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
  const flower = document.createElement("div");
  flower.classList.add("flower");
  flower.style.backgroundImage = `url('${flowers[flowerIndex]}')`;
  flowerIndex = (flowerIndex + 1) % flowers.length;

  let pos = 1200;
  flower.style.left = pos + "px";
  flower.style.bottom = "0px";
  document.querySelector(".game-container").appendChild(flower);

  // Debug: Verificar posição da flor
  console.log("Flor criada: bottom =", flower.style.bottom);

  const baseFlowerSpeed = 5; // Velocidade base da flor
  const flowerSpeed = baseFlowerSpeed * speedMultiplier; // Ajusta com o multiplicador
  const moveIntervalTime = Math.max(20 / speedMultiplier, 10); // Intervalo diminui com a velocidade

  const moveInterval = setInterval(() => {
    if (pos < -75) {
      flower.remove();
      clearInterval(moveInterval);
      flowerIntervals = flowerIntervals.filter(id => id !== moveInterval);
      score++;
      scoreDisplay.innerText = "Pontuação: " + score;

      // Aumenta a velocidade a cada 10 pontos
      if (score % 10 === 0) {
        speedMultiplier = Math.min(maxSpeedMultiplier, speedMultiplier + 0.1);
        console.log("Velocidade aumentada: speedMultiplier =", speedMultiplier);
      }
    } else {
      pos -= flowerSpeed;
      flower.style.left = pos + "px";

      // Colisão mais precisa
      const dinoBottom = parseInt(window.getComputedStyle(dino).bottom) || 0;
      const dinoLeft = 75;
      const dinoWidth = 60;
      const dinoHeight = 60;
      const flowerLeft = pos;
      const flowerWidth = 75;
      const flowerHeight = 90;

      if (
        flowerLeft < dinoLeft + dinoWidth &&
        flowerLeft + flowerWidth > dinoLeft &&
        dinoBottom < flowerHeight &&
        dinoBottom + dinoHeight > 0 &&
        !gameOver
      ) {
        console.log("Colisão detectada:", { dinoBottom, dinoLeft, flowerLeft, flowerWidth, flowerHeight });
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
  speedMultiplier = 1; // Reseta a velocidade
  scoreDisplay.innerText = "Pontuação: 0";
  gameOverScreen.style.display = "none";
  flowerInterval = setInterval(spawnFlower, 2000);
}

function restartGame() {
  // Remove todas as flores
  document.querySelectorAll(".flower").forEach(flower => flower.remove());
  // Limpa todos os intervalos de movimento
  flowerIntervals.forEach(id => clearInterval(id));
  flowerIntervals = [];
  // Reseta o jogo
  gameOver = false;
  score = 0;
  speedMultiplier = 1; // Reseta a velocidade
  scoreDisplay.innerText = "Pontuação: 0";
  gameOverScreen.style.display = "none";
  startGame();
}