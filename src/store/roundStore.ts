// src/store/roundStore.ts
import { create } from "zustand";
import { useGameStore } from "./gameStore";
import { useTokenStore } from "./tokenStore";
import { usePlayerStore } from "./playerStore";
import { fetchHandByRole } from "../services/deckService";
import { TOKEN_INITIAL_POSITION } from "../constants";
import { PlayerInfo, PlayerRole } from "../constants/types";

// ゲームフェーズの定義
export enum GamePhase {
  PREPARATION = "preparation",
  CARD = "card",
  EVALUATION = "evaluation",
}

// ラウンド管理に関するストアの型定義
interface RoundStore {
  // 状態
  currentRound: number;
  currentPhase: GamePhase;
  currentPlayerTurn: string | null;
  remainingTurns: number;
  preparationPhaseComplete: boolean;
  cardPhaseComplete: boolean;
  evaluationPhaseComplete: boolean;
  isAutoProgressEnabled: boolean;

  // アクション
  startNewRound: () => void;
  startPreparationPhase: () => Promise<void>;
  completePreparationPhase: () => void;
  startCardPhase: () => void;
  playCard: (cardId: string) => void;
  endTurn: () => void;
  completeCardPhase: () => void;
  startEvaluationPhase: () => void;
  completeEvaluationPhase: () => void;
  setAutoProgress: (enabled: boolean) => void;
  skipCurrentTurn: () => void;
  resetRoundCapturedTokens: () => void;

  // 内部実装
  _resetTokenPositions: () => void;
  _determineInitiative: () => string;
  _dealCards: (firstPlayerId: string) => Promise<void>;
  _processTurnChange: () => void;
  _returnNeutralTokensToPool: () => void;
  _captureInitiativeToken: () => void;
  _capturePowerToken: () => void;
  _resetInitiativeAndPowerTokens: () => void;
  _captureEvidenceTokens: () => void;
}

export const useRoundStore = create<RoundStore>((set, get) => ({
  // 初期状態
  currentRound: 0,
  currentPhase: GamePhase.PREPARATION,
  currentPlayerTurn: null,
  remainingTurns: 9, // 先攻5手番、後攻4手番の合計
  preparationPhaseComplete: false,
  cardPhaseComplete: false,
  evaluationPhaseComplete: false,
  isAutoProgressEnabled: true, // 自動進行フラグ

  // 新しいラウンドを開始
  startNewRound: () => {
    const nextRound = get().currentRound + 1;
    set({
      currentRound: nextRound,
      currentPhase: GamePhase.PREPARATION,
      preparationPhaseComplete: false,
      cardPhaseComplete: false,
      evaluationPhaseComplete: false,
    });

    get().startPreparationPhase();
  },

  // 準備フェーズを開始
  startPreparationPhase: async () => {
    console.log("準備フェーズ開始(ラウンド：", get().currentRound);
    const { gameState } = useGameStore.getState();
    console.log(gameState.firstPlayerId);
    console.log(gameState.initiative.owner);
    set({ currentPhase: GamePhase.PREPARATION });

    // 1. 初回のイニシアチブの判定
    let firstPlayerId: string;

    if (get().currentRound === 1) {
      // 1ラウンド目の処理
      const { players } = usePlayerStore.getState();
      // ロールが NIXON のプレイヤーを検索
      firstPlayerId =
        Object.keys(players).find(
          (id) => players[id].role === PlayerRole.NIXON
        ) || "player1";

      // 決定した先攻プレイヤーID を gameState に保存
      useGameStore.getState().setGameState((state) => ({
        ...state,
        firstPlayerId: firstPlayerId,
      }));
    } else {
      firstPlayerId = gameState.firstPlayerId;
    }
    console.log("このラウンドの先攻プレイヤー: ", firstPlayerId);

    // 2. トークン位置のリセット
    get()._resetTokenPositions();

    // 3. 手札の配布
    await get()._dealCards(firstPlayerId);

    // 準備フェーズの完了（自動進行設定の場合はカードフェーズに進む）
    get().completePreparationPhase();
  },

  // 準備フェーズを完了
  completePreparationPhase: () => {
    console.log("準備フェーズ完了");
    set({ preparationPhaseComplete: true });

    // 自動進行が有効ならカードフェーズへ
    if (get().isAutoProgressEnabled) {
      get().startCardPhase();
    }
  },

  // カードフェーズを開始
  startCardPhase: () => {
    console.log("カードフェーズ開始");
    const firstPlayerId = useGameStore.getState().gameState.firstPlayerId;

    set({
      currentPhase: GamePhase.CARD,
      currentPlayerTurn: firstPlayerId,
      remainingTurns: 9, // 先攻5手番、後攻4手番の合計
      cardPhaseComplete: false,
    });
  },

  // カードをプレイ
  playCard: (cardId: string) => {
    // カードプレイのロジックは実装済みのものを使用
    // カードプレイ後、自動的に手番を終了
    get().endTurn();
  },

  // 現在の手番を終了し、次のプレイヤーへ
  endTurn: () => {
    const remainingTurns = get().remainingTurns - 1;
    set({ remainingTurns });

    // 残り手番が0ならカードフェーズ完了
    if (remainingTurns <= 0) {
      get().completeCardPhase();
    } else {
      // そうでなければプレイヤーターンを交代
      get()._processTurnChange();
    }
  },

  // カードフェーズを完了
  completeCardPhase: () => {
    console.log("カードフェーズ完了");
    set({ cardPhaseComplete: true });

    // 自動進行が有効なら評価フェーズへ
    if (get().isAutoProgressEnabled) {
      get().startEvaluationPhase();
    }
  },

  // 評価フェーズを開始
  startEvaluationPhase: () => {
    console.log("評価フェーズ開始");
    set({
      currentPhase: GamePhase.EVALUATION,
      evaluationPhaseComplete: false,
    });

    // // 1. 中立証拠トークンの袋への返却
    // get()._returnNeutralTokensToPool();

    // 2. イニシアチブトークンの獲得
    get()._captureInitiativeToken();

    // // 3. 勢力トークンの獲得
    // get()._capturePowerToken();

    // // 4. トークンの再配置
    // 多分削除
    // get()._resetInitiativeAndPowerTokens();

    // // 5. 証拠トークンの獲得
    // get()._captureEvidenceTokens();

    // このラウンドに獲得したトークンのリセット処理
    get().resetRoundCapturedTokens();

    // 評価フェーズの完了
    get().completeEvaluationPhase();
  },

  // 評価フェーズを完了
  completeEvaluationPhase: () => {
    console.log("評価フェーズ完了");
    set({ evaluationPhaseComplete: true });

    // 自動進行が有効なら次のラウンドを開始
    if (get().isAutoProgressEnabled) {
      get().startNewRound();
    }
  },

  // 自動進行の設定
  setAutoProgress: (enabled) => {
    set({ isAutoProgressEnabled: enabled });
  },

  // 内部実装: トークン位置のリセット
  _resetTokenPositions: () => {
    useGameStore.getState().setGameState((state) => ({
      ...state,
      initiative: {
        ...state.initiative,
        position: TOKEN_INITIAL_POSITION,
        owner: null,
      },
      power: {
        ...state.power,
        position: TOKEN_INITIAL_POSITION,
        owner: null,
      },
    }));
  },

  // 内部実装: イニシアチブの判定
  _determineInitiative: () => {
    const { gameState } = useGameStore.getState();
    const { players } = usePlayerStore.getState();
    // 初回の先攻プレイヤーを判定する

    // // イニシアチブトークンがどちらかのプレイヤーに獲得されている場合、そのプレイヤーを先攻に
    // if (gameState.initiative.owner) {
    //   return gameState.initiative.owner;
    // }

    // 1ラウンド目はニクソン側を先攻にする
    if (get().currentRound === 1) {
      return (
        Object.keys(players).find(
          (id) => players[id].role === PlayerRole.NIXON
        ) || "player1"
      );
    }

    return gameState.localPlayerId;
  },

  // 内部実装: 手札の配布
  _dealCards: async (firstPlayerId: string) => {
    const { players } = usePlayerStore.getState();
    const secondPlayerId = Object.keys(players).find(
      (id) => id !== firstPlayerId
    );

    if (!secondPlayerId) return;

    // プレイヤーの役割を取得
    const firstPlayerRole = players[firstPlayerId].role;
    const secondPlayerRole = players[secondPlayerId].role;

    // 先攻プレイヤーに5枚のカードを配布
    const firstPlayerCards = await fetchHandByRole(firstPlayerRole);

    // 後攻プレイヤーに4枚のカードを配布
    const secondPlayerCards = await fetchHandByRole(secondPlayerRole);
    secondPlayerCards.pop(); // 5枚から1枚除去して4枚に調整

    // プレイヤーストアを更新
    usePlayerStore.getState().setPlayers({
      ...players,
      [firstPlayerId]: {
        ...players[firstPlayerId],
        hand: firstPlayerCards,
      },
      [secondPlayerId]: {
        ...players[secondPlayerId],
        hand: secondPlayerCards,
      },
    });
  },

  // 内部実装: プレイヤーターンの交代
  _processTurnChange: () => {
    const { players } = usePlayerStore.getState();
    const currentPlayerId = get().currentPlayerTurn;

    if (!currentPlayerId) return;

    // 次のプレイヤーIDを取得
    const nextPlayerId = Object.keys(players).find(
      (id) => id !== currentPlayerId
    );

    if (nextPlayerId) {
      set({ currentPlayerTurn: nextPlayerId });
    }
  },

  // 内部実装: 中立証拠トークンの袋への返却
  _returnNeutralTokensToPool: () => {
    useGameStore.getState().setGameState((state) => ({
      ...state,
      evidence: state.evidence.map((token) =>
        token.position === 0
          ? { ...token, position: TOKEN_INITIAL_POSITION }
          : token
      ),
    }));
  },

  // 内部実装: イニシアチブトークンの獲得と次のラウンドの先攻プレイヤーの決定
  _captureInitiativeToken: () => {
    const { gameState } = useGameStore.getState();
    const { players, findPlayerByRole } = usePlayerStore.getState();
    const { initiative } = gameState;

    let ownerPlayerId: string | null = null;

    // 位置に基づいて獲得プレイヤーを決定
    if (initiative.position < 0) {
      // ニクソン側の獲得
      ownerPlayerId = findPlayerByRole(PlayerRole.NIXON);
    } else if (initiative.position > 0) {
      // エディター側の獲得
      ownerPlayerId = findPlayerByRole(PlayerRole.EDITOR);
    } else {
      // スペース0の場合は非先攻プレイヤーが獲得
      const firstPlayerId = gameState.firstPlayerId;
      ownerPlayerId =
        Object.keys(players).find((id) => id !== firstPlayerId) || null;
    }

    if (ownerPlayerId) {
      // firstPlayerIdのみを更新
      useGameStore.getState().setGameState((state) => ({
        ...state,
        firstPlayerId: ownerPlayerId!, // イニシアチブトークン所有者を次の先攻プレイヤーに設定
      }));
    }
  },

  // 内部実装: 勢力トークンの獲得
  // TODO:勢力トークン獲得時の各陣営の特殊効果の処理
  _capturePowerToken: () => {
    const { gameState } = useGameStore.getState();
    const { players } = usePlayerStore.getState();
    const { power } = gameState;

    // スペース0の場合は獲得しない
    if (power.position === 0) return;

    let ownerPlayerId: string | null = null;

    // 位置に基づいて獲得プレイヤーを決定
    if (power.position < 0) {
      // ニクソン側の獲得
      ownerPlayerId =
        Object.keys(players).find(
          (id) => players[id].role === PlayerRole.NIXON
        ) || null;
    } else if (power.position > 0) {
      // エディター側の獲得
      ownerPlayerId =
        Object.keys(players).find(
          (id) => players[id].role === PlayerRole.EDITOR
        ) || null;
    }

    if (ownerPlayerId) {
      // 合計勢力トークン数を更新
      // TODO:残り勢力トークン数を-1する
      const player = players[ownerPlayerId];
      if (player) {
        usePlayerStore.getState().setPlayers({
          ...players,
          [ownerPlayerId]: {
            ...player,
            roundCapturedTokens: [
              ...(player.roundCapturedTokens || []),
              "power",
            ],
            powerTokensCaptured: (player.powerTokensCaptured || 0) + 1,
          },
        });
      }
    }
  },

  // 内部実装: イニシアチブと勢力トークンの再配置
  // TODO:残り勢力トークン数を確認する(0の場合はニクソン側が勝利する)
  _resetInitiativeAndPowerTokens: () => {
    useGameStore.getState().setGameState((state) => ({
      ...state,
      initiative: {
        ...state.initiative,
        position: TOKEN_INITIAL_POSITION,
      },
      power: {
        ...state.power,
        position: TOKEN_INITIAL_POSITION,
      },
    }));
  },

  // 内部実装: 証拠トークンの獲得
  _captureEvidenceTokens: () => {
    const { gameState } = useGameStore.getState();
    const { players } = usePlayerStore.getState();

    // イニシアチブ所有プレイヤーから順に処理するため、所有者を特定
    const initiativeOwnerId = gameState.initiative.owner;
    const playerIds = initiativeOwnerId
      ? [
          initiativeOwnerId,
          ...Object.keys(players).filter((id) => id !== initiativeOwnerId),
        ]
      : Object.keys(players);

    // 証拠トークンの獲得処理
    useGameStore.getState().setGameState((state) => {
      // 更新後の状態
      let updatedState = { ...state };

      // 各プレイヤーの証拠トークン獲得を処理
      playerIds.forEach((playerId) => {
        const playerRole = players[playerId].role;
        const playerSide = playerRole === PlayerRole.NIXON ? -1 : 1;

        // プレイヤー側の証拠トークンを特定
        const playerSideTokens = state.evidence.filter(
          (token) =>
            (playerSide < 0 && token.position <= -5) ||
            (playerSide > 0 && token.position >= 5)
        );

        // トークンの所有者を設定し、位置を更新
        playerSideTokens.forEach((token) => {
          // トークンのisFaceUpを適切に設定（エディター側は表向き、ニクソン側は裏向き）
          const tokenFaceUp = playerRole === PlayerRole.EDITOR;

          // 証拠トークンを更新
          updatedState.evidence = updatedState.evidence.map((t) =>
            t.id === token.id
              ? {
                  ...t,
                  owner: playerId,
                  position: TOKEN_INITIAL_POSITION,
                  isFaceUp: tokenFaceUp,
                }
              : t
          );

          // シンボル付きトークンの特殊効果（例: 勢力トークンを移動）
          // この実装は要件に応じてカスタマイズ
        });
      });

      return updatedState;
    });
  },
  // このラウンドで獲得したトークンをリセットする
  resetRoundCapturedTokens: () => {
    const { players } = usePlayerStore.getState();

    // 各プレイヤーの roundCapturedTokens を空配列にリセット
    const updatedPlayers: Record<string, PlayerInfo> = Object.entries(
      players
    ).reduce(
      (acc: Record<string, PlayerInfo>, [playerId, player]) => {
        acc[playerId] = {
          ...player,
          roundCapturedTokens: [],
        };
        return acc;
      },
      {} as Record<string, PlayerInfo>
    );

    usePlayerStore.getState().setPlayers(updatedPlayers);
  },

  // 開発用：ターンをスキップする
  skipCurrentTurn: () => {
    const remainingTurns = get().remainingTurns - 1;
    set({ remainingTurns });

    // 残り手番が0ならカードフェーズ完了
    if (remainingTurns <= 0) {
      get().completeCardPhase();
    } else {
      // そうでなければプレイヤーターンを交代
      get()._processTurnChange();
    }
  },
}));

// ラウンド関連の便利なセレクタ関数
export const getCurrentPhase = (state: RoundStore) => state.currentPhase;
export const getCurrentPlayerTurn = (state: RoundStore) =>
  state.currentPlayerTurn;
export const isPlayerTurn = (playerId: string) =>
  useRoundStore.getState().currentPlayerTurn === playerId;
