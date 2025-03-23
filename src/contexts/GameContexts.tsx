// src/contexts/GameContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { COLOR_TO_HEX_MAP, defaultGameState } from '../constants';
import { GameState, TokenColor, TokenType } from '../constants/types';

// types.ts に追加する型定義
// export interface EvidenceToken {
//   id: number;
//   position: number;
//   colors: TokenColor[];      // 実際の色の配列
//   displayColor: string;      // 表示用の色（裏向きならグレー）
//   owner: string | null;
//   label: string;
//   shape: 'square';
//   isFaceUp: boolean;         // 表向きかどうか
// }



// コンテキストの型定義
interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  moveTokenBySteps: (tokenType: TokenType, tokenId: number | null, steps: number) => void;
  getEvidenceTokenIdByColor: (colorName: TokenColor) => number | null;
  flipTokenFaceUp: (tokenId: number) => void; // 表向きにする関数を追加
  findFaceDownTokenWithColor: (colorName: TokenColor) => number | null; // 裏向きトークンを検索する関数
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

  // トークンを表向きにする関数
  const flipTokenFaceUp = (tokenId: number): void => {
    setGameState(prev => ({
      ...prev,
      evidenceTokens: prev.evidenceTokens.map(token => {
        if (token.id === tokenId) {
          // 表向きにし、表示色を実際の色に変更
          // 複数色の場合は最初の色を表示
          const mainColor = token.colors[0];
          return {
            ...token,
            isFaceUp: true,
            displayColor: mainColor in COLOR_TO_HEX_MAP
              ? COLOR_TO_HEX_MAP[mainColor as TokenColor]
              : '#808080'
          };
        }
        return token;
      })
    }));
  };

  // 裏向きで特定の色を持つトークンを検索する関数
  const findFaceDownTokenWithColor = (colorName: TokenColor): number | null => {
    const token = gameState.evidenceTokens.find(t => 
      !t.isFaceUp && t.colors.includes(colorName)
    );
    return token ? token.id : null;
  };
  
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

  // 色から表向きのトークンIDを取得する関数
  const getEvidenceTokenIdByColor = (colorName: TokenColor): number | null => {
    // 表向きのトークンのうち、指定された色を持つものを検索
    const token = gameState.evidenceTokens.find(t => 
      t.isFaceUp && t.colors.includes(colorName)
    );
    
    return token ? token.id : null;
  };

  // コンテキスト値
  const contextValue: GameContextType = {
    gameState,
    setGameState,
    moveTokenBySteps,
    getEvidenceTokenIdByColor,
    flipTokenFaceUp,
    findFaceDownTokenWithColor,
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