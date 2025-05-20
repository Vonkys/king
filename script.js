const LEVELS = [
  { emoji: "🌱", name: "Tráva" },
  { emoji: "🌳", name: "Strom" },
  { emoji: "🏡", name: "Domek" },
  { emoji: "🏰", name: "Hrad" },
  { emoji: "👑", name: "Král" }
];

const SIZE = 6; // 6x6 pole
let board = [];
let dragging = null;

function initBoard() {
  board = [];
  for (let y = 0; y < SIZE; y++) {
    let row = [];
    for (let x = 0; x < SIZE; x++) {
      // Náhodně rozdej základní objekty
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
      // Drag and drop
      if (val !== null) {
        cell.draggable = true;
        cell.ondragstart = e => {
          dragging = { x, y, val };
          setTimeout(() => cell.classList.add('dragged'), 1);
        };
        cell.ondragend = e => {
          dragging = null;
          cell.classList.remove('dragged');
        };
      }
      cell.ondragover = e => {
        e.preventDefault();
        cell.classList.add('dragover');
      };
      cell.ondragleave = e => cell.classList.remove('dragover');
      cell.ondrop = e => {
        cell.classList.remove('dragover');
        if (!dragging) return;
        if ((dragging.x !== x || dragging.y !== y) && board[y][x] === dragging.val) {
          // Merge!
          board[y][x] = Math.min(dragging.val + 1, LEVELS.length - 1);
          board[dragging.y][dragging.x] = null;
        }
        renderBoard();
      };
      boardEl.appendChild(cell);
    }
  }
}

initBoard();
renderBoard();