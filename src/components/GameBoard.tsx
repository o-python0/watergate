import React, { useEffect } from "react";
import { useRoundStore } from "../store/roundStore";
import EvidenceBoard from "./EvidenceBoard/EvidenveBoard";
import InvestigationTrack from "./InvestigationTrack/InvestigationTrack";
import PlayerCardsArea from "./PlayerCardsArea/PlayerCardsArea";
import UserInfoArea from "./UserInfoArea/UserInfoArea";

const GameBoard: React.FC = () => {
  const { startNewRound, currentRound } = useRoundStore();

  useEffect(() => {
    if (currentRound === 0) {
      startNewRound();
    }
  }, []);
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 p-2 overflow-hidden">
      {/* メインエリア（上部） */}
      <div className="flex flex-grow overflow-hidden">
        {/* 左エリア：UserInfoArea */}
        <div className="w-1/5 h-full overflow-hidden">
          <UserInfoArea />
        </div>

        {/* 中央エリア：証拠ボードと手札 */}
        <div className="w-3/5 px-2 h-full flex flex-col">
          {/* 証拠ボード */}
          <div className="flex-grow mb-2">
            <EvidenceBoard />
          </div>

          {/* プレイヤーカード - 証拠ボードと同じ幅、高さを増加 */}
          <div className="h-64">
            <PlayerCardsArea />
          </div>
        </div>

        {/* 右エリア：調査トラック */}
        <div className="w-1/5 h-full overflow-hidden">
          <InvestigationTrack />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
