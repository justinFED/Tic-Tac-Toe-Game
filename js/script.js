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
infoDisplay.textContent = "Circle goes first";
infoDisplay.style.color = "white";

if (localStorage.getItem("circleWins")) {
  circleWins = parseInt(localStorage.getItem("circleWins"));
}

if (localStorage.getItem("crossWins")) {
  crossWins = parseInt(localStorage.getItem("crossWins"));
}

if (localStorage.getItem("draws")) {
  draws = parseInt(localStorage.getItem("draws"));
}

function createBoard() {
  circleScoreDisplay.textContent = `Circle Wins: ${circleWins}`;
  crossScoreDisplay.textContent = `Cross Wins: ${crossWins}`;
  drawScoreDisplay.textContent = `Draws: ${draws}`;

  startCells.forEach((_cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('square');
    cellElement.id = index;
    cellElement.addEventListener('click', addGo);
    gameBoard.appendChild(cellElement);
  });
}

createBoard();

function addGo(e) {
  if (infoDisplay.textContent.includes("Wins!")) {
    return;
  }

  const goDisplay = document.createElement('div');
  goDisplay.classList.add(go);
  e.target.appendChild(goDisplay);
  go = go === "circle" ? "cross" : "circle";
  infoDisplay.textContent = "It is now " + go + "'s go.";
  e.target.removeEventListener("click", addGo);
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
    lineElement.setAttribute("stroke", "#0ef");
    lineElement.setAttribute("stroke-width", "5");
    document.querySelector("#line").appendChild(lineElement);

    allSquares.forEach(square => square.removeEventListener("click", addGo));
  } else if (isDraw()) {
    infoDisplay.textContent = "It's a draw!";
    draws++;
  }

  circleScoreDisplay.textContent = `Circle Wins: ${circleWins}`;
  crossScoreDisplay.textContent = `Cross Wins: ${crossWins}`;
  drawScoreDisplay.textContent = `Draws: ${draws}`;
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
