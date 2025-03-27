// src/components/UserInfo.tsx
import React from "react";
import {
  DeckCardIcon,
  DiscardCardIcon,
  ExcludedCardIcon,
} from "../../assets/icons";
import { PlayerRole } from "../../constants/types";
import { useGameStore } from "../../store/gameStore";
import { usePlayerStore } from "../../store/playerStore";
import RoundCapturedTokens from "./RoundCaputuredTokens";

interface Props {
  isLocalPlayer?: boolean;
}

const UserInfo: React.FC<Props> = ({ isLocalPlayer }) => {
  // プレイヤー情報を取得
  const { players } = usePlayerStore();
  const localPlayerId = useGameStore((state) => state.getLocalPlayerId());

  // ローカルプレイヤーと相手プレイヤーを決定
  const currentPlayerId = isLocalPlayer
    ? localPlayerId
    : Object.keys(players).find((id) => id !== localPlayerId) || "";

  const playerInfo = players[currentPlayerId];

  // 役割に基づいたスタイルと表示を決定
  const isNixonRole = playerInfo?.role === PlayerRole.NIXON;
  const playerLabel = isNixonRole ? "ニクソン側" : "編集者側";

  // 役割に基づいたスタイリング
  const bgColor = isNixonRole ? "bg-red-100" : "bg-blue-100";
  const borderColor = isNixonRole ? "border-red-300" : "border-blue-300";
  const textColor = isNixonRole ? "text-red-800" : "text-blue-800";

  // プレイヤー情報がない場合は何も表示しない
  if (!playerInfo) return null;

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
            capturedTokens={playerInfo.roundCapturedTokens || []}
          />
        </div>
        {/* 各カード枚数情報 */}
        <div className="bg-gray-200 p-1 rounded flex justify-around items-center">
          <DeckCardIcon count={playerInfo.remainingDeckCards || 0} />
          <DiscardCardIcon count={playerInfo.discardedCards?.length || 0} />
          <ExcludedCardIcon count={playerInfo.excludedCards?.length || 0} />
        </div>
        {/* 勢力トークン獲得数 */}
        <div className="bg-gray-200 p-1 rounded">
          <div className="font-medium">勢力トークン獲得数</div>
          <div className="text-gray-600 text-xs">
            {playerInfo.powerTokensCaptured || 0}個
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
