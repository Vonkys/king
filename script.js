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

function initBoard() {
  board = [];
  for (let y = 0; y < SIZE; y++) {
    let row = [];
    for (let x = 0; x < SIZE; x++) {
      // 13% zamčených, 11% vyšší level (1–3), 29% základ, zbytek prázdné
      if (Math.random() < 0.13) {
        // Zamčené pole má hodnotu: { locked: true, value: čísloLevelu }
        let lvl = Math.random() < 0.5 ? 0 : 1 + Math.floor(Math.random() * 3);
        row.push({ locked: true, value: lvl });
      } else if (Math.random() < 0.11) {
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

      // Zamčené pole – emoji + lock přes něj
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

      } else if (val !== null) {
        // Normální políčko s emoji
        const emojiDiv = document.createElement('span');
        emojiDiv.className = "emoji";
        emojiDiv.style.color = "";
        emojiDiv.textContent = LEVELS[val].emoji;
        emojiDiv.style.opacity = 1;
        emojiDiv.style.filter = "none";
        cell.appendChild(emojiDiv);
      }

      // Výběr pro merge
      if (
        selected &&
        selected.x === x &&
        selected.y === y &&
        !(val && typeof val === "object" && val.locked)
      ) {
        cell.classList.add('selected');
      }

      cell.onclick = () => {
        // Pokud zamčené, nelze vybrat
        if (val && typeof val === "object" && val.locked) return;
        if (selected) {
          // Pokud merge – musí být stejné číslo (ne objekt) a ne zamčené
          const selVal = board[selected.y][selected.x];
          if (
            (selected.x !== x || selected.y !== y) &&
            typeof selVal === "number" &&
            typeof val === "number" &&
            selVal === val
          ) {
            // Merge!
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