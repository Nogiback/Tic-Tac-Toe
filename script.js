'use strict'

//-------------------------------- PLAYER FACTORY -----------------------------------//

const Player = (sign) => {
  let name = "";
  
  const getName = () => {
    return name;
  }; 

  const getSign = () => sign;

  const setName = (newName) => {
    name = newName;
  }

  return { getName, getSign, setName };
};

//-------------------------------- GAME-BOARD MODULE -----------------------------------//

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
  
  gameButton.addEventListener("click", () => {
    if (gameButton.textContent === "Start Game") {
      nameDialog.showModal();
      playerXNameField.focus();
      submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        gameController.playerX.setName(playerXNameField.value);
        gameController.playerO.setName(playerONameField.value);
        nameDialog.close();
        form.reset();
        setMessage(`${gameController.playerX.getName()}'s Turn!`);
        gameButton.textContent = "Restart Game";
        updateGameBoard();
      });
    } else if (gameButton.textContent = "Restart Game") {
      gameBoard.resetBoard();
      gameController.resetGame();
      setMessage(`${gameController.playerX.getName()}'s Turn!`);
      updateGameBoard();
    }
  });

  closeModal.addEventListener("click", () => {
    nameDialog.close();
    form.reset();
  });

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
  const playerX = Player("X");
  const playerO = Player("O");
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
      displayController.setMessage(`${result} has won!`);
    }
  };

  const playTurn = (cellIndex) => {
    gameBoard.setCell(cellIndex, currentPlayer.getSign());

    if (checkWin()) {
      setResultMessage(currentPlayer.getName());
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

  return { playTurn, checkGameOver, resetGame, playerX, playerO };

})();