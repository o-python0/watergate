import "./App.css";
import { GameProvider } from "./contexts/GameContexts";
import GameBoard from "./components/GameBoard";
import { DevTools } from "./components/DevTools";

function App() {
  const showDevTools = process.env.REACT_APP_SHOW_DEV_TOOLS === "true";

  return (
    <GameProvider>
      <div className="App">
        <GameBoard />
        {showDevTools && <DevTools />}
      </div>
    </GameProvider>
  );
}

export default App;
