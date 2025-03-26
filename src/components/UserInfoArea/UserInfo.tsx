// src/components/UserInfo.tsx
import React from "react";
import {
  DeckCardIcon,
  DiscardCardIcon,
  ExcludedCardIcon,
} from "../../assets/icons";
import { PlayerRole } from "../../constants/types";
import { useGameStore } from "../../store/gameStore";
import RoundCapturedTokens from "./RoundCaputuredTokens";

interface Props {
  isLocalPlayer?: boolean;
}

const UserInfo: React.FC<Props> = ({ isLocalPlayer }) => {
  const { gameState } = useGameStore();

  const localPlayerRole = gameState.players[gameState.localPlayerId]?.role;

  // プレイヤータイプに応じた設定
  const isNixon = localPlayerRole === PlayerRole.NIXON;
  const currentPlayerId = isLocalPlayer
    ? isNixon
      ? "player1"
      : "player2"
    : isNixon
      ? "player2"
      : "player1";

  const playerInfo = gameState.players[currentPlayerId];

  // isLocalPlayerによって表示を切り替え
  const playerLabel = isLocalPlayer
    ? isNixon
      ? "ニクソン側"
      : "編集者側"
    : isNixon
      ? "編集者側"
      : "ニクソン側";

  const bgColor = isLocalPlayer
    ? isNixon
      ? "bg-red-100"
      : "bg-blue-100"
    : isNixon
      ? "bg-blue-100"
      : "bg-red-100";

  const borderColor = isLocalPlayer
    ? isNixon
      ? "border-red-300"
      : "border-blue-300"
    : isNixon
      ? "border-blue-300"
      : "border-red-300";

  const textColor = isLocalPlayer
    ? isNixon
      ? "text-red-800"
      : "text-blue-800"
    : isNixon
      ? "text-blue-800"
      : "text-red-800";

  return (
    <div className={`${bgColor} rounded border ${borderColor} h-full p-2`}>
      <h3
        className={`${textColor} font-bold text-center border-b ${borderColor} pb-1 mb-2`}
      >
        {playerLabel}
      </h3>

      <div className="grid grid-cols-1 gap-1 text-sm">
        {/* 今ラウンドで獲得したトークン */}
        <div className="bg-gray-200 p-1 rounded">
          <RoundCapturedTokens
            capturedTokens={playerInfo.roundCapturedTokens}
          />
        </div>

        {/* 各カード枚数情報 */}
        <div className="bg-gray-200 p-1 rounded flex justify-around items-center">
          <DeckCardIcon count={playerInfo.remainingDeckCards} />
          <DiscardCardIcon count={playerInfo.discardedCards?.length || 0} />
          <ExcludedCardIcon count={playerInfo.excludedCards?.length || 0} />
        </div>

        {/* 勢力トークン獲得数 */}
        <div className="bg-gray-200 p-1 rounded">
          <div className="font-medium">勢力トークン獲得数</div>
          <div className="text-gray-600 text-xs">
            {playerInfo.powerTokensCaptured}個
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
