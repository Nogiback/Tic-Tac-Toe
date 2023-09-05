'use strict'

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

const displayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const messageField = document.getElementById("message");
  const restartButton = document.getElementById("restart");

  cells.forEach((cell) => 
    cell.addEventListener("click", (e) => {
      if (gameController.checkGameOver() || e.target.textContent !== "") {
        return;
      } else {
        gameController.playTurn(parseInt(e.target.dataset.index));
        updateGameBoard();
      };
    })
  );
  
  restartButton.addEventListener("click", (e) => {
    restartButton.textContent = "Restart Game";
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
    } else if (checkDraw() || roundCount === 9) {
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
    return board.every((cell) => cell !== "");
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