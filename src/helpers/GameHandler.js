export default class GameHandler {
    constructor() {

        //https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
      //this.currentFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; //update this variable with each move
      this.currentFEN = 'rnbqkbnr/pppppppp/8/8/8/6K1/PPPPPPPP/RNBQ1BNR w KQkq - 0 1'; //update this variable with each move
      //this.currentFEN = 'rnbqkbnr/pppppppp/8/2K5/8/1n6/PPPPPPPP/RNBQ1BNR w KQkq - 0 1'; //for testing only
        //this.currentFEN = 'b3k2r/6r1/8/8/8/8/3R4/R3K3 w Qk - 0 1'; //for testing only
        //this.currentFEN = '4k2r/6r1/8/8/2Q5/8/3R4/R3K3 w Qk - 0 1'; //for testing only
        this.prevBoards = []; //everytime there's a move add the fen to check for 3 fold repitition maybe

        //should be able to replace this function with ASCII conversions instead 
        this.fileToNumber = (file) => {
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

        this.squareToArray = (square) => [this.fileToNumber(square[0]), 8 - square[1]];

        this.fenToBoard = (fen) => {
            let rows = fen.split('/');
            let board = [];

            for (let i = 0; i < rows.length; i++) {
                let row = [];
                let j = 0;

                while (j < rows[i].length) {
                if (rows[i][j].match(/\d/)) {
                    let num_blanks = parseInt(rows[i][j]);
                    for (let k = 0; k < num_blanks; k++) {
                    row.push('-');
                    }
                    j++;
                } else {
                    row.push(rows[i][j]);
                    j++;
                }
                }
                board.push(row);
            }
            return board;
        }

        //here is chatGPTs board to fen function, will test it once I have the execute move function working
        this.boardToFen = (board) => {
            let fen = '';
            for (let i = 0; i < board.length; i++) {
              let row = board[i];
              let num_blanks = 0;
              for (let j = 0; j < row.length; j++) {
                let piece = row[j];
                if (piece === '-') {
                  num_blanks++;
                } else {
                  if (num_blanks > 0) {
                    fen += num_blanks;
                    num_blanks = 0;
                  }
                  fen += piece;
                }
              }
              if (num_blanks > 0) {
                fen += num_blanks;
              }
              if (i < board.length - 1) {
                fen += '/';
              }
            }
            //console.log(fen);
            return fen;
        }

        //helper function used in verifying legal moves in a straight line 
        this.isPathClear = (startSquare, endSquare, pieces) => {
            //console.log('starSquare:', startSquare, 'endSquare:', endSquare);
            console.log(pieces);
            const startFile = this.fileToNumber(startSquare[0]);
            const startRank = startSquare[1] - 1;
            const endFile = this.fileToNumber(endSquare[0]);
            const endRank = endSquare[1] - 1;
            //console.log(startFile, startRank, endFile, endRank);

            // Determine the direction of the move
            let fileDirection = Math.sign(endFile - startFile);
            let rankDirection = Math.sign(endRank - startRank);
            //console.log(fileDirection, rankDirection);

            // Check each square in the path
            for (let file = startFile + fileDirection, rank = startRank + rankDirection; file !== endFile || rank !== endRank; file += fileDirection, rank += rankDirection) {
                //console.log(pieces, rank, file);
                // Check if there is a piece on the square
                if (pieces[rank][file] !== '-') {
                    console.log('false');
                    return false;
                }
            }
            //console.log('PathIsClear: true');
            return true;
        }

        this.isDiagonalClear = (startSquare, endSquare, pieces) => {
            // const startFile = this.fileToNumber(startSquare[0]);
            // const startRank = 8 - startSquare[1];
            // const endFile = this.fileToNumber(endSquare[0]);
            // const endRank = 8 - endSquare[1];
            console.log(startSquare, endSquare);
            const startFile = startSquare[0];
            const startRank = startSquare[1];
            const endFile = endSquare[0];
            const endRank = endSquare[1];

            //console.log(startFile, startRank, endFile, endRank);
            const rankDirection = startRank < endRank ? 1 : -1;
            const fileDirection = startFile < endFile ? 1 : -1;
          
            // Check diagonal path for any obstructions
            for (let rank = startRank + rankDirection, file = startFile + fileDirection; rank !== endRank; rank += rankDirection, file += fileDirection) {
                console.log(pieces, rank, file);
                console.log(pieces[rank][file]);
              if (pieces[file][rank] !== '-') {
                console.log('diagonal not clear');
                return false;
              }
            }
            console.log('diagonal is clear');
            return true;
        }

        this.targetCheck = (targetSquare, color, pieces) => {
            const targetRank = 8 - targetSquare[1];
            const targetFile = this.fileToNumber(targetSquare[0]);

            //console.log(targetRank, targetFile);
            if(color === 'b'){
                if(['k', 'n', 'r', 'p', 'q', 'b'].includes(pieces[targetRank][targetFile])){
                    console.log('targetCheck returning false');
                    return false;
                }
            }else{
                if(['K', 'N', 'R', 'P', 'Q', 'B'].includes(pieces[targetRank][targetFile])){
                    console.log('targetCheck returning false');
                    return false;
                }
            }
            //console.log('Target check returning true');
            return true;
        }

        //rook and queen legal move verifier 
        this.straightVerify = (startSquare, endSquare) => {
            if(startSquare[0] === endSquare[0] || startSquare[1] === endSquare[1])
                return true;
            else
                return false;
        }

        /*
        bishop and queen legal move verifier
        In this function, we first convert the square notation to row and column indices 
        (with file representing the column index and rank representing the row index). 
        ((now doing any needed conversion to an array before this function))
        We then compare the absolute difference in the columns and rows 
        using Math.abs() and return a boolean indicating whether they are equal.
        */
        this.diagonalVerify = (startSquare, endSquare) => {
            const startFile = startSquare[0];
            const startRank = startSquare[1];
            const endFile = endSquare[0];
            const endRank = endSquare[1];

            //console.log(Math.abs(startFile - endFile) === Math.abs(startRank - endRank));
            return Math.abs(startFile - endFile) === Math.abs(startRank - endRank);
        }

        this.isCheckAfterMove = (move, color, board) => {
          // Make a copy of the board
          const newBoard = [...this.fenToBoard(board).map(row => [...row])];
          //console.log(newBoard);

          // Simulate the move on the new board

          const startX = move[0].charCodeAt(0) - 97;
          const startY = 8 - parseInt(move[1]);
          const endX = move[2].charCodeAt(0) - 97;
          const endY = 8 - parseInt(move[3]);

          newBoard[endY][endX] = newBoard[startY][startX];
          //console.log(startY, startX, newBoard[startY][startX]);
          newBoard[startY][startX] = '-';
          //console.log(newBoard);
        
          // Find the position of the player's king
          let kingPosition;
          for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
              if (color === 'w' && newBoard[y][x] === 'K') {
                kingPosition = [y, x];
                break;
              } else if (color === 'b' && newBoard[y][x] === 'k') {
                kingPosition = [y, x];
                break;
              }
            }
          }
          //console.log(kingPosition);
          //console.log(newBoard[kingPosition[0]][kingPosition[1]]);
        
          // Check if the king is under attack
          const oppositeColor = (color === 'w') ? 'b' : 'w';
          //console.log(oppositeColor);
        
          // Check for attacking moves from opponent's pawns
          const pawnDirection = (oppositeColor === 'w') ? 1 : -1;

          if (
            newBoard[kingPosition[0] + pawnDirection][kingPosition[1] + 1] === (oppositeColor === 'w' ? 'P' : 'p') || 
            newBoard[kingPosition[0] + pawnDirection][kingPosition[1] - 1] === (oppositeColor === 'w' ? 'P' : 'p')
          ) {
            console.log('Pawn Attack!');
            return true;
          }
          
          //checks for where opponents knights are located (with additioanl logic to verify the squares being checked exist)
          if (
            (kingPosition[0] - 1 >= 0 && kingPosition[1] - 2 >= 0 && newBoard[kingPosition[0] - 1][kingPosition[1] - 2] === (oppositeColor === 'w' ? 'N' : 'n')) ||
            (kingPosition[0] + 1 < 8 && kingPosition[1] - 2 >= 0 && newBoard[kingPosition[0] + 1][kingPosition[1] - 2] === (oppositeColor === 'w' ? 'N' : 'n')) ||
            (kingPosition[0] - 2 >= 0 && kingPosition[1] - 1 >= 0 && newBoard[kingPosition[0] - 2][kingPosition[1] - 1] === (oppositeColor === 'w' ? 'N' : 'n')) ||
            (kingPosition[0] + 2 < 8 && kingPosition[1] - 1 >= 0 && newBoard[kingPosition[0] + 2][kingPosition[1] - 1] === (oppositeColor === 'w' ? 'N' : 'n')) ||
            (kingPosition[0] - 1 >= 0 && kingPosition[1] + 2 < 8 && newBoard[kingPosition[0] - 1][kingPosition[1] + 2] === (oppositeColor === 'w' ? 'N' : 'n')) ||
            (kingPosition[0] + 1 < 8 && kingPosition[1] + 2 < 8 && newBoard[kingPosition[0] + 1][kingPosition[1] + 2] === (oppositeColor === 'w' ? 'N' : 'n')) ||
            (kingPosition[0] - 2 >= 0 && kingPosition[1] + 1 < 8 && newBoard[kingPosition[0] - 2][kingPosition[1] + 1] === (oppositeColor === 'w' ? 'N' : 'n')) ||
            (kingPosition[0] + 2 < 8 && kingPosition[1] + 1 < 8 && newBoard[kingPosition[0] + 2][kingPosition[1] + 1] === (oppositeColor === 'w' ? 'N' : 'n'))
          ) {
            console.log('Knight Attack!');
            return true;
          }
        
          let bishopPositions = [];
          for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
              if (color === 'w' && newBoard[y][x] === 'b') {
                bishopPositions.push([y, x]);
              } else if (color === 'b' && newBoard[y][x] === 'B') {
                bishopPositions.push([y, x]);
              }
            }
          }
          //console.log(bishopPositions);
          for (const bishop of bishopPositions){
            //console.log(bishop);
            if(this.diagonalVerify(bishop, kingPosition)){
              console.log(bishop, "yasss")
              if(this.isDiagonalClear(bishop, kingPosition, newBoard)){
                console.log("Bishop Attack!")
                return true;
              }
            }
          }
          
          /*
            this process will need to be repeated for the rooks, excpet straight line checks 
          */

          /*
            then both of the above for queen moves
          */
        
          // // Check for attacking moves from opponent's kings
          // const kingMoves = [
          //   [kingPosition[0] - 1, kingPosition[1] - 1],
          //   [kingPosition[0] - 1, kingPosition[1]],
          //   [kingPosition[0] - 1, kingPosition[1] + 1],
          //   [kingPosition[0], kingPosition[1] - 1],
          //   [kingPosition[0], kingPosition[1] + 1],
          //   [kingPosition[0] + 1, kingPosition[1] - 1],
          //   [kingPosition[0] + 1, kingPosition[1]],
          //   [kingPosition[0] + 1, kingPosition[1] + 1]
          // ];
        
          // for (let move of kingMoves) {
          //   const [x, y] = move;
          //   if (x >= 0 && x < 8 && y >= 0 && y < 8 && newBoard[y][x] === oppositeColor + 'k') {
          //     return true; // King is under attack by opponent's king
          //   }
          // }
        
          return false; // King is not under attack
        }        
        
                  
        // Function to validate a move
        //we're taking in the full FEN here as en passant and castling info is needed

        //might want to do a single this.squareToArray higher up in this function, we'll see 
        this.isValidMove = (move, fen) => {
            // Parse the FEN string to get the board state and other game information
            const [boardState, playerTurn, castlingRights, enPassantSquare, halfMoveClock, fullMoveNumber] = fen.split(' ');
            // Convert the board state to a 2D array of pieces
            const pieces = this.fenToBoard(boardState); 
            //console.log(pieces);
          
            // Parse the move into a start square and end square
            const [startSquare, endSquare] = [move.slice(0, 2), move.slice(2, 4)];

            //make sure they are different squares
            if(startSquare === endSquare)
                return false;
          
            // Get the piece on the start square
            const piece = pieces[8 - startSquare[1]][this.fileToNumber(startSquare[0])];
            //console.log(pieces, piece);
            //console.log(startSquare);
            //console.log(startSquare[0])
          
            // Check if the piece belongs to the current player
            if (piece === piece.toUpperCase() !== playerTurn === 'w') {
              console.log('wrong player flag');
              return false;
            }
          
            //console.log('piece:', piece);
            // Check if the move is legal for the piece
            switch (piece.toLowerCase()) {
            //for each of these also need to check if it leaves you in check
              case 'p': { // pawn
                const startFile = this.fileToNumber(startSquare[0])
                const startRank = 8 - startSquare[1];
                const endFile = this.fileToNumber(endSquare[0])
                const endRank = 8 - endSquare[1];
                const piece = pieces[startRank][startFile];
                const target = pieces[endRank][endFile];
                //console.log('file:',startFile, 'rank:',startRank,'endFile:',endFile,'endRank:',endRank);
                //console.log(piece, target);

                const direction = (piece === 'P') ? -1 : 1;

                //pawn moves forward one square or two if on starting square
                if (startFile === endFile && target === '-' && (endRank - startRank === direction || (endRank - startRank === 2 * direction && (startRank === 1 || startRank === 6) && pieces[startFile][startRank + direction] === '-'))) {
                    break;
                }

                //pawn takes diagonally 
                if (Math.abs(endRank - startRank) === 1 && endFile - startFile === direction && target !== '-') {
                    console.log('Pawn capture move');
                    break;
                }

                //need logic for en passant capture 

              }
                return false;
              case 'r': // rook
                if(!this.straightVerify(startSquare, endSquare))
                    return false;
                if(!this.isPathClear(startSquare, endSquare, pieces))
                    return false;   
                break;
              case 'n': {// knight
                // check if move is L-shaped
                const x1 = startSquare.charCodeAt(0) - 'a'.charCodeAt(0);
                const y1 = 8 - parseInt(startSquare.charAt(1));
                const x2 = endSquare.charCodeAt(0) - 'a'.charCodeAt(0);
                const y2 = 8 - parseInt(endSquare.charAt(1));
              
                const dx = Math.abs(x2 - x1);
                const dy = Math.abs(y2 - y1);
              
                if ((dx == 1 && dy == 2) || (dx == 2 && dy == 1)) {
                  //return true;
                  break;
                } else {
                  return false;
                }
            }
              case 'b': // bishop
                // check if move is diagonal
                if(!this.diagonalVerify(this.squareToArray(startSquare), this.squareToArray(endSquare)))
                  return false;
                // check if path is clear
                if(!this.isDiagonalClear(this.squareToArray(startSquare), this.squareToArray(endSquare), pieces))
                    return false; 
                //check target square
                break;
              case 'q': // queen
                if(this.straightVerify(startSquare, endSquare)){
                    if(!this.isPathClear(startSquare, endSquare, pieces))
                        return false; 
                }else if(this.diagonalVerify(this.squareToArray(startSquare), this.squareToArray(endSquare))){
                    if(!this.isDiagonalClear(this.squareToArray(startSquare), this.squareToArray(endSquare), pieces))
                    return false; 
                }else //if neither straight nor diagonal, return false 
                    return false;
                break;
              case 'k': {// king
                //we're using thi slogic multiple times in this function, will have to clean up
              const x1 = startSquare.charCodeAt(0) - 'a'.charCodeAt(0);
              const y1 = 8 - parseInt(startSquare.charAt(1));
              const x2 = endSquare.charCodeAt(0) - 'a'.charCodeAt(0);
              const y2 = 8 - parseInt(endSquare.charAt(1));
              if(Math.abs(x1 - x2) > 1 || Math.abs(y1 - y2) > 1){
                    return false;
              }
                // check for castling
              }
              break;
              default:
                return false; // invalid piece
            }
          
            //make sure we're not targeting our own piece
            if(!this.targetCheck(endSquare, playerTurn, pieces))
                return false;

            //need to check for check
            if(this.isCheckAfterMove(move, playerTurn, boardState)){
              return false;
            }

            //All checks passed, move is valid
            return true;
        }          
    
        // Function to execute a move
        this.executeMove = (move, fen) => {
        // Update the game state to reflect the new position of the pieces
            const startFile = move[0].charCodeAt(0) - 97;
            const startRank = 8 - parseInt(move[1]);
            const endFile = move[2].charCodeAt(0) - 97;
            const endRank = 8 - parseInt(move[3]);
        
            let [boardState, playerTurn, castlingRights, enPassantSquare, halfMoveClock, fullMoveNumber] = fen.split(' ');

            let board = this.fenToBoard(boardState);
            // Get the piece being moved
            const piece = board[startRank][startFile];
        
            // Remove the piece from its starting position
            board[startRank][startFile] = '-';
        
            // Move the piece to its new position
            board[endRank][endFile] = piece;
            console.log(board);
            boardState = this.boardToFen(board);
            //then need to convert back to FEN and make the changes to castling rights, player turn, and move counters 
            this.currentFEN = [boardState, playerTurn, castlingRights, enPassantSquare, halfMoveClock, fullMoveNumber].join(' ');
        }
    
        // Function to handle user input and update the game state
        this.handleInput = (input, gameState) => {
        // Parse the input (e.g. "click on square e2")
        // Check if the move is valid using isValidMove
        // If it's valid, execute the move using executeMove
        // Otherwise, show an error message or highlight illegal moves
        }

        this.handleText = (move) => {
            if(this.isValidMove(move, this.currentFEN)){
                this.executeMove(move, this.currentFEN);
            }else{
                console.log("Invalid move :(");
            }
        }
    }
}
  