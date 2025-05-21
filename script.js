const dino = document.getElementById("dino");
const scoreDisplay = document.getElementById("score");

const jumpSound = new Audio("jump.mp3");
const gameOverSound = new Audio("gameover.mp3");

let isJumping = false;
let score = 0;
let flowers = ["flower1.png", "flower2.png"];
let flowerIndex = 0;

// Controle de pulo
document.addEventListener("keydown", function (event) {
  if ((event.code === "Space" || event.code === "ArrowUp") && !isJumping) {
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

// Spawn de obstáculos (flores)
function spawnFlower() {
  const flower = document.createElement("div");
  flower.classList.add("flower");
  flower.style.backgroundImage = `url('${flowers[flowerIndex]}')`;
  flowerIndex = (flowerIndex + 1) % flowers.length;

  let pos = 800;
  document.querySelector(".game-container").appendChild(flower);

  const moveInterval = setInterval(() => {
    if (pos < -30) {
      flower.remove();
      clearInterval(moveInterval);
      score++;
      scoreDisplay.textContent = "Pontuação: " + score;
    } else {
      pos -= 5;
      flower.style.left = pos + "px";

      let dinoBottom = parseInt(window.getComputedStyle(dino).bottom);
      if (pos < 90 && pos > 50 && dinoBottom < 40) {
        gameOverSound.play();
        alert("💀 Game Over! Pontuação final: " + score);
        location.reload();
      }
    }
  }, 20);
}

// Escolher personagem
function selectCharacter(image) {
  dino.style.backgroundImage = `url('${image}')`;
  dino.style.backgroundSize = "cover";
}

// Iniciar geração de obstáculos a cada 2 segundos
setInterval(spawnFlower, 2000);
