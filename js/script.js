let board;
let score = 0;
const rows = 4;
const columns = 4;

window.onload = function () {
  setGame();

  // Button controls
  document
    .getElementById("up")
    .addEventListener("click", () => handleMove(slideUp));
  document
    .getElementById("down")
    .addEventListener("click", () => handleMove(slideDown));
  document
    .getElementById("left")
    .addEventListener("click", () => handleMove(slideLeft));
  document
    .getElementById("right")
    .addEventListener("click", () => handleMove(slideRight));
};

function setGame() {
  // check localStorage
  const savedBoard = localStorage.getItem("board");
  const savedScore = localStorage.getItem("score");

  if (savedBoard && savedScore) {
    board = JSON.parse(savedBoard);
    score = parseInt(savedScore, 10);
  } else {
    board = Array.from({ length: rows }, () => Array(columns).fill(0));
    setTwo();
    setTwo();
    score = 0;
  }

  const boardContainer = document.getElementById("board");
  boardContainer.innerHTML = "";

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      tile.id = `${r}-${c}`;
      tile.classList.add("tile");
      boardContainer.append(tile);
    }
  }

  updateBoard();
}

function updateTile(tile, num) {
  tile.innerText = "";
  tile.className = "tile";
  if (num > 0) {
    tile.innerText = num;
    tile.classList.add(`x${num <= 8192 ? num : 8192}`);
  }
}

function updateBoard() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      updateTile(tile, board[r][c]);
    }
  }
  document.getElementById("score").innerText = score;

  // Implementation of localStorage
  localStorage.setItem("board", JSON.stringify(board));
  localStorage.setItem("score", score);
}

function handleMove(moveFunc) {
  const oldBoard = JSON.stringify(board);
  moveFunc();
  if (JSON.stringify(board) !== oldBoard) {
    setTwo();
    updateBoard();
    if (isGameOver()) {
      document.getElementById("game-over").style.display = "block";
      disableControls();
      localStorage.removeItem("board");
      localStorage.removeItem("score");
    }
  }
}

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(row) {
  row = filterZero(row);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }
  row = filterZero(row);
  while (row.length < columns) {
    row.push(0);
  }
  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    board[r] = slide(board[r]);
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    board[r] = slide(board[r].reverse()).reverse();
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let col = board.map((row) => row[c]);
    col = slide(col);
    for (let r = 0; r < rows; r++) {
      board[r][c] = col[r];
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let col = board.map((row) => row[c]).reverse();
    col = slide(col).reverse();
    for (let r = 0; r < rows; r++) {
      board[r][c] = col[r];
    }
  }
}

function setTwo() {
  let emptyTiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) emptyTiles.push([r, c]);
    }
  }
  if (emptyTiles.length === 0) return;

  let [r, c] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  board[r][c] = 2;
}

function isGameOver() {
  if (board.flat().includes(0)) return false;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (c < columns - 1 && board[r][c] === board[r][c + 1]) return false;
      if (r < rows - 1 && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}

function disableControls() {
  document.querySelectorAll(".controls button").forEach((btn) => {
    btn.disabled = true;
    btn.style.opacity = 0.5;
    btn.style.cursor = "not-allowed";
  });
}
