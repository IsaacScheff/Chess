import validateMove from "./moveValidator";

export function validKingMove (kingPosition, FEN) { 
    const startSquare = String.fromCharCode(kingPosition[1] + 97) + (8 - kingPosition[0]);
    let move = '';
    //there's never a time when the only legal move is castling, so no need to check for it  
    let x = -1;
    let y = -1;
    let upperX = 1;
    let upperY = 1;

    if(kingPosition[0] === 7){ //if king is on the bottom rank, cannot mover lower
        y = 0;
    }else if(kingPosition[0] === 0){ //if king is on the top rank cannot move higher
        upperY = 0;
    }

    if(kingPosition[1] === 7){ //if king is all the way to the right (h file) cannot move right
        upperX = 0;
    }else if(kingPosition[1] === 0){ //if king is all the way to the left (a file) cannot move left
        x = 0;
    }

    for(x; x <= upperX; x++){
        for(let j = y; j <= upperY; j++){ //here j replaces y as it needs to reset for each itertion of the outer loop
            if(x !== 0 || j !== 0){
                move = startSquare + String.fromCharCode(kingPosition[1] + x + 97) + (8 - kingPosition[0] + j);
                if(validateMove(move, FEN)){
                    return true;
                }
            }
        }
    }         
    return false;
}

export function validRookMove (rookPosition, FEN) {
    const startSquare = String.fromCharCode(rookPosition[1] + 97) + (8 - rookPosition[0]);
    let move = '';

    for(let y = 0; y < 8; y++){ //vertical
        if(rookPosition[0] !== y){
            move = startSquare + startSquare[0] + (8 - y)
            if(validateMove(move, FEN)){
                return true;
            }
        }
    }

    for(let x = 0; x < 8; x++){ //horizontal
        if(rookPosition[1] !== x){
            move = startSquare + String.fromCharCode(97 - x) + startSquare[1]
            if(validateMove(move, FEN)){
                return true;
            }
        }
    }
    return false;
}

export function validBishopMove (bishopPosition, FEN) {
    const startSquare = String.fromCharCode(bishopPosition[1] + 97) + (8 - bishopPosition[0]);
    let move = '';
    for(let rank = 0; rank < 8; rank++){
        if(bishopPosition[0] !== rank){
            if(bishopPosition[1] + Math.abs(bishopPosition[0] - rank) < 8){
                move = startSquare + String.fromCharCode(bishopPosition[1] + Math.abs(bishopPosition[0] - rank) + 97) + (8 - rank);
                if(validateMove(move, FEN)){
                    return true;
                }
            }
            if(bishopPosition[1] - Math.abs(bishopPosition[0] - rank) >= 0){
                move = startSquare + String.fromCharCode(bishopPosition[1] - Math.abs(bishopPosition[0] - rank) + 97) + (8 - rank);
                if(validateMove(move, FEN)){
                    return true;
                }
            }   
        }
    }
    return false;
}

export function validKnightMove (knightPosition, FEN) {
    const startSquare = String.fromCharCode(knightPosition[1] + 97) + (8 - knightPosition[0]);
    let move = '';
    
    const knightMoveOffsets = [
        [-1, -2], [-2, -1], [-2, 1], [-1, 2],
        [1, -2], [2, -1], [2, 1], [1, 2]
    ];

     // Iterate through the possible knight moves
    for (const [dx, dy] of knightMoveOffsets) {
        const newX = knightPosition[1] + dx;
        const newY = knightPosition[0] + dy;
        move = startSquare + String.fromCharCode(newX + 97) + (8 - newY);

        if (isSquareOnBoard(newX, newY) && validateMove(move, FEN)) {
            return true; 
        }
    }
    return false;
}

export function validPawnMove (pawnPosition, FEN) {
    const startSquare = String.fromCharCode(pawnPosition[1] + 97) + (8 - pawnPosition[0]);
    let move = '';
    const color = FEN.split(' ')[1];
    
    /* check for promotion, if pawn on 1 or 6 and the right color,  
        move = startSquare + one square forward + letter of piece to promote to, e.g. 'e7e8q' */
    if((color === 'w' && pawnPosition[0] === 1) || (color === 'b' && pawnPosition[0] === 6)){
        move = startSquare + startSquare[0] + (8 - (pawnPosition[0] + (color === 'w' ? -1 : 1))) + 'q';
        return true;
    }
   
    //check if pawn can move forward one square 
    move = startSquare + startSquare[0] + (8 - (pawnPosition[0] + (color === 'w' ? -1 : 1)));
    if(validateMove(move, FEN)){
        return true;
    }

    //if pawn is on starting square it can move forward 2 spaces
    if((color === 'w' && pawnPosition[0] === 6) || (color === 'b' && pawnPosition[0] === 1)){ 
        move = startSquare + startSquare[0] + (8 - (pawnPosition[0] + (color === 'w' ? -2 : 2)));
        if(validateMove(move, FEN)){
            return true;
        }
    }
    
    // Check if pawn can make a capture 
    const captureDirections = [{ dx: -1, dy: -1 }, { dx: 1, dy: -1 }]; // Diagonal capture directions
    for (const direction of captureDirections) {
        const targetX = pawnPosition[1] + direction.dx;
        const targetY = pawnPosition[0] + (color === 'w' ? -1 : 1);
     
        if (isSquareOnBoard(targetX, targetY)) {
            move = startSquare + String.fromCharCode(targetX + 97) + (8 - targetY);
            if(validateMove(move, FEN)){
                return true;
            }
        }
    }
    return false;
}

export function isSquareOnBoard(x, y) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
}



