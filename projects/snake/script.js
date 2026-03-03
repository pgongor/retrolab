const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");

const gridSize = 20;
const tileCount = 20;

const highScoreDisplay = document.getElementById("highScore");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreDisplay.textContent = highScore;

canvas.width = 400;
canvas.height = 400;

let snake = [{ x: 10, y: 10 }];

let dx = 1;
let dy = 0;

let food = generateFood();

let pulse = 0;

let score = 0;

let gameOver = false;

let speed = 100;

let showNewRecord = false;
let newRecordTimer = 0;

let gameLoop = null;

function drawGame() {

  if (gameOver) {
    drawGameOver();
    return;
  }

  const ateFood = moveSnake();

  if (checkWallCollision() || checkSelfCollision()) {
    gameOver = true;
    clearTimeout(gameLoop);

  }

  if (ateFood) {
    score++;
    scoreDisplay.textContent = score;
    food = generateFood();
    playEatSound();

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", highScore);
      highScoreDisplay.textContent = highScore;

      showNewRecord = true;
      newRecordTimer = 60; // frames
    }

    if (score % 5 === 0 && speed > 40) {
      speed -= 10;
    }
  }

  clearCanvas();
  drawFood();
  drawSnake();

  if (showNewRecord) {
    drawNewRecord();

    newRecordTimer--;
    if (newRecordTimer <= 0) {
      showNewRecord = false;
    }
  }

  gameLoop = setTimeout(drawGame, speed);
}

function drawGameOver() {

  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--gb-lightest');

  ctx.textAlign = "center";
  ctx.font = "20px 'Press Start 2P'";

  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = "12px 'Press Start 2P'";
  ctx.fillText("PRESS ANY KEY", canvas.width / 2, canvas.height / 2 + 20);
}

function clearCanvas() {
  ctx.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--gb-darkest');
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {

  snake.forEach((segment, index) => {

    if (index === 0) {
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--gb-light'); // cabeza más brillante
    } else {
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--gb-lightest');
    }

    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  });
}

function drawFood() {

  pulse += 0.1;
  const scale = 1 + Math.sin(pulse) * 0.1;

  const size = (gridSize - 2) * scale;
  const offset = (gridSize - size) / 2;

  ctx.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--gb-light');

  ctx.fillRect(
    food.x * gridSize + offset,
    food.y * gridSize + offset,
    size,
    size
  );
}

function moveSnake() {

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    return true; // ha comido
  }

  snake.pop();
  return false;
}

function checkWallCollision() {
  const head = snake[0];

  return (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount
  );
}

function generateFood() {

  let newFood;

  while (true) {

    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };

    const collision = snake.some(segment =>
      segment.x === newFood.x && segment.y === newFood.y
    );

    if (!collision) break;
  }

  return newFood;
}

function checkSelfCollision() {
  const head = snake[0];

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }

  return false;
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 1;
  dy = 0;
  score = 0;
  speed = 100;
  scoreDisplay.textContent = score;
  food = generateFood();
  gameOver = false;
}

document.addEventListener("keydown", e => {

  if (gameOver) {
    clearTimeout(gameLoop);
    resetGame();
    drawGame();
    return;
  }

  if (e.key === "ArrowUp" && dy === 0) {
    dx = 0;
    dy = -1;
  }

  if (e.key === "ArrowDown" && dy === 0) {
    dx = 0;
    dy = 1;
  }

  if (e.key === "ArrowLeft" && dx === 0) {
    dx = -1;
    dy = 0;
  }

  if (e.key === "ArrowRight" && dx === 0) {
    dx = 1;
    dy = 0;
  }

});

function playEatSound() {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "square";
  oscillator.frequency.value = 400;

  gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + 0.08
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.08);
}

function drawNewRecord() {

  ctx.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--gb-lightest');

  ctx.textAlign = "center";
  ctx.font = "14px 'Press Start 2P'";

  ctx.fillText("NEW RECORD!", canvas.width / 2, 30);
}

document.addEventListener("keydown", () => {
  audioCtx.resume();
}, { once: true });

drawGame();