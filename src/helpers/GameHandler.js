import { executeMove } from "./moveExecutor";
import validateMove from "./moveValidator";
import isGameOver from "./EndofGame";

export default class GameHandler {
    constructor() {

      /* https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation */
      this.currentFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; //update this variable with each move
      //this.currentFEN = 'r3k2r/ppp2ppp/2n2n2/2K2b2/P1P2P2/1qN1p3/1P2NbPP/R1B2B1R b kq - 0 1'

      this.prevBoards = []; 

      this.updatePrevBoards = (FEN) => {
        let fenParts = FEN.split(' ');
        fenParts.pop();
        fenParts.pop();
        const piecePlacement = fenParts.join(' ');
        this.prevBoards.push(piecePlacement);
      }

      this.gameOver = false; //set to the result (white, black, or draw) when game is over 

      this.handleInput = (input, gameState) => {
      /* Parse the input from the UI (e.g. "click on square e2") 
         otherwise acts as the below handle text function does  */
      }
    
      this.handleText = (move) => {
        if(validateMove(move, this.currentFEN)){
          this.currentFEN = executeMove(move, this.currentFEN);
          this.updatePrevBoards(this.currentFEN);
          this.gameOver = isGameOver(this.currentFEN, this.prevBoards); 
          return true;
        }else{
          console.log("Invalid move");
          return false;
        }
      }
    }
}
  