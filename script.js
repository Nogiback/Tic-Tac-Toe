'use strict'

const Player = (name, sign) => {
  this.name = name;
  this.sign = sign;
  
  const getName = () => {
    return name;
  } 

  const getSign = () => {
    return sign;
  };

  return { getName, getSign };
};

const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];
  const cells = document.querySelectorAll('cell');

  const getBoard = () => {
    return board;
  };
  
  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach((cell) => (cell.textContent=""));
  };

  return { getBoard, resetBoard };

})();
