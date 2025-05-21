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
let flowers = ["flower1.png", "flower2.png"];
let flowerIndex = 0;

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
  const jumpInterval = setInterval(() => {
    if (up >= 100) {
      clearInterval(jumpInterval);
      const downInterval = setInterval(() => {
        if (up <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          up -= 5;
          dino.style.bottom = up + "px";
        }
      }, 20);
    } else {
      up += 5;
      dino.style.bottom = up + "px";
    }
  }, 20);
}

function spawnFlower() {
  const flower = document.createElement("div");
  flower.classList.add("flower");
  flower.style.backgroundImage = `url('${flowers[flowerIndex]}')`;
  flowerIndex = (flowerIndex + 1) % flowers.length;

  let pos = 800;
  flower.style.left = pos + "px";
  flower.style.bottom = "0px";
  document.querySelector(".game-container").appendChild(flower);

  const moveInterval = setInterval(() => {
    if (pos < -40) {
      flower.remove();
      clearInterval(moveInterval);
      score++;
      scoreDisplay.innerText = "Pontuação: " + score;
    } else {
      pos -= 5;
      flower.style.left = pos + "px";

      // Colisão
      const dinoBottom = parseInt(window.getComputedStyle(dino).bottom) || 0;
      const dinoLeft = 50;
      const flowerLeft = pos;
      const flowerWidth = 30;
      const flowerHeight = 40;

      if (
        flowerLeft < dinoLeft + 40 &&
        flowerLeft + flowerWidth > dinoLeft &&
        dinoBottom < flowerHeight &&
        !gameOver
      ) {
        gameOverSound.play();
        gameOver = true;
        clearInterval(flowerInterval);
        finalScoreDisplay.innerText = score;
        gameOverScreen.style.display = "block";
      }
    }
  }, 20);
}

function startGame() {
  gameOver = false;
  score = 0;
  scoreDisplay.innerText = "Pontuação: 0";
  gameOverScreen.style.display = "none";
  flowerInterval = setInterval(spawnFlower, 2000);
}

function restartGame() {
  // Remove todas as flores
  document.querySelectorAll(".flower").forEach(flower => flower.remove());
  // Reseta o jogo
  gameOver = false;
  score = 0;
  scoreDisplay.innerText = "Pontuação: 0";
  gameOverScreen.style.display = "none";
  startGame();
}
