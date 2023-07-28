const gameBoard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info");
const circleScoreDisplay = document.querySelector("#circle-score");
const crossScoreDisplay = document.querySelector("#cross-score");
const drawScoreDisplay = document.querySelector("#draw-score");
const startCells = ["", "", "", "", "", "", "", "", ""];
let circleWins = 0;
let crossWins = 0;
let draws = 0;
let go = "circle";
let moveIndex = -1;
const moveHistory = [];
let gameOver = false;
infoDisplay.textContent = "Circle Goes First";
infoDisplay.style.color = "black";

if (localStorage.getItem("circleWins")) {
  circleWins = parseInt(localStorage.getItem("circleWins"));
}

if (localStorage.getItem("crossWins")) {
  crossWins = parseInt(localStorage.getItem("crossWins"));
}

if (localStorage.getItem("draws")) {
  draws = parseInt(localStorage.getItem("draws"));
}

function updateBoardFromHistory() {
  const allSquares = document.querySelectorAll(".square");

  allSquares.forEach(square => {
    square.innerHTML = "";
    square.removeEventListener("click", addGo);
    square.addEventListener("click", addGo);
  });

  for (let i = 0; i <= moveIndex; i++) {
    const move = moveHistory[i];
    const cellElement = document.getElementById(move.cellIndex);
    const goDisplay = document.createElement('div');
    goDisplay.classList.add(move.go);
    cellElement.appendChild(goDisplay);
    cellElement.removeEventListener("click", addGo);
  }

  go = moveIndex === -1 ? "circle" : moveHistory[moveIndex].go === "circle" ? "cross" : "circle";
  infoDisplay.textContent = "It is now " + go + "'s go.";
}

function next() {
  if (gameOver || moveIndex >= moveHistory.length - 1) {
    return;
  }

  moveIndex++;
  const move = moveHistory[moveIndex];
  const cellElement = document.getElementById(move.cellIndex);
  const goDisplay = document.createElement('div');
  goDisplay.classList.add(move.go);
  cellElement.appendChild(goDisplay);
  go = move.go === "circle" ? "cross" : "circle";
  infoDisplay.textContent = "It is now " + go + "'s go.";
  checkScore();

  if (moveIndex >= moveHistory.length - 1) {
    document.getElementById("next").disabled = true;
  }

  document.getElementById("previous").disabled = false;
}

function previous() {
  if (moveIndex <= -1) {
    return;
  }

  moveIndex--;
  updateBoardFromHistory();

 
  if (moveIndex <= -1) {
    document.getElementById("previous").disabled = true;
  }

  document.getElementById("next").disabled = false;
}

function reset() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach(square => {
    square.innerHTML = "";
    square.addEventListener('click', addGo);
  });

  go = "circle";
  infoDisplay.textContent = "Circle Goes First";

  
  moveHistory.length = 0;
  moveIndex = -1;


  const lineElement = document.querySelector("#line");
  lineElement.innerHTML = "";

  circleWins = 0;
  crossWins = 0;
  draws = 0;
  circleScoreDisplay.textContent = `O: ${circleWins}`;
  crossScoreDisplay.textContent = `X: ${crossWins}`;
  drawScoreDisplay.textContent = `=: ${draws}`;

  localStorage.removeItem("circleWins");
  localStorage.removeItem("crossWins");
  localStorage.removeItem("draws");

  gameOver = false;
  document.getElementById("previous").disabled = false;
  document.getElementById("next").disabled = false;
}

function createBoard() {
  circleScoreDisplay.textContent = `O: ${circleWins}`;
  crossScoreDisplay.textContent = `X: ${crossWins}`;
  drawScoreDisplay.textContent = `=: ${draws}`;

  startCells.forEach((_cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('square');
    cellElement.id = index;
    cellElement.addEventListener('click', addGo);
    gameBoard.appendChild(cellElement);
  });
}

function addGo(e) {
  if (infoDisplay.textContent.includes("Wins!") || gameOver) {
    return;
  }

  const goDisplay = document.createElement('div');
  goDisplay.classList.add(go);
  e.target.appendChild(goDisplay);

  const move = {
    cellIndex: e.target.id,
    go: go
  };

  if (moveIndex < moveHistory.length - 1) {
    moveHistory.splice(moveIndex + 1);
  }

  moveHistory.push(move);
  moveIndex++;
  updateBoardFromHistory();
  checkScore();

  localStorage.setItem("circleWins", circleWins);
  localStorage.setItem("crossWins", crossWins);
  localStorage.setItem("draws", draws);
}

function checkScore() {
  const allSquares = document.querySelectorAll(".square");
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  let winningCombo = null;

  winningCombos.forEach(array => {
    const circleWinsCombo = array.every(cell =>
      allSquares[cell].firstChild?.classList.contains('circle')
    );

    if (circleWinsCombo) {
      circleWins++;
      winningCombo = array;
      return;
    }

    const crossWinsCombo = array.every(cell =>
      allSquares[cell].firstChild?.classList.contains('cross')
    );

    if (crossWinsCombo) {
      crossWins++;
      winningCombo = array;
      return;
    }
  });

  if (winningCombo) {
    const circleWinsCombo = winningCombo.every(cell =>
      allSquares[cell].firstChild?.classList.contains('circle')
    );

    if (circleWinsCombo) {
      infoDisplay.textContent = "Circle Wins!";
    } else {
      infoDisplay.textContent = "Cross Wins!";
    }

    const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lineElement.setAttribute("x1", getCellCenterX(winningCombo[0]));
    lineElement.setAttribute("y1", getCellCenterY(winningCombo[0]));
    lineElement.setAttribute("x2", getCellCenterX(winningCombo[2]));
    lineElement.setAttribute("y2", getCellCenterY(winningCombo[2]));
    lineElement.setAttribute("stroke", "#000000");
    lineElement.setAttribute("stroke-width", "5");
    document.querySelector("#line").appendChild(lineElement);

    allSquares.forEach(square => square.removeEventListener("click", addGo));

    gameOver = true;
    document.getElementById("previous").disabled = true;
    document.getElementById("next").disabled = true;

  } else if (isDraw()) {
    infoDisplay.textContent = "It's a draw!";
    draws++;
    document.getElementById("previous").disabled = true;
    document.getElementById("next").disabled = true;
    gameOver = true;
  }

  circleScoreDisplay.textContent = `O: ${circleWins}`;
  crossScoreDisplay.textContent = `X: ${crossWins}`;
  drawScoreDisplay.textContent = `=: ${draws}`;
}

function isDraw() {
  const allSquares = document.querySelectorAll(".square");
  for (let i = 0; i < allSquares.length; i++) {
    if (!allSquares[i].firstChild) {
      return false;
    }
  }
  return true;
}

function getCellCenterX(index) {
  const cellElement = document.getElementById(index);
  const cellRect = cellElement.getBoundingClientRect();
  return cellRect.left + cellRect.width / 2;
}

function getCellCenterY(index) {
  const cellElement = document.getElementById(index);
  const cellRect = cellElement.getBoundingClientRect();
  return cellRect.top + cellRect.height / 2;
}

document.getElementById("next").addEventListener("click", next);
document.getElementById("previous").addEventListener("click", previous);
document.getElementById("reset").addEventListener("click", reset);

createBoard();