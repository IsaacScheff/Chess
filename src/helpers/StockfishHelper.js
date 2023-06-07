export default class StockfishHelper {
    constructor() {
      this.serverUrl = 'http://localhost:3000';
      this.analysisUrl = `${this.serverUrl}/analyze`;
    }
  
    //async analyzePosition(fen) {
    async analyzePosition(fen) {
      console.log(fen);
      try {
        const response = await fetch(this.analysisUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fen })
        });
  
        const data = await response.json();
        //console.log(data);
  
        return data.move;
      } catch (error) {
        console.error(error);
        console.log("Line 21, Stockfish helper function");
        return null;
      }
    }
}
  