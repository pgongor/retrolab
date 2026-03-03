const input = document.getElementById("input");
const output = document.getElementById("output");
const modeDisplay = document.getElementById("mode");

let mode = "dec"; // dec o bin

function updateModeDisplay() {
  if (mode === "dec") {
    modeDisplay.textContent = "MODE: DEC > BIN";
  } else {
    modeDisplay.textContent = "MODE: BIN > DEC";
  }
}

updateModeDisplay();

document.addEventListener("keydown", function(e) {

  if (e.key === "Tab") {
    e.preventDefault();
    mode = mode === "dec" ? "bin" : "dec";
    updateModeDisplay();
  }

});

input.addEventListener("keydown", function(e) {

  if (e.key === "Enter") {

    const value = input.value.trim();

    if (value === "") return;

    let result;

    if (mode === "dec") {

      if (!/^[0-9]+$/.test(value)) {
        result = "ERROR";
      } else {
        result = parseInt(value, 10).toString(2);
      }

    } else {

      if (!/^[01]+$/.test(value)) {
        result = "ERROR";
      } else {
        result = parseInt(value, 2).toString(10);
      }

    }

    output.textContent = result;
    input.value = "";
  }

});