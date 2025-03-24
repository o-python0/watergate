import React from "react";
import logo from "./logo.svg";
import "./App.css";
import WatergateTrack from "./components/WaterGateTrack";
import { GameProvider } from "./contexts/GameContexts";
import GameBoard from "./components/GameBoard";

function App() {
  return (
    <GameProvider>
      <div className="App">
        {/* <WatergateTrack/> */}
        <GameBoard />
      </div>
    </GameProvider>
  );
}

export default App;
