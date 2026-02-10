let selectedWord = "";
let hintText = "";
let tries = 6;
let guessed = [];
let parts;
let gameOverX;

// DOM
const wordDiv = document.getElementById("word");
const lettersDiv = document.getElementById("letters");
const triesSpan = document.getElementById("tries");
const message = document.getElementById("message");
const hintSpan = document.getElementById("hint");
const restartBtn = document.getElementById("restart");

startGame();
restartBtn.addEventListener("click", startGame);

function startGame() {
  tries = 6;
  guessed = [];
  triesSpan.textContent = tries;
  message.textContent = "";

  parts = document.querySelectorAll(".part");
  gameOverX = document.querySelector(".game-over-x");

  parts.forEach(p => p.style.display = "none");
  gameOverX.style.display = "none";
  lettersDiv.innerHTML = "";

  fetch("words.txt")
    .then(res => res.text())
    .then(text => {
      const lines = text
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean);

      const randomLine = lines[Math.floor(Math.random() * lines.length)];
      const [category, words] = randomLine.split(":");

      const wordList = words.split(",");
      selectedWord = wordList[Math.floor(Math.random() * wordList.length)];

      hintText = category;
      hintSpan.textContent = hintText;

      displayWord();
      createButtons();
    });
}

function displayWord() {
  wordDiv.textContent = selectedWord
    .split("")
    .map(l => guessed.includes(l) ? l : "_")
    .join(" ");
}

function createButtons() {
  for (let i = 65; i <= 90; i++) {
    const btn = document.createElement("button");
    btn.textContent = String.fromCharCode(i);
    btn.onclick = () => guess(btn.textContent.toLowerCase(), btn);
    lettersDiv.appendChild(btn);
  }
}

function guess(letter, btn) {
  btn.disabled = true;

  if (selectedWord.includes(letter)) {
    guessed.push(letter);
  } else {
    tries--;
    triesSpan.textContent = tries;
    showPart();
  }

  displayWord();
  checkGame();
}

function showPart() {
  const index = 6 - tries - 1;
  if (parts[index]) {
    parts[index].style.display = "block";
  }
}

function checkGame() {
  if (!wordDiv.textContent.includes("_")) {
    message.textContent = "🎉 You won!";
    endGame();
  }

  if (tries === 0) {
    message.textContent = "💀 Game over! Word was: " + selectedWord;
    gameOverX.style.display = "block";
    endGame();
  }
}

function endGame() {
  document.querySelectorAll("#letters button")
    .forEach(btn => btn.disabled = true);
}
