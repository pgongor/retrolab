const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 375;

const rootStyles = getComputedStyle(document.documentElement);

const paddleWidth = 10;
const paddleHeight = 80;
const paddleSpeed = 5;

let playerY = canvas.height / 2 - paddleHeight / 2;
let cpuY = canvas.height / 2 - paddleHeight / 2;

const ballSize = 10;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

let ballSpeedX;
let ballSpeedY;

let gameOver = false;
const maxScore = 5;

let baseBallSpeed = 4;

let moveUp = false;
let moveDown = false;

let playerScore = 0;
let cpuScore = 0;

const playerScoreDisplay = document.getElementById("playerScore");
const cpuScoreDisplay = document.getElementById("cpuScore");

document.addEventListener("keydown", e => {
  if (e.key === "w" || e.key === "W") moveUp = true;
  if (e.key === "s" || e.key === "S") moveDown = true;
});

document.addEventListener("keyup", e => {
  if (e.key === "w" || e.key === "W") moveUp = false;
  if (e.key === "s" || e.key === "S") moveDown = false;
});

document.addEventListener("keydown", e => {

  if (gameOver && e.key === "Enter") {
    resetGame();
  }

});

function resetGame() {

  playerScore = 0;
  cpuScore = 0;

  playerScoreDisplay.textContent = 0;
  cpuScoreDisplay.textContent = 0;

  baseBallSpeed = 4;
  gameOver = false;

  resetBall();
}

function draw() {

  clear();
  drawCenterLine();
  drawPaddles();
  drawBall();

  if (!gameOver) {
    movePlayer();
    moveCPU();
    moveBall();
  } else {
    drawGameOver();
  }

  requestAnimationFrame(draw);
}

function clear() {
  ctx.fillStyle = rootStyles.getPropertyValue('--gb-darkest');
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCenterLine() {
  ctx.fillStyle = rootStyles.getPropertyValue('--gb-light');

  for (let i = 0; i < canvas.height; i += 20) {
    ctx.fillRect(canvas.width / 2 - 2, i, 4, 10);
  }
}

function drawPaddles() {
  ctx.fillStyle = rootStyles.getPropertyValue('--gb-lightest');

  // Player
  ctx.fillRect(10, playerY, paddleWidth, paddleHeight);

  // CPU
  ctx.fillRect(canvas.width - 20, cpuY, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.fillStyle = rootStyles.getPropertyValue('--gb-light');

  ctx.fillRect(ballX, ballY, ballSize, ballSize);
}

function moveBall() {

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Rebote arriba/abajo
  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballSpeedY *= -1;
    playBounceSound();
  }

  // Colisión jugador
if (
  ballX <= 20 &&
  ballY + ballSize >= playerY &&
  ballY <= playerY + paddleHeight
) {
  ballX = 20;

  baseBallSpeed += 0.5; // aumenta aquí
  applyDynamicBounce(playerY, 1);
  playBounceSound();
}

  // Colisión CPU
if (
  ballX + ballSize >= canvas.width - 20 &&
  ballY + ballSize >= cpuY &&
  ballY <= cpuY + paddleHeight
) {
  ballX = canvas.width - 20 - ballSize;

  baseBallSpeed += 0.5; // aumenta aquí
  applyDynamicBounce(cpuY, -1);
  playBounceSound();
}

if (ballX < 0) {
  cpuScore++;
  cpuScoreDisplay.textContent = cpuScore;

  checkGameOver();
  resetBall();
}

if (ballX > canvas.width) {
  playerScore++;
  playerScoreDisplay.textContent = playerScore;

  checkGameOver();
  resetBall();
}
}

function resetBall() {

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;

  const direction = Math.random() > 0.5 ? 1 : -1;
  baseBallSpeed = 4;

  ballSpeedX = direction * baseBallSpeed;
  ballSpeedY = baseBallSpeed * (Math.random() > 0.5 ? 1 : -1);
}

function movePlayer() {
  if (moveUp && playerY > 0) {
    playerY -= paddleSpeed;
  }

  if (moveDown && playerY + paddleHeight < canvas.height) {
    playerY += paddleSpeed;
  }
}

function moveCPU() {

  const cpuCenter = cpuY + paddleHeight / 2;

  if (cpuCenter < ballY - 10) {
    cpuY += paddleSpeed - 1;
  } else if (cpuCenter > ballY + 10) {
    cpuY -= paddleSpeed - 1;
  }

  // Limitar dentro del canvas
  if (cpuY < 0) cpuY = 0;
  if (cpuY + paddleHeight > canvas.height) {
    cpuY = canvas.height - paddleHeight;
  }
}

function applyDynamicBounce(paddleY, direction) {

  const paddleCenter = paddleY + paddleHeight / 2;
  const ballCenter = ballY + ballSize / 2;

  const relativeIntersect = ballCenter - paddleCenter;
  const normalizedIntersect = relativeIntersect / (paddleHeight / 2);

  const maxBounceAngle = Math.PI / 3;

  const bounceAngle = normalizedIntersect * maxBounceAngle;

  const speed = baseBallSpeed;

  ballSpeedX = direction * speed * Math.cos(bounceAngle);
  ballSpeedY = speed * Math.sin(bounceAngle);

  if (Math.abs(ballSpeedX) < 1.5) {
    ballSpeedX = direction * 1.5;
  }
}

function checkGameOver() {

  if (playerScore >= maxScore || cpuScore >= maxScore) {
    gameOver = true;
  }
}

function drawGameOver() {

  ctx.fillStyle = rootStyles.getPropertyValue('--gb-lightest');
  ctx.textAlign = "center";
  ctx.font = "20px 'Press Start 2P'";

  const winner = playerScore > cpuScore ? "PLAYER WINS" : "CPU WINS";

  ctx.fillText(winner, canvas.width / 2, canvas.height / 2 - 20);

  ctx.font = "12px 'Press Start 2P'";
  ctx.fillText("PRESS ENTER", canvas.width / 2, canvas.height / 2 + 20);
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBounceSound() {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "square";
  oscillator.frequency.value = 600;

  gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + 0.05
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.05);
}

document.addEventListener("keydown", () => {
  audioCtx.resume();
}, { once: true });

resetBall();
draw();