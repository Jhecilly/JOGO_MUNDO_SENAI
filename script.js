const dino = document.getElementById("dino");
const scoreDisplay = document.getElementById("score"); // Usa o elemento existente
const jumpSound = new Audio("jump.mp3");
const gameOverSound = new Audio("gameover.mp3");
let isJumping = false;
let score = 0;
let gameStarted = false; // Controla se o jogo começou
let flowerInterval; // Para controlar o spawn das flores

let flowers = ["flower1.png", "flower2.png"];
let flowerIndex = 0;

document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && !isJumping && gameStarted) {
    jump();
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
  flower.style.bottom = "0px"; // Garante que a flor esteja no chão
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
        gameStarted // Só verifica colisão se o jogo começou
      ) {
        gameOverSound.play();
        clearInterval(flowerInterval); // Para o spawn de flores
        alert("💀 Game Over! Pontuação final: " + score);
        location.reload();
      }
    }
  }, 20);
}

function selectCharacter(image) {
  dino.style.backgroundImage = `url('${image}')`;
  dino.style.backgroundSize = "cover";
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    score = 0; // Reseta a pontuação
    scoreDisplay.innerText = "Pontuação: 0";
    flowerInterval = setInterval(spawnFlower, 2000); // Começa a gerar flores
  }
}
