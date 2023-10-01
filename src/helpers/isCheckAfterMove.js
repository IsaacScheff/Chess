import { fenToBoard } from "./converters";
import {straightVerify, diagonalVerify} from "./lineCertifier";
import { isPathClear, isDiagonalClear } from "./clearCertifier";
import { executeMove } from "./moveExecutor";
import { isSquareOnBoard } from "./possibleMoves";

export default function isCheckAfterMove (move, fen) {
  const [board, color] = fen.split(' ');

  //for castling, verify that king is not in check currently and not moving through a square that would be in check
  switch (move) {
    case 'e1c1':
      if(isCheckAfterMove('e1e1', fen) || isCheckAfterMove('e1d1', fen))
        return false;
      break;
    case 'e1g1':
      if(isCheckAfterMove('e1e1', fen) || isCheckAfterMove('e1f1', fen))
        return false;
      break;
    case 'e8c8':
      if(isCheckAfterMove('e8e8', fen) || isCheckAfterMove('e8d8', fen))
        return false;
      break;
    case 'e8g8':
      if(isCheckAfterMove('e8e8', fen) || isCheckAfterMove('e8f8', fen))
        return false;
      break;
    default:
      break;
  }
  // Make a copy of the board
  const newBoard = fenToBoard(executeMove(move, fen).split(' ')[0]);

  const startX = move[0].charCodeAt(0) - 97;
  const startY = 8 - parseInt(move[1]);
  const endX = move[2].charCodeAt(0) - 97;
  const endY = 8 - parseInt(move[3]);
  const piece = fenToBoard(board)[startY][startX];

  newBoard[endY][endX] = piece;

  if(startX !== endX || startY !== endY)
    newBoard[startY][startX] = '-';
 
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

  const oppositeColor = (color === 'w') ? 'b' : 'w';
  // Check for attacking moves from opponent's pawns
  const pawnDirection = (oppositeColor === 'w') ? 1 : -1;
  if ( 
    (kingPosition[0] + pawnDirection < 8 && kingPosition[0] + pawnDirection > 0) &&
    (newBoard[kingPosition[0] + pawnDirection][kingPosition[1] + 1] === (oppositeColor === 'w' ? 'P' : 'p') || 
    newBoard[kingPosition[0] + pawnDirection][kingPosition[1] - 1] === (oppositeColor === 'w' ? 'P' : 'p'))
  ) {
    return true;
  }
  
  //check for the 8 different squares a knight could see the king
  const oppKnight = (oppositeColor === 'w' ? 'N' : 'n');
  if (
    (isSquareOnBoard(kingPosition[0] - 1, kingPosition[1] - 2) && newBoard[kingPosition[0] - 1][kingPosition[1] - 2] === oppKnight) ||
    (isSquareOnBoard(kingPosition[0] + 1, kingPosition[1] - 2) && newBoard[kingPosition[0] + 1][kingPosition[1] - 2] === oppKnight) ||
    (isSquareOnBoard(kingPosition[0] - 2, kingPosition[1] - 1) && newBoard[kingPosition[0] - 2][kingPosition[1] - 1] === oppKnight) ||
    (isSquareOnBoard(kingPosition[0] + 2, kingPosition[1] - 1) && newBoard[kingPosition[0] + 2][kingPosition[1] - 1] === oppKnight) ||
    (isSquareOnBoard(kingPosition[0] - 1, kingPosition[1] + 2) && newBoard[kingPosition[0] - 1][kingPosition[1] + 2] === oppKnight) ||
    (isSquareOnBoard(kingPosition[0] + 1, kingPosition[1] + 2) && newBoard[kingPosition[0] + 1][kingPosition[1] + 2] === oppKnight) ||
    (isSquareOnBoard(kingPosition[0] - 2, kingPosition[1] + 1) && newBoard[kingPosition[0] - 2][kingPosition[1] + 1] === oppKnight) ||
    (isSquareOnBoard(kingPosition[0] + 2, kingPosition[1] + 1) && newBoard[kingPosition[0] + 2][kingPosition[1] + 1] === oppKnight)
  ){
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
  for (const bishop of bishopPositions){
    if(diagonalVerify(bishop, kingPosition)){
      if(isDiagonalClear(bishop, kingPosition, newBoard)){
        return true;
      }
    }
  }

  let rookPositions = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (color === 'w' && newBoard[y][x] === 'r') { 
        rookPositions.push([y, x]);
      } else if (color === 'b' && newBoard[y][x] === 'R') {
        rookPositions.push([y, x]);
      }
    }
  }

  for (const rook of rookPositions){
    if(straightVerify(rook, kingPosition)){
      if(isPathClear(rook, kingPosition, newBoard)){
        return true;
      }
    }
  }
  
  let queenPositions = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (color === 'w' && newBoard[y][x] === 'q') { 
        queenPositions.push([y, x]);
      } else if (color === 'b' && newBoard[y][x] === 'Q') {
        queenPositions.push([y, x]);
      }
    }
  }

  for (const queen of queenPositions){
    if(straightVerify(queen, kingPosition)){
      if(isPathClear(queen, kingPosition, newBoard)){
        return true;
      }
    }else if(diagonalVerify(queen, kingPosition)){
      if(isDiagonalClear(queen, kingPosition, newBoard)){
        return true;
      }
    }
  }

  let oppKing;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (color === 'w' && newBoard[y][x] === 'k') {
        oppKing = [y, x];
        break;
      } else if (color === 'b' && newBoard[y][x] === 'K') {
        oppKing = [y, x];
        break;
      }
    }
  }

  if(Math.abs(kingPosition[0] - oppKing[0]) < 2 && Math.abs(kingPosition[1] - oppKing[1]) < 2){
    return true;
  }
  return false; // King is not under attack      
}