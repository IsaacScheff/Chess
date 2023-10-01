import { fenToBoard } from "./converters";
import { validKingMove, validRookMove, validBishopMove, validKnightMove, validPawnMove } from "./possibleMoves";
import isCheckAfterMove from "./isCheckAfterMove";

//will return white or black for a white or black victory or draw in the case of a draw
export default function isGameOver (FEN, prevBoards) {
    const pieces = getPieces(FEN);
    const soloMates = ['Q', 'R', 'P']; //these are pieces which if present by themselves are enough mating material

    //check for insufficient material 
    if(pieces.blackPieces.length < 3 && pieces.whitePieces.length < 3){
        if(!pieces.whitePieces.some(piece => soloMates.includes(piece))){
            if(!pieces.blackPieces.some(piece => soloMates.includes(piece.toUpperCase()))){
                console.log('Insufficient mating material!');
                return 'draw';
            }
        }
    }

    if(FEN.split(' ')[4] >= 100){
        console.log('Fifty Move rule');
        return 'draw';
    }

    if(threefoldRepetition(prevBoards)){
        console.log('Threefold repitition.');
        return 'draw';
    }

    if(!legalMove(FEN)){ //if in check, then checkmate, otherwise stalemate
        let kingPosition;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (FEN.split(' ')[1] === 'w' && fenToBoard(FEN.split(' ')[0])[y][x] === 'K') {
                    kingPosition = [y, x];
                    break;
                } else if (FEN.split(' ')[1] === 'b' && fenToBoard(FEN.split(' ')[0])[y][x] === 'k') {
                    kingPosition = [y, x];
                    break;
                }
            }
        }
        const kingSquare = String.fromCharCode(kingPosition[1] + 97) + (8 - kingPosition[0]);
        const move = kingSquare + kingSquare;
        if(isCheckAfterMove(move, FEN)){
            console.log('Checkmate');
            return (FEN.split(' ')[1] === 'w' ? 'black' : 'white');
        }
        console.log('Stalemate');
        return 'draw';
    }
    return false;
}

function getPieces(FEN){
    let pieces = {
        blackPieces: [],
        whitePieces: []
    }
    let board = FEN.split(' ')[0];

    while(board.length > 0){
        if(board[0].toLowerCase() !== board[0].toUpperCase()){
            if(board[0].toUpperCase() === board[0]){
                pieces.whitePieces.push(board[0]);
            }else{
                pieces.blackPieces.push(board[0]);
            }
        }
        board = board.slice(1);
    }
    return pieces;
}

function threefoldRepetition(prevBoards) {
    const occurrences = {};
  
    for (const board of prevBoards) {
      if (occurrences[board]) {
        occurrences[board]++;
        if (occurrences[board] === 3) {
            return true;
        }
      } else {
        occurrences[board] = 1;
      }
    }
    return false;
}

//returns true if any legal move is detected, otherwise returns false
function legalMove(FEN){
    const [board, color] = FEN.split(' ');
    const boardState = fenToBoard(board);

    for(let i = 0; i < boardState[0].length; i++){
        for(let j = 0; j < boardState[i].length; j++){
            switch(boardState[i][j]) {
                case (color === 'w' ? 'K' : 'k'): 
                    if(validKingMove([i , j], FEN))
                        return true;
                    break;
                case (color === 'w' ? 'Q' : 'q'):
                    if(validRookMove([i, j], FEN) || validBishopMove([i, j], FEN))
                        return true;
                    break;
                case (color === 'w' ? 'R' : 'r'):
                    if(validRookMove([i, j], FEN))
                        return true;
                    break;
                case (color === 'w' ? 'N' : 'n'):
                    if(validKnightMove([i, j], FEN))
                        return true;
                    break;
                case (color === 'w' ? 'B' : 'b'):
                    if(validBishopMove([i, j], FEN))
                        return true;
                    break;
                case (color === 'w' ? 'P' : 'p'):
                    if(validPawnMove([i, j], FEN))
                        return true;
                    break;
            }
        }
    }
    return false;
}