//to verify rook and quen moves
function straightVerify (startSquare, endSquare){
    if(startSquare[0] === endSquare[0] || startSquare[1] === endSquare[1])
        return true;
    else
        return false;
}

//to verify bishop and queen moves 
function diagonalVerify (startSquare, endSquare){
    const startFile = startSquare[0];
    const startRank = startSquare[1];
    const endFile = endSquare[0];
    const endRank = endSquare[1];

    return Math.abs(startFile - endFile) === Math.abs(startRank - endRank);
}

export {straightVerify, diagonalVerify};
