export default class StockfishHelper {
    constructor() {
      this.serverUrl = 'http://localhost:3000';
      this.analysisUrl = `${this.serverUrl}/analyze`;
    }
  
    async analyzePosition(fen) {
      try {
        const response = await fetch(this.analysisUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fen })
        });
  
        const data = await response.json();
        return data.move;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
 }

//var stockfish = new Worker("stockfish.js");

// export default class StockfishHelper {
//   constructor(){
//     this.stockfish = new Worker('stockfish.js');
//   }

//   async analyzePosition(fen) {
//     try {
//       const response = await fetch(this.analysisUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ fen })
//       });

//       const data = await response.json();
//       return data.move;
//     } catch (error) {
//       console.error(error);
//       return null;
//     }
//   }
// }