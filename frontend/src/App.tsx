import "./App.css";
import GameBoard from "./components/GameBoard";
import { DevTools } from "./components/DevTools";

function App() {
  const showDevTools = process.env.REACT_APP_SHOW_DEV_TOOLS === "true";

  return (
    <div className="App">
      <GameBoard />
      {showDevTools && <DevTools />}
    </div>
  );
}

export default App;
