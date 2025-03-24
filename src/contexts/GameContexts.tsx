// src/contexts/GameContext.tsx

import React, { createContext, useContext, useState } from "react";
import { GameState, TokenColor, TokenType } from "../constants/types";
import {
  DEFAULT_GAME_STATE,
  COLOR_TO_HEX_MAP,
  NIXON_CAPTURE_POSITION,
  EDITOR_CAPTURE_POSITION,
  PLAYERS,
  TOKEN_INITIAL_POSITION,
} from "../constants/index";

// 獲得されたトークンを管理するための型
export interface CapturedToken {
  type: "initiative" | "power"; // トークンタイプ
  position: number; // 獲得時の位置
  capturedAt: Date; // 獲得時刻
  capturedBy: string; // 獲得したプレイヤー (PLAYERS.NIXON or PLAYERS.EDITOR)
}

// コンテキストの型定義
interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  moveTokenBySteps: (
    tokenType: TokenType,
    tokenId: number | null,
    steps: number
  ) => void;
  getEvidenceTokenIdByColor: (colorName: TokenColor) => number | null;
  flipTokenFaceUp: (tokenId: number) => void;
  findFaceDownTokenWithColor: (colorName: TokenColor) => number | null;
  capturedTokens: CapturedToken[]; // 獲得されたトークンの配列
  animating: boolean;
}

// コンテキストの作成
const GameContext = createContext<GameContextType | null>(null);

// コンテキストプロバイダーコンポーネント
export const GameProvider: React.FC<{
  children: React.ReactNode;
  initialState?: GameState;
}> = ({ children, initialState }) => {
  const [gameState, setGameState] = useState<GameState>(
    initialState || DEFAULT_GAME_STATE
  );
  const [animating, setAnimating] = useState<boolean>(false);
  const [capturedTokens, setCapturedTokens] = useState<CapturedToken[]>([]);

  // トークンを表向きにする関数
  const flipTokenFaceUp = (tokenId: number): void => {
    setGameState((prev) => ({
      ...prev,
      evidenceTokens: prev.evidenceTokens.map((token) => {
        if (token.id === tokenId) {
          // 表向きにし、表示色を実際の色に変更
          // 複数色の場合は最初の色を表示
          const mainColor = token.colors[0];
          return {
            ...token,
            isFaceUp: true,
            displayColor:
              mainColor in COLOR_TO_HEX_MAP
                ? COLOR_TO_HEX_MAP[mainColor as TokenColor]
                : "#808080",
          };
        }
        return token;
      }),
    }));
  };

  // 裏向きで特定の色を持つトークンを検索する関数
  const findFaceDownTokenWithColor = (colorName: TokenColor): number | null => {
    const token = gameState.evidenceTokens.find(
      (t) => !t.isFaceUp && t.colors.includes(colorName)
    );
    return token ? token.id : null;
  };

  const captureToken = (
    tokenType: "initiative" | "power",
    position: number
  ): void => {
    // 獲得したプレイヤーを判定
    const isAtNixonSide = position <= NIXON_CAPTURE_POSITION;
    const isAtEditorSide = position >= EDITOR_CAPTURE_POSITION;

    if (!isAtNixonSide && !isAtEditorSide) {
      return; // 獲得条件を満たさない場合は何もしない
    }

    const capturingPlayer = isAtNixonSide ? PLAYERS.NIXON : PLAYERS.EDITOR;

    // 獲得記録を追加
    setCapturedTokens((prev) => [
      ...prev,
      {
        type: tokenType,
        position: position,
        capturedAt: new Date(),
        capturedBy: capturingPlayer,
      },
    ]);
    // トークンを初期位置に戻す
    if (tokenType === "initiative") {
      setGameState((prev) => ({
        ...prev,
        initiativeMarker: {
          ...prev.initiativeMarker,
          position: TOKEN_INITIAL_POSITION,
        },
      }));
    } else {
      // power
      setGameState((prev) => ({
        ...prev,
        powerToken: {
          ...prev.powerToken,
          position: TOKEN_INITIAL_POSITION,
        },
      }));
    }
  };

  // トークン移動関数
  const moveTokenBySteps = (
    tokenType: TokenType,
    tokenId: number | null,
    steps: number
  ): void => {
    if (animating || steps === 0) return;
    setAnimating(true);

    let currentPosition: number;
    let updateFunction: (nextPosition: number) => void;

    // トークンタイプに応じた処理を設定
    if (tokenType === "initiative") {
      currentPosition = Math.round(gameState.initiativeMarker.position);
      updateFunction = (nextPosition) => {
        // イニシアチブトークンが端に到達したかチェック
        const isAtCaptureSide =
          nextPosition <= NIXON_CAPTURE_POSITION ||
          nextPosition >= EDITOR_CAPTURE_POSITION;

        if (isAtCaptureSide) {
          captureToken("initiative", nextPosition);
        } else {
          // 通常の移動
          setGameState((prev) => ({
            ...prev,
            initiativeMarker: {
              ...prev.initiativeMarker,
              position: nextPosition,
            },
          }));
        }
      };
    } else if (tokenType === "power") {
      currentPosition = Math.round(gameState.powerToken.position);
      updateFunction = (nextPosition) => {
        // 勢力トークンが端に到達したかチェック
        const isAtCaptureSide =
          nextPosition <= NIXON_CAPTURE_POSITION ||
          nextPosition >= EDITOR_CAPTURE_POSITION;

        if (isAtCaptureSide) {
          // 獲得処理
          captureToken("power", nextPosition);
        } else {
          // 通常の移動
          setGameState((prev) => ({
            ...prev,
            powerToken: {
              ...prev.powerToken,
              position: nextPosition,
            },
          }));
        }
      };
    } else if (tokenType === "evidence" && tokenId !== null) {
      const token = gameState.evidenceTokens.find((t) => t.id === tokenId);
      if (!token) {
        setAnimating(false);
        return;
      }
      currentPosition = Math.round(token.position);
      updateFunction = (nextPosition) =>
        setGameState((prev) => ({
          ...prev,
          evidenceTokens: prev.evidenceTokens.map((t) =>
            t.id === tokenId ? { ...t, position: nextPosition } : t
          ),
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
      const nextPosition =
        distance > 0
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
    const token = gameState.evidenceTokens.find(
      (t) => t.isFaceUp && t.colors.includes(colorName)
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
    capturedTokens,
    animating,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

// カスタムフック
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
