const dino = document.getElementById("dino");
const jumpSound = new Audio("jump.mp3");
const gameOverSound = new Audio("gameover.mp3");
let isJumping = false;
let score = 0;

let flowers = ["flower1.png", "flower2.png"];
let flowerIndex = 0;

// Mostra a pontuação na tela
const scoreDisplay = document.createElement("div");
scoreDisplay.style.position = "absolute";
scoreDisplay.style.top = "10px";
scoreDisplay.style.left = "10px";
scoreDisplay.style.padding = "5px 10px";
scoreDisplay.style.backgroundColor = "#ffd";
scoreDisplay.style.border = "2px solid #000";
scoreDisplay.innerText = "Pontuação: 0";
document.querySelector(".game-container").appendChild(scoreDisplay);

document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && !isJumping) {
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

  // Define posição inicial da flor à direita
  let pos = 800;
  flower.style.left = pos + "px";
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
      const dinoBottom = parseInt(window.getComputedStyle(dino).bottom);
      const dinoLeft = 50; // Posição fixa do dino (você pode ajustar se quiser)
      const flowerLeft = pos;
      const flowerWidth = 30;

      if (
        flowerLeft < dinoLeft + 40 &&
        flowerLeft + flowerWidth > dinoLeft &&
        dinoBottom < 40
      ) {
        gameOverSound.play();
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

setInterval(spawnFlower, 2000);
