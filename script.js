const LEVELS = [
  { emoji: "🌱", name: "Tráva" },
  { emoji: "🌷", name: "Květina" },
  { emoji: "🌳", name: "Strom" },
  { emoji: "🏡", name: "Domek" },
  { emoji: "🏰", name: "Hrad" },
  { emoji: "👑", name: "Král" },
  { emoji: "💎", name: "Drahokam" }
];

const SIZE = 8; // 8x8 pole (lze zvětšit)

let board = [];
let selected = null;
let lockedTiles = [];

function initBoard() {
  board = [];
  lockedTiles = [];
  for (let y = 0; y < SIZE; y++) {
    let row = [];
    for (let x = 0; x < SIZE; x++) {
      // Generování zamčených polí (cca 10% pole)
      if (Math.random() < 0.1) {
        row.push("locked");
        lockedTiles.push({x, y});
      } else if (Math.random() < 0.12) {
        // S 12% šance vygeneruj vyšší level (náhodný 1–3)
        row.push(1 + Math.floor(Math.random() * 3));
      } else if (Math.random() < 0.27) {
        // Jinak většinou základní level
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
  // Responzivně uprav grid podle SIZE
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
      if (val === "locked") {
        cell.classList.add('locked');
        cell.innerHTML = '🔒';
      } else if (val !== null) {
        cell.textContent = LEVELS[val].emoji;
      }
      if (selected && selected.x === x && selected.y === y) {
        cell.classList.add('selected');
      }
      cell.onclick = () => {
        if (val === "locked") return; // Nelze kliknout na zamčené pole
        if (selected) {
          if (
            (selected.x !== x || selected.y !== y) &&
            board[selected.y][selected.x] !== null &&
            board[selected.y][selected.x] === board[y][x] &&
            val !== "locked"
          ) {
            // Merge!
            board[y][x] = Math.min(board[y][x] + 1, LEVELS.length - 1);
            board[selected.y][selected.x] = null;
          }
          selected = null;
          renderBoard();
        } else if (val !== null) {
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