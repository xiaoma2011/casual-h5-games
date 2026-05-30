const board = document.querySelector("#board");
const movesEl = document.querySelector("#moves");
const matchedEl = document.querySelector("#matched");
const timerEl = document.querySelector("#timer");
const resetButton = document.querySelector("#resetButton");
const dialogResetButton = document.querySelector("#dialogResetButton");
const winDialog = document.querySelector("#winDialog");
const winSummary = document.querySelector("#winSummary");

const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = [
  { symbol: "\u2660", name: "spades", color: "black" },
  { symbol: "\u2665", name: "hearts", color: "red" },
  { symbol: "\u2666", name: "diamonds", color: "red" },
  { symbol: "\u2663", name: "clubs", color: "black" }
];

const bottomRowPlayableColumns = new Set([3, 4, 5, 6]);
let cards = [];
let firstPick = null;
let secondPick = null;
let lockBoard = false;
let moves = 0;
let matchedCount = 0;
let startedAt = null;
let timerId = null;
let mismatchTimeoutId = null;
let victoryTimeoutId = null;

function buildDeck() {
  return suits.flatMap((suit) =>
    ranks.map((rank) => ({
      id: `${rank}-${suit.name}`,
      rank,
      suit: suit.symbol,
      color: suit.color,
      matched: false
    }))
  );
}

function shuffle(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function startTimer() {
  if (timerId) return;
  startedAt = Date.now();
  timerId = window.setInterval(() => {
    timerEl.textContent = formatTime(Math.floor((Date.now() - startedAt) / 1000));
  }, 1000);
}

function stopTimer() {
  window.clearInterval(timerId);
  timerId = null;
}

function updateStats() {
  movesEl.textContent = String(moves);
  matchedEl.textContent = `${matchedCount}/52`;
}

function createCard(card) {
  const button = document.createElement("button");
  button.className = `card ${card.color}`;
  button.type = "button";
  button.dataset.id = card.id;
  button.dataset.rank = card.rank;
  button.dataset.suit = card.suit;
  button.dataset.suitName = card.id.split("-")[1];
  button.setAttribute("aria-label", "Face down playing card");

  button.innerHTML = `
    <span class="card-inner">
      <span class="card-face card-back" aria-hidden="true"></span>
      <span class="card-face card-front" aria-hidden="true">
        <span class="corner top">
          <span class="rank">${card.rank}</span>
          <span class="suit-small">${card.suit}</span>
        </span>
        <span class="suit-center">${card.suit}</span>
        <span class="corner bottom">
          <span class="rank">${card.rank}</span>
          <span class="suit-small">${card.suit}</span>
        </span>
      </span>
    </span>
  `;

  button.addEventListener("click", () => flipCard(button));
  return button;
}

function renderBoard() {
  board.innerHTML = "";
  let cardIndex = 0;

  for (let row = 1; row <= 7; row += 1) {
    for (let col = 1; col <= 8; col += 1) {
      const slot = document.createElement("div");
      const isBottomEmpty = row === 7 && !bottomRowPlayableColumns.has(col);
      slot.className = isBottomEmpty ? "slot empty" : "slot";

      if (!isBottomEmpty) {
        slot.append(createCard(cards[cardIndex]));
        cardIndex += 1;
      }

      board.append(slot);
    }
  }
}

function flipCard(cardButton) {
  if (lockBoard || cardButton === firstPick || cardButton.classList.contains("is-matched")) {
    return;
  }

  startTimer();
  cardButton.classList.add("is-flipped");
  cardButton.setAttribute("aria-label", `${cardButton.dataset.rank} of ${cardButton.dataset.suitName}`);

  if (!firstPick) {
    firstPick = cardButton;
    return;
  }

  secondPick = cardButton;
  moves += 1;
  updateStats();
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstPick.dataset.rank === secondPick.dataset.rank;
  if (isMatch) {
    keepMatchedCards();
    return;
  }

  lockBoard = true;
  mismatchTimeoutId = window.setTimeout(unflipPickedCards, 850);
}

function keepMatchedCards() {
  firstPick.classList.add("is-matched");
  secondPick.classList.add("is-matched");
  firstPick.disabled = true;
  secondPick.disabled = true;
  matchedCount += 2;
  updateStats();
  resetPicks();

  if (matchedCount === 52) {
    stopTimer();
    victoryTimeoutId = window.setTimeout(showVictory, 350);
  }
}

function unflipPickedCards() {
  if (!firstPick || !secondPick) {
    mismatchTimeoutId = null;
    return;
  }

  firstPick.classList.remove("is-flipped");
  secondPick.classList.remove("is-flipped");
  firstPick.setAttribute("aria-label", "Face down playing card");
  secondPick.setAttribute("aria-label", "Face down playing card");
  mismatchTimeoutId = null;
  resetPicks();
}

function resetPicks() {
  [firstPick, secondPick] = [null, null];
  lockBoard = false;
}

function showVictory() {
  winSummary.textContent = `You won in ${moves} moves and ${timerEl.textContent}.`;
  if (typeof winDialog.showModal === "function") {
    winDialog.showModal();
  }
}

function newGame() {
  stopTimer();
  window.clearTimeout(mismatchTimeoutId);
  window.clearTimeout(victoryTimeoutId);
  mismatchTimeoutId = null;
  victoryTimeoutId = null;
  cards = shuffle(buildDeck());
  firstPick = null;
  secondPick = null;
  lockBoard = false;
  moves = 0;
  matchedCount = 0;
  startedAt = null;
  timerEl.textContent = "00:00";
  updateStats();
  renderBoard();

  if (winDialog.open) {
    winDialog.close();
  }
}

resetButton.addEventListener("click", newGame);
dialogResetButton.addEventListener("click", newGame);

newGame();
