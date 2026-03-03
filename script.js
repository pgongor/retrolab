const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(frequency = 440, duration = 0.05) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "square";
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + duration
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

const items = document.querySelectorAll(".menu-item");
let currentIndex = 0;

function updateSelection() {
  items.forEach(item => item.classList.remove("active"));
  items[currentIndex].classList.add("active");
}

function navigate(direction) {
  currentIndex += direction;

  if (currentIndex < 0) {
    currentIndex = items.length - 1;
  }

  if (currentIndex >= items.length) {
    currentIndex = 0;
  }

  playBeep(600, 0.04); // sonido al moverse
  updateSelection();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    navigate(1);
  }

  if (e.key === "ArrowUp") {
    navigate(-1);
  }

  if (e.key === "Enter") {
  playBeep(300, 0.1); // sonido más grave al seleccionar
  setTimeout(() => {
    window.location.href = items[currentIndex].href;
  }, 100);  }
});

updateSelection();