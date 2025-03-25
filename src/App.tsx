import "./App.css";
import { GameProvider } from "./contexts/GameContexts";
import GameBoard from "./components/GameBoard";

function App() {
  return (
    <GameProvider>
      <div className="App">
        <GameBoard />
      </div>
    </GameProvider>
  );
}

export default App;
