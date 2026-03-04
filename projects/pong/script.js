const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 375;

function draw() {
  clear();
  drawCenterLine();
  requestAnimationFrame(draw);
}

function clear() {
  ctx.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--gb-darkest');
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCenterLine() {
  ctx.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--gb-light');

  for (let i = 0; i < canvas.height; i += 20) {
    ctx.fillRect(canvas.width / 2 - 2, i, 4, 10);
  }
}

draw();