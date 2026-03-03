const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");

let currentValue = "0";
let previousValue = null;
let operator = null;
let shouldReset = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function appendNumber(number) {
  if (shouldReset) {
    currentValue = number === "." ? "0." : number;
    shouldReset = false;
    return;
  }

  if (number === "." && currentValue.includes(".")) return;

  if (currentValue === "0" && number !== ".") {
    currentValue = number;
  } else {
    currentValue += number;
  }
}

function chooseOperator(op) {
  if (operator !== null) compute();

  previousValue = currentValue;
  operator = op;
  shouldReset = true;
}

function compute() {
  if (operator === null || previousValue === null) return;

  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);

  let result;

  switch (operator) {
    case "+": result = prev + current; break;
    case "-": result = prev - current; break;
    case "*": result = prev * current; break;
    case "/": result = current === 0 ? "ERR" : prev / current; break;
  }

  currentValue = result.toString();
  operator = null;
  previousValue = null;
}

function clearAll() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  shouldReset = false;
}

function deleteLast() {
  if (shouldReset) return;

  if (currentValue.length === 1) {
    currentValue = "0";
  } else {
    currentValue = currentValue.slice(0, -1);
  }
}

/* === NUEVA FUNCIÓN CENTRAL === */

function handleInput(value) {

  if (!isNaN(value) || value === ".") {
    appendNumber(value);

  } else if (value === "=") {
    compute();

  } else if (value === "C") {
    clearAll();

  } else if (value === "DEL") {
    deleteLast();

  } else if (["+","-","*","/"].includes(value)) {
    chooseOperator(value);
  }

  updateDisplay();
}

/* === CLICK BOTONES === */

buttons.forEach(button => {
  button.addEventListener("click", () => {
    handleInput(button.textContent);
  });
});

/* === TECLADO FÍSICO === */

document.addEventListener("keydown", (e) => {

  if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
    handleInput(e.key);
  }

  if (["+", "-", "*", "/"].includes(e.key)) {
    handleInput(e.key);
  }

  if (e.key === "Enter") {
    handleInput("=");
  }

  if (e.key === "Backspace") {
    handleInput("DEL");
  }

  if (e.key === "Escape") {
    handleInput("C");
  }

});

updateDisplay();