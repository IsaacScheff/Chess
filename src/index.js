import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import StockfishHelper from './helpers/StockfishHelper';
import GameHandler from './helpers/GameHandler';
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
        //this.StockfishHelper = new StockfishHelper();
    
        //const fen = '4k2r/6r1/8/8/8/8/3R4/R3K3 w Qk - 0 1';
        //const fen = 'B3k2r/6r1/8/8/8/8/3R4/R3K3 w Qk - 0 1';
        //const suggestedMove = await this.StockfishHelper.analyzePosition(fen);

        //this.GameHandler.isValidMove('a8d5', fen);

        // if (suggestedMove) {
        //     //makeMove(suggestedMove); // Replace this with your own code to make the suggested move
        //     console.log(suggestedMove);
        //   } else {
        //     console.log('An error occurred while analyzing the position.');
        //   }
        
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
            this.GameHandler.handleText(input.node.value);
            input.node.value = '';
        });

    }
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
