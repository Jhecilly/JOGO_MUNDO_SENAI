const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const scoreText = document.getElementById("score");

let isJumping = false;
let score = 0;

// Faz o dino pular
document.addEventListener("keydown", function (e) {
  if (e.code === "Space" || e.key === "w") {
    if (!isJumping) jump();
  }
});

function jump() {
  isJumping = true;
  let up = 0;
  let interval = setInterval(() => {
    if (up >= 100) {
      clearInterval(interval);
      let downInterval = setInterval(() => {
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

// Move o cactus
function moveCactus() {
  let cactusLeft = 800;
  let interval = setInterval(() => {
    if (cactusLeft < -20) {
      cactusLeft = 800;
      score++;
      scoreText.textContent = "Score: " + score;
    } else {
      cactusLeft -= 5;
    }

    // Colisão
    if (
      cactusLeft > 50 && cactusLeft < 90 &&
      parseInt(dino.style.bottom) < 40
    ) {
      alert("Game Over! Pontuação: " + score);
      location.reload();
    }

    cactus.style.right = (800 - cactusLeft) + "px";
  }, 20);
}

moveCactus();
