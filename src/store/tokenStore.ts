// src/store/tokenStore.ts
import { create } from "zustand";
import { TokenType, TokenColor } from "../constants/types";
import { useGameStore } from "./gameStore";
import { usePlayerStore } from "./playerStore";

// トークン操作に関するストアの型定義
interface TokenStore {
  // アクション
  moveToken: (
    tokenType: TokenType,
    steps: number,
    tokenId?: number | string
  ) => void;
  flipTokenFaceUp: (tokenId: number | string) => void;
  findFaceDownTokenWithColor: (colorName: TokenColor) => number | string | null;
  getEvidenceTokenIdByColor: (colorName: TokenColor) => number | string | null;

  // 内部実装
  moveTokenBySteps: (
    tokenType: TokenType,
    steps: number,
    tokenId?: number | string
  ) => void;
  _captureToken: (
    tokenType: TokenType,
    position: number,
    tokenId?: number | string
  ) => void;
}

// トークン関連の機能を持つストア
export const useTokenStore = create<TokenStore>((set, get) => ({
  // トークン移動のパブリックAPI
  moveToken: (tokenType, steps, tokenId) => {
    // animatingフラグを直接チェック
    if (useGameStore.getState().animating || steps === 0) return;

    // 実際の移動処理を呼び出し
    get().moveTokenBySteps(tokenType, steps, tokenId);
  },

  // トークンを表向きにする
  flipTokenFaceUp: (tokenId) => {
    useGameStore.getState().setGameState((state) => ({
      ...state,
      evidence: state.evidence.map((token) =>
        token.id === tokenId ? { ...token, isFaceUp: true } : token
      ),
    }));
  },

  // 裏向きの証拠トークンを色で検索
  findFaceDownTokenWithColor: (colorName) => {
    const { gameState } = useGameStore.getState();
    const token = gameState.evidence.find(
      (t) => !t.isFaceUp && t.colors!.includes(colorName)
    );
    return token ? token.id : null;
  },

  // 表向きの証拠トークンを色で検索
  getEvidenceTokenIdByColor: (colorName) => {
    const { gameState } = useGameStore.getState();
    const token = gameState.evidence.find(
      (t) => t.isFaceUp && t.colors!.includes(colorName)
    );
    return token ? token.id : null;
  },

  // トークン移動の内部実装
  moveTokenBySteps: (tokenType, steps, tokenId) => {
    useGameStore.getState().setAnimating(true);

    // 現在位置の取得
    const currentPosition = getTokenPosition(tokenType, tokenId);
    if (currentPosition === null) {
      useGameStore.getState().setAnimating(false);
      return;
    }

    // 新しい位置を計算
    const newPosition = calculateNewPosition(currentPosition, steps);

    // 移動が不要な場合はスキップ
    if (currentPosition === newPosition) {
      useGameStore.getState().setAnimating(false);
      return;
    }

    const distance = newPosition - currentPosition;
    const absoluteSteps = Math.abs(distance);

    // アニメーションステップ
    let currentStep = 0;
    const stepDuration = 200;

    const animateStep = () => {
      currentStep++;

      // 次の位置を計算
      const nextPosition =
        distance > 0
          ? currentPosition + currentStep
          : currentPosition - currentStep;

      // トークン位置を更新
      updateTokenPosition(tokenType, nextPosition, tokenId);

      // アニメーション継続または終了
      if (currentStep < absoluteSteps) {
        setTimeout(animateStep, stepDuration);
      } else {
        useGameStore.getState().setAnimating(false);
      }
    };

    // アニメーション開始
    if (absoluteSteps > 0) {
      setTimeout(animateStep, 10);
    } else {
      useGameStore.getState().setAnimating(false);
    }
  },

  // トークン獲得内部実装
  _captureToken: (tokenType, position, tokenId) => {
    // 獲得判定とownerの変更処理
    const capturingPlayerId = getCapturePlayerId(position);
    if (!capturingPlayerId) return;

    // トークンのオーナーを更新
    const updateToken = () => {
      useGameStore.getState().setGameState((state) => {
        if (tokenType === "evidence" && tokenId) {
          return {
            ...state,
            evidence: state.evidence.map((t) =>
              t.id === tokenId
                ? { ...t, position, owner: capturingPlayerId }
                : t
            ),
          };
        } else if (tokenType !== "evidence") {
          return {
            ...state,
            [tokenType]: { ...state[tokenType], owner: capturingPlayerId },
          };
        }
        return state;
      });
    };

    updateToken();

    // "initiative"または"power"トークンの場合、ラウンドで獲得したトークンを追加
    if (tokenType === "initiative" || tokenType === "power") {
      // playerStoreからプレイヤー情報を取得
      const { players } = usePlayerStore.getState();
      const player = players[capturingPlayerId];

      if (player) {
        const updatedPlayer = {
          ...player,
          roundCapturedTokens: [
            ...(player.roundCapturedTokens || []),
            tokenType,
          ],
        };

        // プレイヤー情報を更新
        usePlayerStore.getState().setPlayers({
          ...players,
          [capturingPlayerId]: updatedPlayer,
        });
      }
    }
  },
}));

// トークンの現在位置を取得する関数
export const getTokenPosition = (
  tokenType: TokenType,
  tokenId?: number | string
): number | null => {
  const { gameState } = useGameStore.getState();

  if (tokenType === "initiative") {
    return Math.round(gameState.initiative.position);
  } else if (tokenType === "power") {
    return Math.round(gameState.power.position);
  } else if (tokenType === "evidence" && tokenId) {
    const token = gameState.evidence.find((t) => t.id === tokenId);
    return token ? Math.round(token.position) : null;
  }
  return null;
};

// 新しい位置を計算する純粋関数
export const calculateNewPosition = (
  currentPosition: number,
  steps: number
): number => {
  return Math.max(-5, Math.min(5, currentPosition + steps));
};

// トークンが獲得マスに到達したかをチェックする関数
export const isAtCaptureSide = (position: number): boolean => {
  return position <= -5 || position >= 5;
};

// 獲得したプレイヤーIDを取得する関数
export const getCapturePlayerId = (position: number): string => {
  const { players } = usePlayerStore.getState();
  // position位置に基づいてプレイヤーIDを決定
  if (position <= -5) {
    // ニクソン側のプレイヤーを特定
    const nixonPlayerId = Object.keys(players).find(
      (id) => players[id].role === "nixon"
    );
    return nixonPlayerId || "player1";
  } else if (position >= 5) {
    // エディター側のプレイヤーを特定
    const editorPlayerId = Object.keys(players).find(
      (id) => players[id].role === "editor"
    );
    return editorPlayerId || "player2";
  }
  return "player1"; // デフォルト
};

// トークン位置を更新する関数
export const updateTokenPosition = (
  tokenType: TokenType,
  position: number,
  tokenId?: number | string
): void => {
  // トークンを獲得しているか判定
  if (isAtCaptureSide(position)) {
    useTokenStore.getState()._captureToken(tokenType, position, tokenId);
  } else {
    useGameStore.getState().setGameState((state) => {
      const updatedState = { ...state };

      if (tokenType === "evidence" && tokenId) {
        updatedState.evidence = state.evidence.map((t) =>
          t.id === tokenId ? { ...t, position } : t
        );
      } else if (tokenType !== "evidence") {
        updatedState[tokenType] = {
          ...state[tokenType],
          position,
        };
      }

      return updatedState;
    });
  }
};
