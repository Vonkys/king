const LEVELS = [
  { emoji: "🌱", name: "Tráva" },
  { emoji: "🌳", name: "Strom" },
  { emoji: "🏡", name: "Domek" },
  { emoji: "🏰", name: "Hrad" },
  { emoji: "👑", name: "Král" }
];

const SIZE = 6; // 6x6 pole
let board = [];
let selected = null;

function initBoard() {
  board = [];
  for (let y = 0; y < SIZE; y++) {
    let row = [];
    for (let x = 0; x < SIZE; x++) {
      row.push(Math.random() < 0.3 ? 0 : null);
    }
    board.push(row);
  }
}

function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.x = x;
      cell.dataset.y = y;
      let val = board[y][x];
      cell.textContent = val !== null ? LEVELS[val].emoji : '';
      // Zvýraznění vybraného pole
      if (selected && selected.x === x && selected.y === y) {
        cell.style.background = "#aff";
      }
      cell.onclick = () => {
        if (selected) {
          // Pokud je už vybráno a klikneš na jiné místo se stejnou hodnotou
          if (
            (selected.x !== x || selected.y !== y) &&
            board[selected.y][selected.x] !== null &&
            board[selected.y][selected.x] === board[y][x]
          ) {
            // Merge: zvýší level na cílovém poli, původní smaže
            board[y][x] = Math.min(board[y][x] + 1, LEVELS.length - 1);
            board[selected.y][selected.x] = null;
          }
          selected = null;
          renderBoard();
        } else if (board[y][x] !== null) {
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