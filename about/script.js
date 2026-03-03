const lines = document.querySelectorAll(".line");

const baseSpeed = 70; // velocidad cinematográfica base

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeLine(element) {

  const text = element.dataset.text;
  element.textContent = "";

  const cursor = document.createElement("span");
  cursor.classList.add("cursor");

  for (let i = 0; i < text.length; i++) {

    element.textContent += text[i];
    if (text[i] !== " ") {
      playKeySound();
    }

    if (!element.contains(cursor)) {
      element.appendChild(cursor);
    }

    let delay = baseSpeed + Math.random() * 40;

    if (text[i] === "." || text[i] === ",") {
      delay += 300;
    }

    await sleep(delay);
  }

  if (element !== lines[lines.length - 1]) {
    cursor.remove();
  }
}

async function startTyping() {
  for (const line of lines) {
    await typeLine(line);
    await sleep(500);
  }

  showSocial();
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playKeySound() {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "square";
  oscillator.frequency.value = 800 + Math.random() * 200;

  gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + 0.02
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.02);
}

document.addEventListener("keydown", () => {
  audioCtx.resume();
}, { once: true });

document.addEventListener("click", () => {
  audioCtx.resume();
}, { once: true });

function showSocial() {
  const social = document.getElementById("social");
  social.classList.add("show");
}

/**
 * 
 * Con esta opción, hay que clickar para que empiece la animación
 * pero eso permite que se ejectue el iniciador del audio que simula
 * el sonido de las teclas del teclado
 * 
 * function init() {
  audioCtx.resume();
  startTyping();
}

document.addEventListener("keydown", init, { once: true });
document.addEventListener("click", init, { once: true });*/

startTyping();