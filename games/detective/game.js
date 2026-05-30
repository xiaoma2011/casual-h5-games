const canvas = document.getElementById("boardCanvas");
const ctx = canvas.getContext("2d");
const rollButton = document.getElementById("rollButton");
const searchModeButton = document.getElementById("searchModeButton");
const revealModeButton = document.getElementById("revealModeButton");
const newGameButton = document.getElementById("newGameButton");
const identifyButton = document.getElementById("identifyButton");
const diceRow = document.getElementById("diceRow");
const movesLabel = document.getElementById("movesLabel");
const phaseLabel = document.getElementById("phaseLabel");
const foxLabel = document.getElementById("foxLabel");
const foxTrack = document.getElementById("foxTrack");
const clueList = document.getElementById("clueList");
const clueCount = document.getElementById("clueCount");
const suspectGrid = document.getElementById("suspectGrid");
const suspectCount = document.getElementById("suspectCount");
const toast = document.getElementById("toast");
const caseDialog = document.getElementById("caseDialog");
const dialogTitle = document.getElementById("dialogTitle");
const dialogText = document.getElementById("dialogText");
const dialogButton = document.getElementById("dialogButton");

const ASSET_DIR = "images/";
const SUSPECT_ASSET_DIR = `${ASSET_DIR}suspects/`;
const CLUE_ASSET_DIR = `${ASSET_DIR}clues/`;
const DICE_ASSET_DIR = `${ASSET_DIR}dice/`;
const BOARD_IMAGE_URL = `${ASSET_DIR}board.jpg`;
const FOX_IMAGE_URL = `${ASSET_DIR}fox.png`;
const PLAYER_IMAGE_URL = `${ASSET_DIR}player.png`;
const SUSPECT_BACK_IMAGE_URL = `${SUSPECT_ASSET_DIR}suspect.jpg`;
const BOARD_SIZE = 18;
const FOX_PATH = [
  [0, 1],
  [1, 1],
  [2, 1],
  [3, 1],
  [3, 2],
  [3, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [3, 7],
  [3, 8],
  [3, 9],
  [3, 10],
  [4, 10],
  [5, 10],
  [6, 10],
  [7, 10],
  [8, 10],
  [9, 10],
  [9, 11],
  [9, 12],
  [9, 13],
  [9, 14],
  [9, 15],
  [9, 16],
  [10, 16],
  [11, 16],
  [12, 16],
  [12, 15],
  [12, 14],
  [12, 13],
  [13, 13],
  [14, 13],
  [15, 13],
  [15, 14],
  [16, 14],
  [17, 14],
];
const FOX_LIMIT = FOX_PATH.length - 1;
const FOX_FAIL_MOVE = 3;
const MAX_ROLLS = 3;
const FOX_STEP_DURATION = 220;
const IDENTIFY_REVEAL_DELAY = 500;
const DICE_ROLL_DURATION = 2000;
const DICE_ROLL_FRAME_MS = 75;
const BOARD_RECT = {
  x: 365,
  y: 170,
  width: 670,
  height: 670,
};
const SUSPECT_CARD = { width: 104, height: 132 };
const CLUE_SLOTS = [
  { cells: [[4, 1], [4, 2], [5, 1], [5, 2]] },
  { cells: [[1, 4], [1, 5], [2, 4], [2, 5]] },
  { cells: [[1, 15], [1, 16], [2, 15], [2, 16]] },
  { cells: [[2, 11], [2, 12], [3, 11], [3, 12]] },
  { cells: [[5, 5], [5, 6], [6, 5], [6, 6]] },
  { cells: [[6, 13], [6, 14], [7, 13], [7, 14]] },
  { cells: [[10, 2], [10, 3], [11, 2], [11, 3]] },
  { cells: [[10, 11], [10, 12], [11, 11], [11, 12]] },
  { cells: [[12, 6], [12, 7], [13, 6], [13, 7]] },
  { cells: [[15, 2], [15, 3], [16, 2], [16, 3]] },
  { cells: [[15, 10], [15, 11], [16, 10], [16, 11]] },
  { cells: [[13, 14], [13, 15], [14, 14], [14, 15]] },
];

const CLUE_MARKERS = [
  { id: "monocole", label: "Monocole", image: `${CLUE_ASSET_DIR}monocole.png` },
  { id: "glasses", label: "Glasses", image: `${CLUE_ASSET_DIR}glasses.png` },
  { id: "hat", label: "Hat", image: `${CLUE_ASSET_DIR}hat.png` },
  { id: "cape", label: "Cape", image: `${CLUE_ASSET_DIR}cape.png` },
  { id: "gloves", label: "Gloves", image: `${CLUE_ASSET_DIR}gloves.png` },
  { id: "scarf", label: "Scarf", image: `${CLUE_ASSET_DIR}scarf.png` },
  { id: "cane", label: "Cane", image: `${CLUE_ASSET_DIR}cane.png` },
  { id: "umbrella", label: "Umbrella", image: `${CLUE_ASSET_DIR}umbrella.png` },
  { id: "briefcase", label: "Briefcase", image: `${CLUE_ASSET_DIR}briefcase.png` },
  { id: "flower", label: "Flower", image: `${CLUE_ASSET_DIR}flower.png` },
  { id: "watch", label: "Watch", image: `${CLUE_ASSET_DIR}watch.png` },
  { id: "necklace", label: "Necklace", image: `${CLUE_ASSET_DIR}necklace.png` },
];

const CLUE_BY_ID = Object.fromEntries(CLUE_MARKERS.map((clue) => [clue.id, clue]));

const SUSPECT_DATA = [
  { name: "Alice", items: ["necklace", "cape", "watch"] },
  { name: "Arthur", items: ["hat", "scarf", "briefcase"] },
  { name: "Beatrice", items: ["umbrella", "scarf", "gloves"] },
  { name: "Belle", items: ["flower", "monocole", "cane"] },
  { name: "Belvedere", items: ["hat", "monocole", "watch"] },
  { name: "Charles", items: ["glasses", "flower", "watch"] },
  { name: "Daisy", items: ["necklace", "cape", "cane"] },
  { name: "Edith", items: ["monocole", "cape", "briefcase"] },
  { name: "Gertrude", items: ["flower", "necklace", "cane"] },
  { name: "Harold", items: ["glasses", "cape", "briefcase"] },
  { name: "Henry", items: ["glasses", "hat", "cane"] },
  { name: "Ingrid", items: ["glasses", "gloves", "umbrella"] },
  { name: "Lily", items: ["necklace", "gloves", "umbrella"] },
  { name: "Maggie", items: ["monocole", "gloves", "umbrella"] },
  { name: "Mary", items: ["flower", "scarf", "briefcase"] },
  { name: "Riley", items: ["hat", "scarf", "watch"] },
];
const SUSPECT_NAMES = SUSPECT_DATA.map((suspect) => suspect.name);

const SUSPECT_IMAGE_URLS = Object.fromEntries(
  SUSPECT_NAMES.map((name) => [name, `${SUSPECT_ASSET_DIR}${name.toLowerCase()}.jpg`]),
);

const COATS = ["red", "blue", "green", "gold"];
const DICE_FACES = [
  { type: "paw", count: 1, label: "One move", image: `${DICE_ASSET_DIR}one.png` },
  { type: "paw", count: 1, label: "One move", image: `${DICE_ASSET_DIR}one.png` },
  { type: "paw", count: 2, label: "Two moves", image: `${DICE_ASSET_DIR}two.png` },
  { type: "eye", count: 0, label: "Eye", image: `${DICE_ASSET_DIR}eye.png` },
  { type: "eye", count: 0, label: "Eye", image: `${DICE_ASSET_DIR}eye.png` },
  { type: "eye", count: 0, label: "Eye", image: `${DICE_ASSET_DIR}eye.png` },
];

const state = {
  action: "search",
  phase: "choose",
  rollsUsed: 0,
  dice: [],
  suspects: [],
  thiefId: null,
  faceUp: new Set(),
  revealChoices: new Set(),
  identifyChoice: null,
  eliminated: new Set(),
  clues: [],
  clueDeck: [],
  pawSpaces: [],
  player: { x: 3, y: 3 },
  moves: 0,
  fox: 0,
  over: false,
};

let toastTimer = 0;
const boardImage = loadImage(BOARD_IMAGE_URL, () => {
  boardImageReady = true;
  render();
});
const foxImage = loadImage(FOX_IMAGE_URL, () => {
  foxImageReady = true;
  render();
});
const playerImage = loadImage(PLAYER_IMAGE_URL, () => {
  playerImageReady = true;
  render();
});
const suspectBackImage = loadImage(SUSPECT_BACK_IMAGE_URL, () => {
  suspectBackImageReady = true;
  render();
});
const suspectImages = {};
const clueImages = {};
let boardImageReady = false;
let foxImageReady = false;
let playerImageReady = false;
let suspectBackImageReady = false;
let renderQueued = false;
let boardRenderSignature = null;
let diceRenderSignature = null;
let foxTrackRenderSignature = null;
let clueRenderSignature = null;
let suspectRenderSignature = null;
let diceRolling = false;
let diceRollAnimationFrame = 0;
let diceRollStartedAt = 0;
let diceRollLastFrameAt = 0;
let foxMoving = false;
let foxVisualPosition = 0;
let foxMoveAnimationFrame = 0;
let foxMoveStartedAt = 0;
let foxMoveStart = 0;
let foxMoveTarget = 0;
let foxMoveComplete = null;
let identifyResolveTimer = 0;
const scaledImageCache = new Map();

SUSPECT_NAMES.forEach((name) => {
  const entry = { image: null, ready: false };
  entry.image = loadImage(SUSPECT_IMAGE_URLS[name], () => {
    entry.ready = true;
    render();
  });
  suspectImages[name] = entry;
});

CLUE_MARKERS.forEach((clue) => {
  const entry = { image: null, ready: false };
  entry.image = loadImage(clue.image, () => {
    entry.ready = true;
    render();
  });
  clueImages[clue.id] = entry;
});

function loadImage(src, onload) {
  const image = new Image();
  image.onload = onload;
  image.onerror = () => render();
  image.src = src;
  return image;
}

function cacheKeyFor(image, width, height, fit) {
  return `${image.currentSrc || image.src}|${Math.round(width)}x${Math.round(height)}|${fit ? "fit" : "stretch"}`;
}

function scaledImage(image, width, height, fit = false) {
  const key = cacheKeyFor(image, width, height, fit);
  const cached = scaledImageCache.get(key);
  if (cached) return cached;

  let targetWidth = Math.max(1, Math.round(width));
  let targetHeight = Math.max(1, Math.round(height));
  if (fit) {
    const scale = Math.min(width / image.width, height / image.height);
    targetWidth = Math.max(1, Math.round(image.width * scale));
    targetHeight = Math.max(1, Math.round(image.height * scale));
  }

  const buffer = document.createElement("canvas");
  buffer.width = targetWidth;
  buffer.height = targetHeight;
  const bufferCtx = buffer.getContext("2d");
  bufferCtx.imageSmoothingEnabled = true;
  bufferCtx.imageSmoothingQuality = "high";
  bufferCtx.drawImage(image, 0, 0, targetWidth, targetHeight);
  scaledImageCache.set(key, buffer);
  return buffer;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function newGame() {
  cancelDiceRollAnimation();
  cancelFoxMoveAnimation();
  cancelIdentifyResolution();
  state.action = "search";
  state.phase = "choose";
  state.rollsUsed = 0;
  state.dice = emptyDice();
  state.suspects = createSuspects();
  state.thiefId = sample(state.suspects).id;
  state.faceUp = new Set(shuffle(state.suspects).slice(0, 2).map((suspect) => suspect.id));
  state.revealChoices = new Set();
  state.identifyChoice = null;
  state.eliminated = new Set();
  state.clues = [];
  state.clueDeck = shuffle(CLUE_MARKERS);
  state.pawSpaces = CLUE_SLOTS.map((space, index) => ({ ...space, index, clue: null }));
  state.player = { col: 8, row: 8 };
  state.moves = 0;
  state.fox = 0;
  foxVisualPosition = 0;
  state.over = false;
  if (caseDialog.open) caseDialog.close();
  toastMessage("Choose paws to search for clues or eyes to reveal suspects, then roll up to three times.");
  render();
}

function emptyDice() {
  return Array.from({ length: 3 }, () => ({ face: null, locked: false, rolling: false }));
}

function createSuspects() {
  return SUSPECT_DATA.map((suspect, index) => ({
    id: index,
    name: suspect.name,
    coat: COATS[index % COATS.length],
    items: suspect.items,
  }));
}

function setAction(action) {
  if (state.over || foxMoving || state.phase !== "choose") return;
  if (action === "reveal" && !canRevealMoreSuspects()) {
    toastMessage("All revealable suspect cards are already face up.");
    return;
  }
  state.action = action;
  state.dice = emptyDice();
  render();
}

function rollDice() {
  if (state.over || diceRolling || foxMoving || !["choose", "rolling"].includes(state.phase)) return;
  if (state.action === "reveal" && !canRevealMoreSuspects()) {
    setAction("search");
    toastMessage("Eyes are disabled because there are not two hidden suspects left.");
    return;
  }
  state.phase = "rolling";
  state.rollsUsed += 1;

  diceRolling = true;
  diceRollStartedAt = 0;
  diceRollLastFrameAt = 0;
  state.dice = state.dice.map((die) => {
    if (die.locked) return { ...die, rolling: false };
    return { face: sample(DICE_FACES), locked: false, rolling: true };
  });
  toastMessage("Rolling...");
  render();
  diceRollAnimationFrame = window.requestAnimationFrame(animateDiceRoll);
}

function animateDiceRoll(timestamp) {
  if (!diceRolling) return;
  if (!diceRollStartedAt) {
    diceRollStartedAt = timestamp;
    diceRollLastFrameAt = timestamp;
  }

  const elapsed = timestamp - diceRollStartedAt;
  if (timestamp - diceRollLastFrameAt >= DICE_ROLL_FRAME_MS || elapsed >= DICE_ROLL_DURATION) {
    diceRollLastFrameAt = timestamp;
    state.dice = state.dice.map((die) => (die.locked ? die : { face: sample(DICE_FACES), locked: false, rolling: true }));
    render();
  }

  if (elapsed >= DICE_ROLL_DURATION) {
    finishDiceRoll();
    return;
  }

  diceRollAnimationFrame = window.requestAnimationFrame(animateDiceRoll);
}

function finishDiceRoll() {
  diceRolling = false;
  diceRollAnimationFrame = 0;
  state.dice = state.dice.map((die) => {
    if (die.locked) return { ...die, rolling: false };
    const face = sample(DICE_FACES);
    return {
      face,
      locked: faceMatchesAction(face),
      rolling: false,
    };
  });

  if (state.dice.every((die) => die.locked)) {
    resolveSuccessfulRoll();
    return;
  }

  if (state.rollsUsed >= MAX_ROLLS) {
    failRoll();
    return;
  }

  toastMessage(`${MAX_ROLLS - state.rollsUsed} roll${MAX_ROLLS - state.rollsUsed === 1 ? "" : "s"} left. Matching dice stay set aside.`);
  render();
}

function cancelDiceRollAnimation() {
  if (diceRollAnimationFrame) {
    window.cancelAnimationFrame(diceRollAnimationFrame);
  }
  diceRolling = false;
  diceRollAnimationFrame = 0;
  diceRollStartedAt = 0;
  diceRollLastFrameAt = 0;
}

function animateFoxTo(target, onComplete) {
  cancelFoxMoveAnimation();
  foxMoveStart = state.fox;
  foxMoveTarget = Math.min(FOX_LIMIT, Math.max(0, target));
  foxVisualPosition = foxMoveStart;
  foxMoveComplete = onComplete;

  if (foxMoveTarget === foxMoveStart) {
    if (foxMoveComplete) foxMoveComplete();
    foxMoveComplete = null;
    return;
  }

  foxMoving = true;
  foxMoveStartedAt = 0;
  foxMoveAnimationFrame = window.requestAnimationFrame(stepFoxMove);
  render();
}

function stepFoxMove(timestamp) {
  if (!foxMoving) return;
  if (!foxMoveStartedAt) foxMoveStartedAt = timestamp;

  const distance = Math.abs(foxMoveTarget - foxMoveStart);
  const duration = distance * FOX_STEP_DURATION;
  const progress = Math.min(1, (timestamp - foxMoveStartedAt) / duration);
  foxVisualPosition = foxMoveStart + (foxMoveTarget - foxMoveStart) * easeInOut(progress);

  if (progress >= 1) {
    state.fox = foxMoveTarget;
    foxVisualPosition = foxMoveTarget;
    foxMoving = false;
    foxMoveAnimationFrame = 0;
    const onComplete = foxMoveComplete;
    foxMoveComplete = null;
    render();
    if (onComplete) onComplete();
    return;
  }

  render();
  foxMoveAnimationFrame = window.requestAnimationFrame(stepFoxMove);
}

function cancelFoxMoveAnimation() {
  if (foxMoveAnimationFrame) {
    window.cancelAnimationFrame(foxMoveAnimationFrame);
  }
  foxMoving = false;
  foxMoveAnimationFrame = 0;
  foxMoveStartedAt = 0;
  foxMoveComplete = null;
  foxVisualPosition = state.fox;
}

function easeInOut(progress) {
  return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

function faceMatchesAction(face) {
  return face?.type === (state.action === "search" ? "paw" : "eye");
}

function resolveSuccessfulRoll() {
  if (state.action === "search") {
    state.moves = state.dice.reduce((total, die) => total + die.face.count, 0);
    state.phase = "moving";
    toastMessage(`All paws. Move up to ${state.moves} spaces and try to land on a paw print.`);
  } else {
    state.phase = "selectingSuspects";
    state.revealChoices = new Set();
    toastMessage("All eyes. Choose any two face-down suspect cards to reveal.");
  }
  render();
}

function failRoll() {
  const target = Math.min(FOX_LIMIT, state.fox + FOX_FAIL_MOVE);
  state.phase = "choose";
  state.rollsUsed = 0;
  state.moves = 0;
  state.dice = emptyDice();
  toastMessage(`No match by the third roll. The fox moves ${target - state.fox} spaces.`);
  animateFoxTo(target, () => {
    if (state.fox >= FOX_LIMIT) {
      state.over = true;
      showDialog("The fox escaped", `The thief was ${thief().name}. The roll missed, so the fox reached the den.`);
      render();
    }
  });
  render();
}

function moveTo(canvasX, canvasY) {
  if (state.over || foxMoving || state.phase !== "moving" || state.moves < 1) return;
  const cell = cellAtCanvas(canvasX, canvasY);
  if (!cell) return;
  const distance = Math.abs(cell.col - state.player.col) + Math.abs(cell.row - state.player.row);
  if (distance !== 1) {
    toastMessage("Move one square at a time. Click a square next to the detective.");
    return;
  }

  state.player = cell;
  state.moves -= 1;

  if (state.moves === 0) {
    const slot = clueSlotAtCell(cell.col, cell.row);
    if (slot && !slot.clue) {
      drawClue(slot);
      finishTurn("The clue is now revealed in that 2 by 2 square clue slot.");
    } else {
      finishTurn("No moves left.");
    }
  }
  render();
}

function drawClue(paw) {
  if (state.clueDeck.length === 0) {
    toastMessage("No clue markers left in the stack.");
    return;
  }
  const marker = state.clueDeck.shift();
  const item = marker.id;
  const isWorn = thief().items.includes(item);
  const clue = { item, isWorn };
  paw.clue = clue;
  state.clues.push(clue);
  applyKnownClues();
  toastMessage(
    isWorn
      ? `Decoder green: the thief is wearing ${itemLabel(item)}.`
      : `Decoder blank: the thief is not wearing ${itemLabel(item)}.`,
  );
}

function chooseSuspectToReveal(suspectId) {
  if (state.phase !== "selectingSuspects" || state.over) return;
  if (state.faceUp.has(suspectId)) {
    toastMessage("That suspect is already face up. Choose a face-down card.");
    return;
  }

  if (state.revealChoices.has(suspectId)) {
    state.revealChoices.delete(suspectId);
  } else {
    state.revealChoices.add(suspectId);
  }

  if (state.revealChoices.size === 2) {
    state.revealChoices.forEach((id) => state.faceUp.add(id));
    state.revealChoices = new Set();
    applyKnownClues();
    finishTurn("Two selected suspect cards turned face up.");
  } else {
    toastMessage("Choose one more face-down suspect.");
  }
  render();
}

function canRevealMoreSuspects() {
  return state.suspects.filter((suspect) => !state.faceUp.has(suspect.id)).length >= 2;
}

function revealTwoSuspects() {
  const hidden = state.suspects.filter((suspect) => !state.faceUp.has(suspect.id));
  hidden.slice(0, 2).forEach((suspect) => state.faceUp.add(suspect.id));
  applyKnownClues();
}

function applyKnownClues() {
  state.suspects.forEach((suspect) => {
    if (!state.faceUp.has(suspect.id) || state.eliminated.has(suspect.id)) return;
    const impossible = state.clues.some((clue) => {
      const suspectHasItem = suspect.items.includes(clue.item);
      return clue.isWorn ? !suspectHasItem : suspectHasItem;
    });
    if (impossible) state.eliminated.add(suspect.id);
  });
}

function finishTurn(message) {
  state.phase = "choose";
  state.rollsUsed = 0;
  state.moves = 0;
  state.dice = emptyDice();
  if (message) toastMessage(message);
}

function handleSuspectClick(suspectId) {
  if (state.over || foxMoving) return;
  if (state.phase === "selectingSuspects") {
    chooseSuspectToReveal(suspectId);
    return;
  }
  if (state.phase === "identifying") {
    identifySuspect(suspectId);
    return;
  }
  toastMessage("Use Identify the Thief when you are ready to choose a revealed suspect.");
}

function startIdentifying() {
  if (state.over || foxMoving || state.identifyChoice !== null) return;
  if (!state.suspects.some((suspect) => canIdentifySuspect(suspect.id))) {
    toastMessage("Reveal at least one valid suspect before identifying the thief.");
    return;
  }
  state.phase = "identifying";
  state.rollsUsed = 0;
  state.moves = 0;
  state.dice = emptyDice();
  state.identifyChoice = null;
  toastMessage("Choose one revealed suspect to identify as the thief.");
  render();
}

function identifySuspect(suspectId) {
  if (state.over || foxMoving || state.identifyChoice !== null) return;
  if (!state.faceUp.has(suspectId)) {
    toastMessage("Choose a revealed suspect.");
    return;
  }
  if (state.eliminated.has(suspectId)) {
    toastMessage("That suspect has already been cleared by the clues.");
    return;
  }

  state.identifyChoice = suspectId;
  toastMessage("Identifying the thief...");
  render();
  identifyResolveTimer = window.setTimeout(() => resolveIdentifyChoice(suspectId), IDENTIFY_REVEAL_DELAY);
}

function resolveIdentifyChoice(suspectId) {
  identifyResolveTimer = 0;
  const suspect = state.suspects.find((entry) => entry.id === suspectId);
  if (suspectId === state.thiefId) {
    state.over = true;
    showDialog("Case closed", `${suspect.name} had the missing pie. You caught the thief before the fox reached the den.`);
  } else {
    animateFoxTo(FOX_LIMIT, () => {
      state.over = true;
      showDialog("Outfoxed", `${suspect.name} was innocent. The real thief was ${thief().name}, and the fox dashed to the den.`);
      render();
    });
  }
  render();
}

function cancelIdentifyResolution() {
  if (identifyResolveTimer) {
    window.clearTimeout(identifyResolveTimer);
  }
  identifyResolveTimer = 0;
}

function canIdentifySuspect(suspectId) {
  return state.faceUp.has(suspectId) && !state.eliminated.has(suspectId);
}

function thief() {
  return state.suspects.find((suspect) => suspect.id === state.thiefId);
}

function pawAt(x, y) {
  return state.pawSpaces.find((space) => space.x === x && space.y === y);
}

function itemLabel(item) {
  return CLUE_BY_ID[item]?.label || item;
}

function traitSummary(suspect) {
  return suspect.items.map(itemLabel).join(", ");
}

function render() {
  if (renderQueued) return;
  renderQueued = true;
  window.requestAnimationFrame(() => {
    renderQueued = false;
    renderNow();
  });
}

function renderNow() {
  renderBoard();
  renderControls();
  renderFoxTrack();
  renderClues();
  renderSuspects();
}

function renderControls() {
  const isRolling = ["choose", "rolling"].includes(state.phase);
  if (state.action === "reveal" && !canRevealMoreSuspects()) {
    state.action = "search";
  }

  rollButton.disabled = state.over || diceRolling || foxMoving || !isRolling;
  rollButton.textContent = diceRolling ? "Rolling..." : state.rollsUsed === 0 ? "Roll" : "Roll again";
  identifyButton.disabled = state.over || diceRolling || foxMoving || state.identifyChoice !== null || state.phase === "selectingSuspects";
  searchModeButton.disabled = state.over || foxMoving || state.phase !== "choose";
  revealModeButton.disabled = state.over || foxMoving || state.phase !== "choose" || !canRevealMoreSuspects();
  searchModeButton.classList.toggle("active", state.action === "search");
  revealModeButton.classList.toggle("active", state.action === "reveal");

  if (state.phase === "moving") {
    movesLabel.textContent = `${state.moves} move${state.moves === 1 ? "" : "s"} left`;
  } else if (state.phase === "selectingSuspects") {
    movesLabel.textContent = `${state.revealChoices.size} / 2 chosen`;
  } else if (foxMoving) {
    movesLabel.textContent = "Fox moving";
  } else if (state.phase === "identifying" && state.identifyChoice !== null) {
    movesLabel.textContent = "Identifying";
  } else if (state.phase === "identifying") {
    movesLabel.textContent = "Choose suspect";
  } else if (state.phase === "rolling") {
    movesLabel.textContent = diceRolling ? "Dice rolling" : `Roll ${state.rollsUsed} / ${MAX_ROLLS}`;
  } else {
    movesLabel.textContent = state.action === "search" ? "Search for clues" : "Reveal suspects";
  }

  phaseLabel.textContent = state.over
    ? "Closed"
    : foxMoving
      ? "Fox"
    : state.phase === "moving"
      ? "Move"
      : state.phase === "selectingSuspects"
        ? "Reveal"
        : state.phase === "identifying"
          ? "Identify"
          : "Ready";
  foxLabel.textContent = `${visibleFoxStep()} / ${FOX_LIMIT}`;
  renderDice();
}

function renderDice() {
  const signature = state.dice.map((die) => `${die.face?.image || "?"}:${die.locked ? "1" : "0"}:${die.rolling ? "1" : "0"}`).join("|");
  if (signature === diceRenderSignature) return;
  diceRenderSignature = signature;
  diceRow.innerHTML = "";
  state.dice.forEach((die) => {
    const element = document.createElement("span");
    const faceType = die.face?.type || "";
    element.className = `die ${faceType}${die.locked ? " locked" : ""}${die.rolling ? " rolling" : ""}`;
    if (die.face?.image) {
      const image = document.createElement("img");
      image.src = die.face.image;
      image.alt = die.face.label;
      element.appendChild(image);
    } else {
      element.textContent = "?";
    }
    diceRow.appendChild(element);
  });
}

function renderFoxTrack() {
  const foxStep = visibleFoxStep();
  const signature = `${foxStep}:${FOX_LIMIT}`;
  if (signature === foxTrackRenderSignature) return;
  foxTrackRenderSignature = signature;
  foxTrack.innerHTML = "";
  for (let index = 0; index <= FOX_LIMIT; index += 1) {
    const step = document.createElement("span");
    step.className = "track-step";
    if (index <= foxStep) step.classList.add("active");
    if (index === foxStep) step.classList.add("fox");
    foxTrack.appendChild(step);
  }
}

function renderClues() {
  const signature = state.clues.map((clue) => `${clue.item}:${clue.isWorn ? "1" : "0"}`).join("|");
  if (signature === clueRenderSignature) return;
  clueRenderSignature = signature;
  clueCount.textContent = `${state.clues.length} found`;
  clueList.innerHTML = "";
  if (state.clues.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No clue markers decoded yet.";
    clueList.appendChild(empty);
    return;
  }

  state.clues.forEach((clue) => {
    const item = document.createElement("li");
    item.textContent = clue.isWorn
      ? `Green: thief wears ${itemLabel(clue.item)}.`
      : `Blank: thief does not wear ${itemLabel(clue.item)}.`;
    clueList.appendChild(item);
  });
}

function renderSuspects() {
  const suspectMode = state.phase === "identifying" ? "identifying" : state.phase === "selectingSuspects" ? "selectingSuspects" : "normal";
  const signature = [
    suspectMode,
    [...state.faceUp].sort((a, b) => a - b).join(","),
    [...state.eliminated].sort((a, b) => a - b).join(","),
    [...state.revealChoices].sort((a, b) => a - b).join(","),
    state.identifyChoice ?? "",
  ].join("|");
  if (signature === suspectRenderSignature) return;
  suspectRenderSignature = signature;

  const activeCount = state.suspects.filter((suspect) => state.faceUp.has(suspect.id) && !state.eliminated.has(suspect.id)).length;
  const hiddenCount = state.suspects.filter((suspect) => !state.faceUp.has(suspect.id)).length;
  suspectCount.textContent = `${activeCount} active, ${hiddenCount} hidden`;
  suspectGrid.innerHTML = "";

  state.suspects.forEach((suspect) => {
    const isFaceUp = state.faceUp.has(suspect.id);
    const isCleared = state.eliminated.has(suspect.id);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "suspect";
    if (!isFaceUp) card.classList.add("hidden");
    if (isCleared) card.classList.add("eliminated");
    if (state.revealChoices.has(suspect.id)) card.classList.add("prime");
    if (state.identifyChoice === suspect.id) card.classList.add("identify-choice");
    card.title = suspectMode === "identifying" && canIdentifySuspect(suspect.id) ? "Identify" : isCleared ? "Cleared" : isFaceUp ? "Revealed" : "Face down";
    card.innerHTML = `
      <span class="portrait">${portraitFor(suspect, isFaceUp)}</span>
      <span class="suspect-name">${isFaceUp ? suspect.name : "Face down"}</span>
      <span class="suspect-traits">${isFaceUp ? traitSummary(suspect) : "suspect card"}</span>
    `;
    card.addEventListener("click", () => handleSuspectClick(suspect.id));
    suspectGrid.appendChild(card);
  });
}

function portraitFor(suspect, isFaceUp) {
  if (!isFaceUp) {
    return `<img src="${SUSPECT_BACK_IMAGE_URL}" alt="" />`;
  }
  return `<img src="${SUSPECT_IMAGE_URLS[suspect.name]}" alt="" />`;
}

function renderBoard() {
  const boardMode = state.phase === "moving" ? `moving:${state.moves}` : "static";
  const signature = [
    boardMode,
    `${state.player.col},${state.player.row}`,
    state.fox,
    foxMoving ? foxVisualPosition.toFixed(3) : "",
    [...state.faceUp].sort((a, b) => a - b).join(","),
    [...state.eliminated].sort((a, b) => a - b).join(","),
    [...state.revealChoices].sort((a, b) => a - b).join(","),
    state.identifyChoice ?? "",
    state.pawSpaces.map((space) => `${space.index}:${space.clue?.item || ""}:${space.clue?.isWorn ? "1" : "0"}`).join(","),
    boardImageReady ? "board" : "",
    foxImageReady ? "fox" : "",
    playerImageReady ? "player" : "",
    suspectBackImageReady ? "back" : "",
    SUSPECT_NAMES.filter((name) => suspectImages[name]?.ready).join(","),
    CLUE_MARKERS.filter((clue) => clueImages[clue.id]?.ready).map((clue) => clue.id).join(","),
  ].join("|");
  if (signature === boardRenderSignature) return;
  boardRenderSignature = signature;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTableBackground();
  drawBoardBackground();
  drawSuspectCardsAroundBoard();
  drawFoxPath();
  drawClueSlots();
  drawClueHintRings();
  drawFoxToken();
  drawPlayer();
}

function drawTableBackground() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#ead8b2");
  gradient.addColorStop(0.48, "#c6d7bd");
  gradient.addColorStop(1, "#e7c379");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBoardBackground() {
  ctx.save();
  if (boardImageReady) {
    ctx.drawImage(scaledImage(boardImage, BOARD_RECT.width, BOARD_RECT.height), BOARD_RECT.x, BOARD_RECT.y);
  } else {
    ctx.fillStyle = "#789f71";
    ctx.fillRect(BOARD_RECT.x, BOARD_RECT.y, BOARD_RECT.width, BOARD_RECT.height);
  }

  ctx.strokeStyle = "rgba(34, 39, 42, 0.68)";
  ctx.lineWidth = 4;
  roundedRect(BOARD_RECT.x, BOARD_RECT.y, BOARD_RECT.width, BOARD_RECT.height, 8);
  ctx.stroke();
  ctx.restore();
}

function drawSuspectCardsAroundBoard() {
  state.suspects.forEach((suspect, index) => {
    const slot = suspectCardSlot(index);
    const isFaceUp = state.faceUp.has(suspect.id);
    const isCleared = state.eliminated.has(suspect.id);
    ctx.save();
    ctx.shadowColor = "rgba(37, 43, 34, 0.22)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    roundedRect(slot.x, slot.y, slot.width, slot.height, 8);
    ctx.fillStyle = "#fffaf0";
    ctx.fill();
    ctx.clip();

    if (isFaceUp && suspectImages[suspect.name]?.ready) {
      ctx.drawImage(scaledImage(suspectImages[suspect.name].image, slot.width, slot.height), slot.x, slot.y);
    } else if (!isFaceUp && suspectBackImageReady) {
      ctx.drawImage(scaledImage(suspectBackImage, slot.width, slot.height), slot.x, slot.y);
    } else {
      ctx.fillStyle = "#2f74a3";
      ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
      ctx.strokeStyle = "rgba(255, 250, 240, 0.36)";
      ctx.lineWidth = 2;
      for (let stripe = -slot.height; stripe < slot.width; stripe += 18) {
        ctx.beginPath();
        ctx.moveTo(slot.x + stripe, slot.y + slot.height);
        ctx.lineTo(slot.x + stripe + slot.height, slot.y);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255, 250, 240, 0.9)";
      ctx.beginPath();
      ctx.arc(slot.x + slot.width / 2, slot.y + slot.height * 0.42, slot.width * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#263127";
      ctx.font = "900 34px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("?", slot.x + slot.width / 2, slot.y + slot.height * 0.42);
      ctx.font = "800 11px system-ui";
      ctx.fillStyle = "#fffaf0";
      ctx.fillText("FACE DOWN", slot.x + slot.width / 2, slot.y + slot.height - 18);
    }

    ctx.restore();

    if (isCleared) {
      ctx.save();
      ctx.fillStyle = "rgba(145, 44, 49, 0.5)";
      roundedRect(slot.x, slot.y, slot.width, slot.height, 8);
      ctx.fill();
      ctx.strokeStyle = "#fffaf0";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(slot.x + 18, slot.y + 18);
      ctx.lineTo(slot.x + slot.width - 18, slot.y + slot.height - 18);
      ctx.moveTo(slot.x + slot.width - 18, slot.y + 18);
      ctx.lineTo(slot.x + 18, slot.y + slot.height - 18);
      ctx.stroke();
      ctx.restore();
    }

    if (state.revealChoices.has(suspect.id)) {
      ctx.save();
      ctx.strokeStyle = "#2f74a3";
      ctx.lineWidth = 7;
      roundedRect(slot.x - 5, slot.y - 5, slot.width + 10, slot.height + 10, 12);
      ctx.stroke();
      ctx.restore();
    }

    if (state.identifyChoice === suspect.id) {
      ctx.save();
      ctx.strokeStyle = "#d95d2b";
      ctx.lineWidth = 7;
      roundedRect(slot.x - 5, slot.y - 5, slot.width + 10, slot.height + 10, 12);
      ctx.stroke();
      ctx.restore();
    }

    if (isFaceUp && !isCleared) {
      ctx.save();
      ctx.strokeStyle = "#f0c35b";
      ctx.lineWidth = 4;
      roundedRect(slot.x - 2, slot.y - 2, slot.width + 4, slot.height + 4, 10);
      ctx.stroke();
      ctx.restore();
    }
  });
}

function drawClueSlots() {
  state.pawSpaces.forEach((space) => {
    const rect = clueSlotRect(space);
    const drawSize = Math.min(rect.width, rect.height);
    const drawX = rect.x + (rect.width - drawSize) / 2;
    const drawY = rect.y + (rect.height - drawSize) / 2;
    ctx.save();
    ctx.shadowColor = "rgba(20, 30, 25, 0.22)";
    ctx.shadowBlur = 9;
    ctx.shadowOffsetY = 3;
    if (space.clue) {
      const clueImage = clueImages[space.clue.item];
      ctx.fillStyle = "#fffaf0";
      roundedRect(drawX, drawY, drawSize, drawSize, 8);
      ctx.fill();
      if (clueImage?.ready) {
        ctx.drawImage(scaledImage(clueImage.image, drawSize, drawSize), drawX, drawY);
      } else {
        ctx.fillStyle = "#263127";
        ctx.font = `800 ${Math.max(10, drawSize * 0.14)}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(itemLabel(space.clue.item), drawX + drawSize / 2, drawY + drawSize / 2, drawSize * 0.82);
      }
    } else {
      ctx.fillStyle = "#fffaf0";
      ctx.beginPath();
      ctx.arc(drawX + drawSize / 2, drawY + drawSize / 2, drawSize * 0.44, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#64a83b";
      ctx.beginPath();
      ctx.arc(drawX + drawSize / 2, drawY + drawSize * 0.56, drawSize * 0.17, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 4; i += 1) {
        const angle = -Math.PI * 0.72 + i * Math.PI * 0.48;
        ctx.beginPath();
        ctx.arc(drawX + drawSize / 2 + Math.cos(angle) * drawSize * 0.2, drawY + drawSize * 0.34 + Math.sin(angle) * drawSize * 0.08, drawSize * 0.08, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = space.clue ? (space.clue.isWorn ? "#178f46" : "#bd2f35") : "rgba(38, 49, 39, 0.58)";
    ctx.lineWidth = space.clue ? 7 : 3;
    clueSlotCells(space).forEach((cell) => {
      const cellBounds = cellRect(cell.col, cell.row);
      roundedRect(cellBounds.x, cellBounds.y, cellBounds.width, cellBounds.height, 4);
      ctx.stroke();
    });
    ctx.restore();
  });
}

function drawClueHintRings() {
  if (state.moves < 1 || state.phase !== "moving") return;
  adjacentCells().forEach((cell) => {
    const rect = cellRect(cell.col, cell.row);
    ctx.save();
    ctx.fillStyle = "rgba(255, 250, 240, 0.24)";
    ctx.strokeStyle = "rgba(255, 250, 240, 0.95)";
    ctx.lineWidth = 3;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.restore();
  });
  state.pawSpaces.forEach((space) => {
    if (space.clue) return;
    ctx.save();
    ctx.strokeStyle = "rgba(255, 250, 240, 0.95)";
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    clueSlotCells(space).forEach((cell) => {
      const rect = cellRect(cell.col, cell.row);
      roundedRect(rect.x + 2, rect.y + 2, rect.width - 4, rect.height - 4, 6);
      ctx.stroke();
    });
    ctx.restore();
  });
}

function drawFoxPath() {
  ctx.save();
  ctx.strokeStyle = "rgba(217, 93, 43, 0.42)";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  FOX_PATH.forEach(([row, col], index) => {
    const point = cellCenter(col, row);
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
  const foxStep = visibleFoxStep();
  FOX_PATH.forEach(([row, col], index) => {
    const point = cellCenter(col, row);
    ctx.fillStyle = index <= foxStep ? "rgba(217, 93, 43, 0.85)" : "rgba(255, 250, 240, 0.72)";
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(4, cellSize() * 0.13), 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function visibleFoxStep() {
  return Math.min(FOX_LIMIT, Math.max(0, Math.floor(foxVisualPosition)));
}

function foxPoint() {
  const position = Math.min(FOX_LIMIT, Math.max(0, foxVisualPosition));
  const fromIndex = Math.floor(position);
  const toIndex = Math.min(FOX_LIMIT, fromIndex + 1);
  const amount = position - fromIndex;
  const [fromRow, fromCol] = FOX_PATH[fromIndex];
  const [toRow, toCol] = FOX_PATH[toIndex];
  const from = cellCenter(fromCol, fromRow);
  const to = cellCenter(toCol, toRow);
  return {
    x: from.x + (to.x - from.x) * amount,
    y: from.y + (to.y - from.y) * amount,
  };
}

function drawFoxToken() {
  const point = foxPoint();
  if (foxImageReady) {
    ctx.save();
    ctx.shadowColor = "rgba(35, 22, 14, 0.35)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    drawImageCentered(foxImage, point.x, point.y, cellSize() * 1.35, cellSize() * 1.35);
    ctx.restore();
    return;
  }

  const size = cellSize() * 0.82;
  ctx.save();
  ctx.shadowColor = "rgba(35, 22, 14, 0.35)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = "#d95d2b";
  ctx.beginPath();
  ctx.moveTo(point.x - size * 0.44, point.y + size * 0.12);
  ctx.quadraticCurveTo(point.x - size * 0.32, point.y - size * 0.4, point.x, point.y - size * 0.16);
  ctx.quadraticCurveTo(point.x + size * 0.32, point.y - size * 0.4, point.x + size * 0.44, point.y + size * 0.12);
  ctx.quadraticCurveTo(point.x + size * 0.24, point.y + size * 0.42, point.x, point.y + size * 0.36);
  ctx.quadraticCurveTo(point.x - size * 0.24, point.y + size * 0.42, point.x - size * 0.44, point.y + size * 0.12);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#fff2dc";
  ctx.beginPath();
  ctx.moveTo(point.x - size * 0.18, point.y + size * 0.08);
  ctx.lineTo(point.x, point.y + size * 0.31);
  ctx.lineTo(point.x + size * 0.18, point.y + size * 0.08);
  ctx.fill();
  ctx.fillStyle = "#241d18";
  ctx.beginPath();
  ctx.arc(point.x - size * 0.13, point.y + size * 0.04, size * 0.04, 0, Math.PI * 2);
  ctx.arc(point.x + size * 0.13, point.y + size * 0.04, size * 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPlayer() {
  const point = playerPoint();
  if (playerImageReady) {
    ctx.save();
    ctx.shadowColor = "rgba(20, 30, 25, 0.28)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    drawImageCentered(playerImage, point.x, point.y + 5, cellSize() * 1.02, cellSize() * 1.02);
    ctx.restore();
    return;
  }

  const size = cellSize() * 1.25;
  ctx.save();
  ctx.shadowColor = "rgba(20, 30, 25, 0.28)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = "#fffaf0";
  ctx.beginPath();
  ctx.arc(point.x, point.y, size * 0.29, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "#2f74a3";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = "#2f74a3";
  roundedRect(point.x - size * 0.16, point.y - size * 0.06, size * 0.32, size * 0.1, 4);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(point.x, point.y - size * 0.05, size * 0.1, Math.PI, 0);
  ctx.fill();
  ctx.restore();
}

function drawImageCentered(image, centerX, centerY, maxWidth, maxHeight) {
  const imageBuffer = scaledImage(image, maxWidth, maxHeight, true);
  ctx.drawImage(imageBuffer, centerX - imageBuffer.width / 2, centerY - imageBuffer.height / 2);
}

function roundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function boardClick(event) {
  const point = canvasPointFromEvent(event);
  if (!point) return;
  const { x, y } = point;
  const suspect = suspectAtCanvas(x, y);
  if (suspect) {
    handleSuspectClick(suspect.id);
    return;
  }
  moveTo(x, y);
}

function canvasPointFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const canvasRatio = canvas.width / canvas.height;
  const rectRatio = rect.width / rect.height;
  let renderWidth = rect.width;
  let renderHeight = rect.height;
  let offsetX = 0;
  let offsetY = 0;

  if (rectRatio > canvasRatio) {
    renderWidth = rect.height * canvasRatio;
    offsetX = (rect.width - renderWidth) / 2;
  } else if (rectRatio < canvasRatio) {
    renderHeight = rect.width / canvasRatio;
    offsetY = (rect.height - renderHeight) / 2;
  }

  const localX = event.clientX - rect.left - offsetX;
  const localY = event.clientY - rect.top - offsetY;
  if (localX < 0 || localY < 0 || localX > renderWidth || localY > renderHeight) {
    return null;
  }

  return {
    x: (localX / renderWidth) * canvas.width,
    y: (localY / renderHeight) * canvas.height,
  };
}

function playerPoint() {
  const rect = cellRect(state.player.col, state.player.row);
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

function cellSize() {
  return BOARD_RECT.width / BOARD_SIZE;
}

function cellRect(col, row) {
  const size = cellSize();
  return {
    x: BOARD_RECT.x + col * size,
    y: BOARD_RECT.y + row * size,
    width: size,
    height: size,
  };
}

function cellCenter(col, row) {
  const rect = cellRect(col, row);
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

function clueSlotRect(slot) {
  const size = cellSize();
  const cells = clueSlotCells(slot);
  const minCol = Math.min(...cells.map((cell) => cell.col));
  const maxCol = Math.max(...cells.map((cell) => cell.col));
  const minRow = Math.min(...cells.map((cell) => cell.row));
  const maxRow = Math.max(...cells.map((cell) => cell.row));
  return {
    x: BOARD_RECT.x + minCol * size,
    y: BOARD_RECT.y + minRow * size,
    width: (maxCol - minCol + 1) * size,
    height: (maxRow - minRow + 1) * size,
  };
}

function clueSlotCells(slot) {
  return slot.cells.map(([row, col]) => ({ row, col }));
}

function cellAtCanvas(x, y) {
  if (x < BOARD_RECT.x || y < BOARD_RECT.y || x > BOARD_RECT.x + BOARD_RECT.width || y > BOARD_RECT.y + BOARD_RECT.height) {
    return null;
  }
  return {
    col: Math.min(BOARD_SIZE - 1, Math.max(0, Math.floor((x - BOARD_RECT.x) / cellSize()))),
    row: Math.min(BOARD_SIZE - 1, Math.max(0, Math.floor((y - BOARD_RECT.y) / cellSize()))),
  };
}

function clueSlotAtCell(col, row) {
  return state.pawSpaces.find((slot) => clueSlotCells(slot).some((cell) => cell.col === col && cell.row === row));
}

function adjacentCells() {
  return [
    { col: state.player.col, row: state.player.row - 1 },
    { col: state.player.col + 1, row: state.player.row },
    { col: state.player.col, row: state.player.row + 1 },
    { col: state.player.col - 1, row: state.player.row },
  ].filter((cell) => cell.col >= 0 && cell.row >= 0 && cell.col < BOARD_SIZE && cell.row < BOARD_SIZE);
}

function suspectAtCanvas(x, y) {
  return state.suspects.find((suspect, index) => {
    const slot = suspectCardSlot(index);
    return x >= slot.x && x <= slot.x + slot.width && y >= slot.y && y <= slot.y + slot.height;
  });
}

function suspectCardSlot(index) {
  const gap = 16;
  const w = SUSPECT_CARD.width;
  const h = SUSPECT_CARD.height;
  const boardGap = 14;
  const topStart = BOARD_RECT.x + (BOARD_RECT.width - (w * 4 + gap * 3)) / 2;
  const sideStart = BOARD_RECT.y + (BOARD_RECT.height - (h * 4 + gap * 3)) / 2;
  if (index < 4) {
    return { x: topStart + index * (w + gap), y: BOARD_RECT.y - h - boardGap, width: w, height: h };
  }
  if (index < 8) {
    return { x: BOARD_RECT.x + BOARD_RECT.width + boardGap, y: sideStart + (index - 4) * (h + gap), width: w, height: h };
  }
  if (index < 12) {
    return { x: topStart + (11 - index) * (w + gap), y: BOARD_RECT.y + BOARD_RECT.height + boardGap, width: w, height: h };
  }
  return { x: BOARD_RECT.x - w - boardGap, y: sideStart + (15 - index) * (h + gap), width: w, height: h };
}

function toastMessage(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3600);
}

function showDialog(title, text) {
  dialogTitle.textContent = title;
  dialogText.textContent = text;
  caseDialog.showModal();
}

rollButton.addEventListener("click", rollDice);
searchModeButton.addEventListener("click", () => setAction("search"));
revealModeButton.addEventListener("click", () => setAction("reveal"));
newGameButton.addEventListener("click", newGame);
identifyButton.addEventListener("click", startIdentifying);
dialogButton.addEventListener("click", newGame);
canvas.addEventListener("click", boardClick);

newGame();
