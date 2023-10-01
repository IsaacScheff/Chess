import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import StockfishHelper from './helpers/stockfishHelper';
import GameHandler from './helpers/gameHandler';
import { fenToBoard } from './helpers/converters';
import 'regenerator-runtime/runtime'
class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('logo', logoImg);
    }


    async create ()
    {
        this.GameHandler = new GameHandler();
        this.StockfishHelper = new StockfishHelper();
        this.playerTurn = true;
        this.isAnalyzingPosition = false;
        this.gameOver = false;

        this.boardPosition = this.add.text(100, 100, displayChessPosition(this.GameHandler.currentFEN), {fontSize: 40});

        this.gameInfo = this.add.text(345, 500, 'Start Game');
        
        //Create an input element
        const input = this.add.dom(345, 550, 'input', {
            type: 'text',
            name: 'nameField'
        });

        // Set the input element's style
        input.node.style.width = '300px';
        input.node.style.height = '50px';
        input.node.style.fontSize = '24px';
        input.node.style.textAlign = 'center';

        // Add a listener to the input element's 'change' event
        input.node.addEventListener('change', (event) => {
            console.log('User entered:', input.node.value);
            if(this.GameHandler.handleText(input.node.value)){
                //if(!this.GameHandler.gameOver === false)
                    //we need to handle the end of game here
                this.playerTurn = false;
                this.gameInfo.setText('Opponents Turn');
                this.boardPosition.setText(displayChessPosition(this.GameHandler.currentFEN));
            }
            input.node.value = '';
            //suggestedMove = await this.StockfishHelper.analyzePosition(fen);
            //console.log(await this.StockfishHelper.analyzePosition(this.fen));
            //this.GameHandler.handleText(suggestedMove); 
        });
    }

    async update () {
        if(this.GameHandler.gameOver !== false && this.gameOver === false){
            console.log('Game Over:', this.GameHandler.gameOver);
            this.gameInfo.setText(this.GameHandler.gameOver);
            this.gameOver = true;
        }

        if(this.playerTurn === false && this.gameOver === false){
            if(!this.isAnalyzingPosition){ //check if analyses in progress
                this.isAnalyzingPosition = true; //set flag to true
                this.suggestedMove = await this.StockfishHelper.analyzePosition(this.GameHandler.currentFEN);
                console.log(this.suggestedMove);
                this.GameHandler.handleText(this.suggestedMove);
                this.boardPosition.setText(displayChessPosition(this.GameHandler.currentFEN));
                this.isAnalyzingPosition = false; //reset flag after analysis
                this.gameInfo.setText('Your Turn');
            }
            this.playerTurn = true;
        }

    }

}

function displayChessPosition(fen) {
    let grid = '';
    const fenParts = fen.split(' ');
    const piecePlacement = fenParts[0];
    const board = fenToBoard(piecePlacement);

    for (let row of board) {
      for (let square of row) {
        grid += square.padStart(3); // Adjust the padding as needed
      }
      grid += '\n';
    }
  
    return grid;
}


const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    dom: {
        createContainer: true
    },
    scene: MyGame
};

const game = new Phaser.Game(config);
