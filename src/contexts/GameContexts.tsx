// src/contexts/GameContext.tsx

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  GameState,
  PlayerInfo,
  PlayerRole,
  TokenColor,
  TokenType,
} from "../constants/types";
import {
  DEFAULT_GAME_STATE,
  NIXON_CAPTURE_POSITION,
  EDITOR_CAPTURE_POSITION,
  PLAYERS,
  TOKEN_INITIAL_POSITION,
} from "../constants/index";

// コンテキストの型定義
interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  moveTokenBySteps: (
    tokenType: TokenType,
    steps: number,
    tokenId?: number | string
  ) => void;
  getEvidenceTokenIdByColor: (colorName: TokenColor) => number | string;
  flipTokenFaceUp: (tokenId: number | string) => void;
  findFaceDownTokenWithColor: (colorName: TokenColor) => number | string;
  animating: boolean;
  localPlayerRole: PlayerRole;
  getPlayerById: (playerId: string) => PlayerInfo | undefined;
  isLocalPlayer: (playerId: string) => boolean;
}

// コンテキストの作成
const GameContext = createContext<GameContextType | null>(null);

// コンテキストプロバイダーコンポーネント
export const GameProvider: React.FC<{
  children: React.ReactNode;
  initialState?: GameState;
  initalRole?: PlayerRole;
}> = ({ children, initialState }) => {
  // 状態初期化
  const [gameState, setGameState] = useState<GameState>(() => {
    const state = initialState || DEFAULT_GAME_STATE;
    // localPlayerIdがなければ初期化
    if (!state.localPlayerId) {
      state.localPlayerId = "player1";
    }
    // playersがなければ初期化
    if (!state.players) {
      state.players = {
        player1: { id: "player1", role: PlayerRole.NIXON },
      };
    }
    return state;
  });

  // ローカルプレイヤーのロールを取得
  const localPlayerRole = useMemo(() => {
    return gameState.players[gameState.localPlayerId]?.role || PlayerRole.NIXON; // デフォルト値を直接指定
  }, [gameState.players, gameState.localPlayerId]);

  // プレイヤー取得関数
  const getPlayerById = useCallback(
    (playerId: string) => {
      return gameState.players[playerId];
    },
    [gameState.players]
  );

  // ローカルプレイヤーチェック関数
  const isLocalPlayer = useCallback(
    (playerId: string) => {
      return playerId === gameState.localPlayerId;
    },
    [gameState.localPlayerId]
  );

  const [animating, setAnimating] = useState<boolean>(false);

  // トークンを表向きにする関数
  const flipTokenFaceUp = (tokenId: number | string): void => {
    setGameState((prev) => ({
      ...prev,
      evidence: prev.evidence.map((token) => {
        if (token.id === tokenId) {
          return {
            ...token,
            isFaceUp: true,
          };
        }
        return token;
      }),
    }));
  };

  // 裏向きで特定の色を持つトークンを検索する関数
  const findFaceDownTokenWithColor = (
    colorName: TokenColor
  ): number | string => {
    const token = gameState.evidence.find(
      (t) => !t.isFaceUp && t.colors!.includes(colorName)
    );
    return token ? token.id : "";
  };

  // トークン獲得処理の関数
  const captureToken = (
    tokenType: "initiative" | "power",
    position: number
  ): void => {
    // 獲得した陣営を判定
    const isNixonCapture = position === NIXON_CAPTURE_POSITION;
    const isEditorCapture = position === EDITOR_CAPTURE_POSITION;

    if (!isNixonCapture && !isEditorCapture) return;

    // 獲得プレイヤーのIDを決定
    const capturingPlayerId = isNixonCapture ? "player1" : "player2";

    setGameState((prev) => {
      const updatedState = { ...prev };

      // トークンの所有者を更新
      if (tokenType === "initiative") {
        updatedState.initiative.owner = capturingPlayerId;
      } else if (tokenType === "power") {
        updatedState.power.owner = capturingPlayerId;
      }

      // プレイヤーの獲得トークン情報を更新
      const currentPlayerInfo = updatedState.players[capturingPlayerId];

      // 今ラウンドで獲得したトークンに追加
      currentPlayerInfo.roundCapturedTokens = [
        ...(currentPlayerInfo.roundCapturedTokens || []),
        tokenType,
      ];

      return updatedState;
    });
  };

  // トークン移動関数
  const moveTokenBySteps = (
    tokenType: TokenType,
    steps: number,
    tokenId?: number | string
  ): void => {
    if (animating || steps === 0) return;
    setAnimating(true);

    let currentPosition: number;
    let updateFunction: (nextPosition: number) => void;

    // トークンタイプに応じた処理を設定
    if (tokenType === "initiative") {
      // イニシアチブ
      currentPosition = Math.round(gameState.initiative.position);
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
            initiative: {
              ...prev.initiative,
              position: nextPosition,
            },
          }));
        }
      };
    } else if (tokenType === "power") {
      // 勢力
      currentPosition = Math.round(gameState.power.position);
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
            power: {
              ...prev.power,
              position: nextPosition,
            },
          }));
        }
      };
    } else if (tokenType === "evidence" && tokenId !== null) {
      const token = gameState.evidence.find((t) => t.id === tokenId);
      if (!token) {
        setAnimating(false);
        return;
      }
      currentPosition = Math.round(token.position);
      updateFunction = (nextPosition) =>
        setGameState((prev) => ({
          ...prev,
          evidence: prev.evidence.map((t) =>
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
  const getEvidenceTokenIdByColor = (
    colorName: TokenColor
  ): number | string => {
    // 表向きのトークンのうち、指定された色を持つものを検索
    const token = gameState.evidence.find(
      (t) => t.isFaceUp && t.colors!.includes(colorName)
    );

    return token ? token.id : "";
  };

  // コンテキスト値
  const contextValue: GameContextType = {
    gameState,
    setGameState,
    moveTokenBySteps,
    getEvidenceTokenIdByColor,
    flipTokenFaceUp,
    findFaceDownTokenWithColor,
    animating,
    localPlayerRole,
    getPlayerById,
    isLocalPlayer,
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
