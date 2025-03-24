// src/components/UserInfo.tsx
import React from "react";
import { PLAYERS } from "../../constants";
import { useGame } from "../../contexts/GameContexts";

interface UserInfoProps {
  playerType: "nixon" | "editor";
}

const UserInfo: React.FC<UserInfoProps> = ({ playerType }) => {
  const { capturedTokens } = useGame();

  // プレイヤータイプに応じた設定
  const isNixon = playerType === "nixon";
  const playerLabel = isNixon ? "ニクソン側" : "編集者側";
  const bgColor = isNixon ? "bg-red-100" : "bg-blue-100";
  const borderColor = isNixon ? "border-red-300" : "border-blue-300";
  const textColor = isNixon ? "text-red-800" : "text-blue-800";

  // 該当プレイヤーの獲得トークン数
  const playerCapturedTokens = capturedTokens.filter(
    (token) => token.capturedBy === (isNixon ? PLAYERS.NIXON : PLAYERS.EDITOR)
  );

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
          <div className="font-medium">今ラウンドで獲得したトークン</div>
          <div className="text-gray-600 text-xs">なし</div>
        </div>

        {/* 捨て札 */}
        <div className="bg-gray-200 p-1 rounded">
          <div className="font-medium">捨て札</div>
          <div className="text-gray-600 text-xs">0枚</div>
        </div>

        {/* 除外カード数 */}
        <div className="bg-gray-200 p-1 rounded">
          <div className="font-medium">除外カード数</div>
          <div className="text-gray-600 text-xs">0枚</div>
        </div>

        {/* 勢力トークン獲得数 */}
        <div className="bg-gray-200 p-1 rounded">
          <div className="font-medium">勢力トークン獲得数</div>
          <div className="text-gray-600 text-xs">
            {
              playerCapturedTokens.filter((token) => token.type === "power")
                .length
            }
            個
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
