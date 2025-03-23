// src/contexts/GameContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { GameState, TokenColor, TokenType } from '../constants/types';

// デフォルトのゲーム状態
const defaultGameState: GameState = {
  track: {
    x: 300,
    yStart: 50,
    yEnd: 350,
    width: 120,
    cells: 11
  },
  initiativeMarker: {
    position: 0,
    radius: 15,
    color: '#ffffff',
    border: '#2c3e50',
    label: 'I'
  },
  powerToken: {
    position: -2,
    radius: 15,
    color: '#e74c3c',
    border: '#2c3e50',
    label: 'P'
  },
  evidenceTokens: [
    { id: 1, position: -3, color: '#e74c3c', owner: null, label: '1', shape: 'square' },
    { id: 2, position: 0, color: '#3498db', owner: null, label: '2', shape: 'square' },
    { id: 3, position: 2, color: '#2ecc71', owner: null, label: '3', shape: 'square' }
  ]
};

// コンテキストの型定義
interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  moveTokenBySteps: (tokenType: TokenType, tokenId: number | null, steps: number) => void;
  getEvidenceTokenIdByColor: (colorName: TokenColor) => number | null; // 新しい関数の型定義を追加
  animating: boolean;
}

// コンテキストの作成
const GameContext = createContext<GameContextType | null>(null);

// コンテキストプロバイダーコンポーネント
export const GameProvider: React.FC<{
  children: React.ReactNode;
  initialState?: GameState;
}> = ({ children, initialState }) => {
  const [gameState, setGameState] = useState<GameState>(initialState || defaultGameState);
  const [animating, setAnimating] = useState<boolean>(false);

  // トークン移動関数
  const moveTokenBySteps = (tokenType: TokenType, tokenId: number | null, steps: number): void => {
    if (animating || steps === 0) return;
    setAnimating(true);
    
    let currentPosition: number;
    let updateFunction: (nextPosition: number) => void;
    
    // トークンタイプに応じた処理を設定
    if (tokenType === 'initiative') {
      currentPosition = Math.round(gameState.initiativeMarker.position);
      updateFunction = (nextPosition) => setGameState(prev => ({
        ...prev,
        initiativeMarker: {
          ...prev.initiativeMarker,
          position: nextPosition
        }
      }));
    } else if (tokenType === 'power') {
      currentPosition = Math.round(gameState.powerToken.position);
      updateFunction = (nextPosition) => setGameState(prev => ({
        ...prev,
        powerToken: {
          ...prev.powerToken,
          position: nextPosition
        }
      }));
    } else if (tokenType === 'evidence' && tokenId !== null) {
      const token = gameState.evidenceTokens.find(t => t.id === tokenId);
      if (!token) {
        setAnimating(false);
        return;
      }
      currentPosition = Math.round(token.position);
      updateFunction = (nextPosition) => setGameState(prev => ({
        ...prev,
        evidenceTokens: prev.evidenceTokens.map(t => 
          t.id === tokenId ? { ...t, position: nextPosition } : t
        )
      }));
    } else {
      setAnimating(false);
      return;
    }
    
    // 新しい位置を計算（範囲内に収める）
    const newPosition = Math.max(-5, Math.min(5, currentPosition + steps));
    
    // 移動が不要な場合はスキップ
    if (currentPosition === newPosition) {
      setAnimating(false);
      return;
    }
    
    const distance = newPosition - currentPosition;
    const absoluteSteps = Math.abs(distance);
    
    // ステップごとに移動するアニメーション
    let currentStep = 0;
    const stepDuration = 200; // 各ステップの時間（ミリ秒）
    
    const animateStep = (): void => {
      currentStep++;
      
      // 次の位置を計算（1マスずつ移動）
      const nextPosition = distance > 0 
        ? currentPosition + currentStep 
        : currentPosition - currentStep;
      
      updateFunction(nextPosition);
      
      // まだステップが残っていれば続行
      if (currentStep < absoluteSteps) {
        setTimeout(animateStep, stepDuration);
      } else {
        setAnimating(false);
      }
    };
    
    // アニメーション開始
    if (absoluteSteps > 0) {
      setTimeout(animateStep, 10);
    } else {
      setAnimating(false);
    }
  };

  const getEvidenceTokenIdByColor = (colorName: TokenColor): number | null => {
    // 色名と実際のCSSカラーコードのマッピング
    const colorToHexMap: Record<TokenColor, string> = {
      'red': '#e74c3c',
      'blue': '#3498db',
      'green': '#2ecc71'
    };
    
    const hexColor = colorToHexMap[colorName];
    
    // 対応する色の証拠トークンをgameStateから検索
    const token = gameState.evidenceTokens.find(t => t.color === hexColor);
    return token ? token.id : null;
  };

  // コンテキスト値
  const contextValue: GameContextType = {
    gameState,
    setGameState,
    moveTokenBySteps,
    getEvidenceTokenIdByColor,
    animating
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// カスタムフック
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};