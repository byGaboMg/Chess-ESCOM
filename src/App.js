import newLogo from "./logocaballo.png";
import "./App.css";
import ChessGame from "./ChessGame";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <title>Chess-withVoice(beta)</title>
        <img src={newLogo} className="App-logo" alt="logo" />
        <h2>Chess-withVoice V1.3</h2>
        <span className="textosugerencia">
          Dí tu movimiento de la forma: [casilla inicial] [casilla final]
        </span>
        <p className="textosugerencia2">Ejemplo: "C2 C3"</p>
      </header>
      <div className="Chess-container">
        <ChessGame />
      </div>
      <footer className="App-footer">
        <p>Copyright ©All rights reserved xd</p>
      </footer>
    </div>
  );
}

export default App;
