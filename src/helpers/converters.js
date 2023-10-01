function fileToNumber (file) {
    switch(file){
        case 'a': return 0;
        case 'b': return 1;
        case 'c': return 2;
        case 'd': return 3;
        case 'e': return 4;
        case 'f': return 5;
        case 'g': return 6;
        case 'h': return 7;
    }
}

const squareToArray = (square) => [8 - square[1], fileToNumber(square[0])];

function fenToBoard(fen){ //converts string from FEN to a 2D array
  let rows = fen.split('/');
  let board = [];

  for (let i = 0; i < rows.length; i++) {
    let row = [];
    let j = 0;

    while (j < rows[i].length){
      if(rows[i][j].match(/\d/)){
        let num_blanks = parseInt(rows[i][j]);
        for (let k = 0; k < num_blanks; k++){
          row.push('-');
        }
        j++;
      } else{
          row.push(rows[i][j]);
          j++;
        }
    }
    board.push(row);
  }
  return board;
}

function boardToFen(board){ //takes 2D array of board and converts to string for FEN
  let fen = '';
  for (let i = 0; i < board.length; i++){
    let row = board[i];
    let num_blanks = 0;
    for (let j = 0; j < row.length; j++){
      let piece = row[j];
      if (piece === '-'){
        num_blanks++;
      } else{
        if (num_blanks > 0){
          fen += num_blanks;
          num_blanks = 0;
        }
        fen += piece;
      }
    }
    if (num_blanks > 0){
      fen += num_blanks;
    }
    if (i < board.length - 1){
      fen += '/';
    }
  }
  return fen;
}

export {squareToArray, fenToBoard, boardToFen};