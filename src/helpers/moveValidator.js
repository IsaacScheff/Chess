import {squareToArray, fenToBoard} from "./converters.js"
import { targetCheck } from "./moveExecutor.js";
import isCheckAfterMove from "./isCheckAfterMove.js";
import {straightVerify, diagonalVerify} from "./lineCertifier.js";
import { isPathClear, isDiagonalClear } from "./clearCertifier.js";

export default function validateMove (move, fen) {
  const [boardState, playerTurn, castlingRights, enPassantSquare] = fen.split(' ');
  const pieces = fenToBoard(boardState); 
      
  const [startSquare, endSquare] = [squareToArray(move.slice(0, 2)), squareToArray(move.slice(2, 4))];

  if(startSquare === endSquare)
    return false;
          
  const piece = pieces[startSquare[0]][startSquare[1]];
          
  // Verify that piece belogs to correct player
  if (piece === (playerTurn === 'b' ? piece.toUpperCase() : piece.toLowerCase())) {
    return false;
  }
          
  // Check if the move is legal for the specific piece type
  switch (piece.toLowerCase()) {
    case 'p': {
      const startFile = startSquare[1];
      const startRank = startSquare[0];
      const endFile = endSquare[1];
      const endRank = endSquare[0];
      const target = pieces[endRank][endFile];
      
      if(endRank === (piece === 'P' ? 0 : 7) && move.length !== 5){
        return false;
      }

      const direction = (piece === 'P') ? -1 : 1;

      //pawn moves forward one square or two if on starting square
      if (startFile === endFile && target === '-' && 
        (endRank - startRank === direction || 
        (endRank - startRank === 2 * direction && 
        (startRank === 1 || startRank === 6) && pieces[startRank + direction][startFile] === '-'))
      ) {
        break;
      }

      //pawn takes diagonally 
      if(endRank - startRank === direction && Math.abs(endFile - startFile) === 1){
        if(enPassantSquare !== '-'){
          if(target === pieces[8 - enPassantSquare[1]][enPassantSquare.charCodeAt(0) - 97]){
            break;
          }
        }
        if(target !== '-')
          break;
      }

    }
    return false;
    case 'r': 
      if(!straightVerify(startSquare, endSquare))
        return false;
      if(!isPathClear(startSquare, endSquare, pieces))
        return false;   
          break;
    case 'n': {
      const x1 = startSquare[0];
      const y1 = startSquare[1];
      const x2 = endSquare[0];
      const y2 = endSquare[1];
              
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);
              
      if (!(dx == 1 && dy == 2) && !(dx == 2 && dy == 1))
        return false;
      else
        break;  
    }
    case 'b': 
      if(!diagonalVerify(startSquare, endSquare))
        return false;
      if(!isDiagonalClear(startSquare, endSquare, pieces))
        return false; 
      break;
    case 'q': 
      if(straightVerify(startSquare, endSquare)){
        if(!isPathClear(startSquare, endSquare, pieces))
          return false; 
        }else if(diagonalVerify(startSquare, endSquare)){
          if(!isDiagonalClear(startSquare, endSquare, pieces))
            return false; 
        }else //if neither straight nor diagonal, return false 
          return false;
      break;
    case 'k': {
      //check for castling
      //could also make cases for 0-0, 0-0-0, O-O, O-O-O
      switch (move) {
        case 'e1c1':
          if(castlingRights.includes('K') && isPathClear(startSquare, endSquare, pieces) && !isCheckAfterMove(move, fen)){
            return true;
          } else
            return false;
        case 'e1g1':
          if(castlingRights.includes('Q') && isPathClear(startSquare, endSquare, pieces) && !isCheckAfterMove(move, fen)){
            return true;
        } else
            return false;
        case 'e8c8':
          if(castlingRights.includes('k') && isPathClear(startSquare, endSquare, pieces) && !isCheckAfterMove(move, fen)){
            return true;
          }else
            return false;
        case 'e8g8':
          if(castlingRights.includes('q') && isPathClear(startSquare, endSquare, pieces) && !isCheckAfterMove(move, fen)){
            return true;
          }else
            return false;
        default:
          break;
      }

      if(Math.abs(startSquare[0] - endSquare[0]) > 1 || Math.abs(startSquare[1] - endSquare[1]) > 1)
        return false;
    }
      break;
    default:
      return false; // invalid piece
  }
          
  if(!targetCheck(endSquare, playerTurn, pieces))
    return false;

  if(isCheckAfterMove(move, fen))
    return false;
  //All checks passed, move is valid
  return true;
}     