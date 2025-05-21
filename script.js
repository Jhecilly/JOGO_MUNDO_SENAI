const dino = document.getElementById("dino");
const jumpSound = new Audio("jump.mp3");
const gameOverSound = new Audio("gameover.mp3");
let isJumping = false;
let score = 0;

let flowers = ["flower1.png", "flower2.png"];
let flowerIndex = 0;

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

  let pos = 800;
  flower.style.right = -30 + "px";
  document.querySelector(".game-container").appendChild(flower);

  let moveInterval = setInterval(() => {
    if (pos < -40) {
      flower.remove();
      clearInterval(moveInterval);
      score++;
    } else {
      pos -= 5;
      flower.style.right = (800 - pos) + "px";

      let dinoBottom = parseInt(window.getComputedStyle(dino).bottom);
      if (pos > 50 && pos < 90 && dinoBottom < 40) {
        gameOverSound.play();
        alert("Game Over! Pontuação: " + score);
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
