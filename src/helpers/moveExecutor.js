import {fenToBoard, boardToFen} from "./converters";

function targetCheck (targetSquare, color, pieces){
    const targetRank = targetSquare[0];
    const targetFile = targetSquare[1];

    if(color === 'b'){
        if(['k', 'n', 'r', 'p', 'q', 'b'].includes(pieces[targetRank][targetFile])){
            return false;
        }
    }else{
        if(['K', 'N', 'R', 'P', 'Q', 'B'].includes(pieces[targetRank][targetFile])){
            return false;
        }
    }
    return true;
}

function executeMove (move, fen){
    const startFile = move[0].charCodeAt(0) - 97;
    const startRank = 8 - parseInt(move[1]);
    const endFile = move[2].charCodeAt(0) - 97;
    const endRank = 8 - parseInt(move[3]);

    let [boardState, playerTurn, castlingRights, enPassantSquare, halfMoveClock, fullMoveNumber] = fen.split(' ');
    let board = fenToBoard(boardState);

    halfMoveClock++;
 
    const piece = board[startRank][startFile];
    if(piece !== 'p' && piece !== 'P')
        enPassantSquare = '-';

    if(piece === 'p' || piece === 'P')
        halfMoveClock = 0;
    else if(board[endRank][endFile] !== '-')
        halfMoveClock = 0;

    // Remove the piece from its starting position
    board[startRank][startFile] = '-';

    //check for castling 
    switch (move) {
        case 'e1c1':
            board[7][2] = 'K';
            board[7][3] = 'R';
            board[7][0] = '-';
            break;
        case 'e1g1':
            board[7][6] = 'K';
            board[7][5] = 'R';
            board[7][7] = '-';
            break;
        case 'e8c8':
            board[0][2] = 'k';
            board[0][3] = 'r';
            board[0][0] = '-';
            break;
        case 'e8g8':
            board[0][6] = 'k';
            board[0][5] = 'r';
            board[0][7] = '-';
            break;
        default: //every move that's not castling move the piece to its new position
            board[endRank][endFile] = piece;
        break;
    }

    if(playerTurn === 'b'){
        fullMoveNumber++;
        playerTurn = 'w';
    }else{
        playerTurn = 'b';
    }

    //special moves; castling, en passant, promotion
    switch (piece) { 
        case 'P':
            if(endRank === 0){
                board[endRank][endFile] = move[4].toUpperCase();
            }else if(enPassantSquare === move.slice(-2))
                board[endRank + 1][endFile] = '-';
            if(startRank === 6 && endRank === 4){
                enPassantSquare = String.fromCharCode(97 + startFile) + 3;
            }else
                enPassantSquare = '-';
            break;
        case 'p':
            if(endRank === 7){
                board[endRank][endFile] = move[4].toLowerCase();
            }else if(enPassantSquare === move.slice(-2))
                board[endRank - 1][endFile] = '-';
            if(startRank === 1 && endRank === 3){
                enPassantSquare = String.fromCharCode(97 + startFile) + 6;
            }else
                enPassantSquare = '-';
            break;
        case 'K':
            if(castlingRights.includes('K') || castlingRights.includes('Q')){
                castlingRights = castlingRights.replace('K','');
                castlingRights = castlingRights.replace('Q', ''); 
            }
            break;
        case 'k':
            if(castlingRights.includes('k') || castlingRights.includes('q')){
                castlingRights = castlingRights.replace('k','');
                castlingRights = castlingRights.replace('q', ''); 
            }
            break;
        case 'R':
            if(startRank === 7){
                if(startFile === 0 && castlingRights.includes('Q'))
                    castlingRights = castlingRights.replace('Q', ''); 
                else if(startFile === 7 && castlingRights.includes('K'))
                    castlingRights = castlingRights.replace('K','');
            } 
        break;
        case 'r':
            if(startRank === 0){
                if(startFile === 0 && castlingRights.includes('q'))
                    castlingRights = castlingRights.replace('q', ''); 
                else if(startFile === 7 && castlingRights.includes('k'))
                    castlingRights = castlingRights.replace('k','');
            } 
        break;
        default:
            break;
    }
    boardState = boardToFen(board);
    
    return [boardState, playerTurn, castlingRights, enPassantSquare, halfMoveClock, fullMoveNumber].join(' ');
}

export {targetCheck, executeMove};

