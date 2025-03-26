// src/services/tokenService.ts
import { useGameStore } from "../store/gameStore";
import { TokenType, TokenColor } from "../constants/types";

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

// トークンが捕獲エリアに到達したかをチェックする関数
export const isAtCaptureSide = (position: number): boolean => {
  return position <= -5 || position >= 5; // 実際の値に合わせて調整
};

// 捕獲側のプレイヤーIDを取得する関数
export const getCapturePlayerId = (position: number): string => {
  return position <= -5 ? "player1" : "player2";
};

// トークン位置を更新する関数
export const updateTokenPosition = (
  tokenType: TokenType,
  position: number,
  tokenId?: number | string
): void => {
  // トークンを獲得しているか判定
  if (isAtCaptureSide(position)) {
    captureToken(tokenType, position, tokenId);
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

// 表向きの証拠トークンを色で検索する
export const getEvidenceTokenIdByColor = (
  colorName: TokenColor
): number | string => {
  const { gameState } = useGameStore.getState();
  const token = gameState.evidence.find(
    (t) => t.isFaceUp && t.colors!.includes(colorName)
  );
  return token ? token.id : "";
};

// 裏向きの証拠トークンを色で検索する
export const findFaceDownTokenWithColor = (
  colorName: TokenColor
): number | string => {
  const { gameState } = useGameStore.getState();
  const token = gameState.evidence.find(
    (t) => !t.isFaceUp && t.colors!.includes(colorName)
  );
  return token ? token.id : "";
};

// 証拠トークンを表向きにする
export const flipTokenFaceUp = (tokenId: number | string): void => {
  useGameStore.getState().setGameState((state) => ({
    ...state,
    evidence: state.evidence.map((token) =>
      token.id === tokenId ? { ...token, isFaceUp: true } : token
    ),
  }));
};

// アニメーション付きのトークン移動（内部実装）
export const moveToken = (
  tokenType: TokenType,
  steps: number,
  tokenId?: number | string
): void => {
  const store = useGameStore.getState();
  store.moveTokenBySteps(tokenType, steps, tokenId);
};

// トークン獲得処理
export const captureToken = (
  tokenType: TokenType,
  position: number,
  tokenId?: number | string
): void => {
  const { gameState } = useGameStore.getState();

  // 獲得判定とownerの変更処理
  const capturingPlayerId = getCapturePlayerId(position);
  if (!capturingPlayerId) return; // 獲得プレイヤーがいない場合は早期リターン

  // トークンのオーナーを更新
  const updateOwner = (type: TokenType) => {
    useGameStore.getState().setGameState((state) => ({
      ...state,
      [type]:
        type === "evidence"
          ? state.evidence.map((t) =>
              t.id === tokenId
                ? { ...t, position, owner: capturingPlayerId }
                : t
            )
          : { ...state[type], owner: capturingPlayerId },
    }));
  };

  updateOwner(tokenType);

  // "initiative"または"power"トークンの場合、ラウンドで獲得したトークンを追加
  if (tokenType === "initiative" || tokenType === "power") {
    const currentPlayerInfo = gameState.players[capturingPlayerId];
    const updatedPlayerInfo = {
      ...currentPlayerInfo,
      roundCapturedTokens: [
        ...(currentPlayerInfo.roundCapturedTokens || []),
        tokenType,
      ],
    };

    // プレイヤー情報を更新
    useGameStore.getState().setGameState((state) => ({
      ...state,
      players: {
        ...state.players,
        [capturingPlayerId]: updatedPlayerInfo,
      },
    }));
  }
};
