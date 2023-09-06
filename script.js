'use strict'

//-------------------------------- PLAYER FACTORY -----------------------------------//

const Player = (name, sign) => {
  this.name = name;
  this.sign = sign;
  
  const getName = () => {
    return name;
  }; 

  const getSign = () => {
    return sign;
  };

  return { getName, getSign };
};

//-------------------------------- GAMEBOARD MODULE -----------------------------------//

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const setCell = (index, sign) => {
    if (index > board.length) {
      return;
    } else {
      board[index] = sign;
    };
  };

  const getCell = (index) => {
    if (index > board.length) {
      return;
    } else {
      return board[index];
    };
  };

  const getBoard = () => board;

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    };
  };

  return { setCell, getCell, getBoard, resetBoard };

})();

//----------------------------- DISPLAY CONTROLLER MODULE -------------------------------//

const displayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const messageField = document.getElementById("message");
  const gameButton = document.getElementById("game-btn");
  const nameDialog = document.getElementById("name-input");
  const closeModal = document.getElementById("close-modal");
  const submitBtn = document.getElementById("submit-btn");
  const form = document.getElementById("form");
  const playerXNameField = document.querySelector("#player-x");
  const playerONameField = document.querySelector("#player-o");

  cells.forEach((cell) => 
    cell.addEventListener("click", (e) => {
      if (gameButton.textContent === "Start Game" || gameController.checkGameOver() || e.target.textContent !== "") {
        return;
      } else {
        gameController.playTurn(parseInt(e.target.dataset.index));
        updateGameBoard();
      };
    })
  );
  
  gameButton.addEventListener("click", (e) => {
    gameButton.textContent = "Restart Game";
    gameBoard.resetBoard();
    gameController.resetGame();
    updateGameBoard();
    setMessage("Player X's turn!");
  })

  const setMessage = (message) => {
    messageField.textContent = message;
  };

  const updateGameBoard = () => {
    for (let i = 0; i < cells.length; i++) {
      cells[i].textContent = gameBoard.getCell(i);
    };
  };

  return { setMessage };

})();

//------------------------------ GAME CONTROLLER MODULE --------------------------------//

const gameController = (() => {
  const playerX = Player("Player X", "X");
  const playerO = Player("Player O", "O");
  let currentPlayer = playerX;
  let roundCount = 1;
  let gameOver = false;

  const setCurrentPlayer = () => {
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
  };

  const setResultMessage = (result) => {
    if (result === "Draw") {
      displayController.setMessage("It's a draw!");
    } else {
      displayController.setMessage(`Player ${result} has won!`);
    }
  };

  const playTurn = (cellIndex) => {
    gameBoard.setCell(cellIndex, currentPlayer.getSign());

    if (checkWin()) {
      setResultMessage(currentPlayer.getSign());
      gameOver = true;
      return;
    } else if (checkDraw()) {
      setResultMessage("Draw");
      gameOver = true;
      return;
    } else {
      setCurrentPlayer();
      displayController.setMessage(`${currentPlayer.getName()}'s Turn!`)
      roundCount++;
    }
  }

  const checkDraw = () => {
    const board = gameBoard.getBoard();
    return (roundCount === 9 || board.every((cell) => cell !== ""));
  };

  const checkWin = () => {
    const board = gameBoard.getBoard();
    const sign = currentPlayer.getSign();

    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combo of winConditions) {
      let [a, b, c] = combo;
      if (board[a] === sign && board[b] === sign && board[c] === sign) {
        return true;
      }
    }
    return false;
  };

  const checkGameOver = () => {
    return gameOver;
  };

  const resetGame = () => {
    roundCount = 1;
    gameOver = false;
    currentPlayer = playerX;
  };

  return { playTurn, checkGameOver, resetGame };

})();