import React from 'react';
import logo from './logo.svg';
import './App.css';
import WatergateTrack from './components/WaterGateTrack';
import { GameProvider } from './contexts/GameContexts';

function App() {
  return (
    <GameProvider>
      <div className="App">
        <WatergateTrack/>
      </div>
    </GameProvider>
  );
}

export default App;
