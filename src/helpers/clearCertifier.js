//function used in verifying legal moves in a straight line 
function isPathClear (startSquare, endSquare, pieces){
    const startFile = startSquare[0];
    const startRank = startSquare[1];
    const endFile = endSquare[0];
    const endRank = endSquare[1];

    let fileDirection = Math.sign(endFile - startFile);
    let rankDirection = Math.sign(endRank - startRank);

    // Check each square in the path
    for (let file = startFile + fileDirection, rank = startRank + rankDirection; file !== endFile || rank !== endRank; file += fileDirection, rank += rankDirection){
        if (pieces[file][rank] !== '-'){
            return false;
        }
    }
    return true;
}

function isDiagonalClear (startSquare, endSquare, pieces){
    const startFile = startSquare[0];
    const startRank = startSquare[1];
    const endFile = endSquare[0];
    const endRank = endSquare[1];

    const rankDirection = startRank < endRank ? 1 : -1;
    const fileDirection = startFile < endFile ? 1 : -1;
    
    // Check diagonal path for any obstructions
    for (let rank = startRank + rankDirection, file = startFile + fileDirection; rank !== endRank; rank += rankDirection, file += fileDirection){
        if (pieces[file][rank] !== '-'){
            return false;
        }
    }
    return true;
}

export {isPathClear, isDiagonalClear};
