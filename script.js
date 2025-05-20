const LEVELS = [
  { emoji: "🌱", name: "Tráva" },
  { emoji: "🌷", name: "Květina" },
  { emoji: "🌳", name: "Strom" },
  { emoji: "🏡", name: "Domek" },
  { emoji: "🏰", name: "Hrad" },
  { emoji: "👑", name: "Král" },
  { emoji: "💎", name: "Drahokam" }
];

const SIZE = 7; // 7x7 pole

let board = [];
let selected = null;

// Vzorec pro zamčené: 1×level 1, 2×level 2, 3×level 3, atd.
function generateLockedItems() {
  let lockedItems = [];
  for (let lvl = 0; lvl < 4; lvl++) { // úrovně 0–3
    for (let count = 0; count <= lvl; count++) {
      lockedItems.push(lvl);
    }
  }
  return lockedItems.sort(() => Math.random() - 0.5); // promíchat
}

function initBoard() {
  board = [];
  const lockedItems = generateLockedItems();
  let lockedPlaced = 0;
  for (let y = 0; y < SIZE; y++) {
    let row = [];
    for (let x = 0; x < SIZE; x++) {
      if (lockedPlaced < lockedItems.length && Math.random() < 0.12) {
        row.push({ locked: true, value: lockedItems[lockedPlaced++] });
      } else if (Math.random() < 0.13) {
        row.push(1 + Math.floor(Math.random() * 3));
      } else if (Math.random() < 0.29) {
        row.push(0);
      } else {
        row.push(null);
      }
    }
    board.push(row);
  }
}

function hasUnlocked(val) {
  // Vrací true pokud je na desce aspoň jeden odemčený stejného levelu
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (typeof board[y][x] === "number" && board[y][x] === val) {
        return true;
      }
    }
  }
  return false;
}

function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`;
  boardEl.style.gridTemplateRows = `repeat(${SIZE}, 1fr)`;
  boardEl.innerHTML = '';
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.x = x;
      cell.dataset.y = y;
      let val = board[y][x];

      if (val && typeof val === "object" && val.locked) {
        cell.classList.add('locked');
        const emojiDiv = document.createElement('span');
        emojiDiv.className = "emoji";
        emojiDiv.textContent = LEVELS[val.value].emoji;
        cell.appendChild(emojiDiv);

        const lockDiv = document.createElement('span');
        lockDiv.className = "lock";
        lockDiv.textContent = "🔒";
        cell.appendChild(lockDiv);

        // Aktivní k odemčení? (tj. stejný odemčený někde na desce)
        if (hasUnlocked(val.value)) {
          cell.classList.add('can-unlock');
          cell.title = "Můžeš odemknout (máš stejného na desce)";
        } else {
          cell.title = "Najdi odemčený stejný předmět";
        }
      } else if (val !== null) {
        const emojiDiv = document.createElement('span');
        emojiDiv.className = "emoji";
        emojiDiv.textContent = LEVELS[val].emoji;
        cell.appendChild(emojiDiv);
      }

      if (
        selected &&
        selected.x === x &&
        selected.y === y &&
        !(val && typeof val === "object" && val.locked)
      ) {
        cell.classList.add('selected');
      }

      cell.onclick = () => {
        // Zamčené – lze odemknout pouze, když máš stejný odemčený
        if (val && typeof val === "object" && val.locked) {
          if (hasUnlocked(val.value)) {
            // Odemknout! (změní se na svůj level)
            board[y][x] = val.value;
            renderBoard();
          }
          return;
        }
        // Jinak normální merge tap-tap
        if (selected) {
          const selVal = board[selected.y][selected.x];
          if (
            (selected.x !== x || selected.y !== y) &&
            typeof selVal === "number" &&
            typeof val === "number" &&
            selVal === val
          ) {
            board[y][x] = Math.min(val + 1, LEVELS.length - 1);
            board[selected.y][selected.x] = null;
          }
          selected = null;
          renderBoard();
        } else if (typeof val === "number") {
          selected = { x, y };
          renderBoard();
        }
      };
      boardEl.appendChild(cell);
    }
  }
}

initBoard();
renderBoard();