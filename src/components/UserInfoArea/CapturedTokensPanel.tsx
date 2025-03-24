// src/components/CapturedTokensPanel.tsx

import React from "react";
import { PLAYERS } from "../../constants";
import { CapturedToken, useGame } from "../../contexts/GameContexts";

const CapturedTokensPanel: React.FC = () => {
  const { capturedTokens } = useGame();

  // プレイヤーごとにトークンを分類
  const nixonTokens = capturedTokens.filter(
    (token) => token.capturedBy === PLAYERS.NIXON
  );
  const editorTokens = capturedTokens.filter(
    (token) => token.capturedBy === PLAYERS.EDITOR
  );

  // トークンを表示するヘルパー関数
  const renderToken = (token: CapturedToken, index: number) => {
    // トークンのスタイル
    const tokenStyle = {
      backgroundColor: token.type === "power" ? "#e74c3c" : "#ffffff",
      borderColor: "#2c3e50",
      color: token.type === "power" ? "#ffffff" : "#000000",
    };

    return (
      <div key={index} className="mb-2">
        <div className="p-2 border rounded bg-gray-50">
          <div className="flex items-center">
            {/* トークン */}
            <div
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mr-2"
              style={tokenStyle}
            >
              {token.type === "initiative" ? "I" : "P"}
            </div>

            {/* 獲得情報 */}
            <div className="text-sm">
              <div>
                {token.type === "initiative"
                  ? "イニシアチブマーカー"
                  : "勢力トークン"}
              </div>
              <div className="text-gray-500 text-xs">
                位置: {token.position} /{" "}
                {new Date(token.capturedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 p-4 border-r border-gray-300 w-64 h-screen overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-center">獲得トークン</h2>

      {/* ニクソン側の獲得トークン */}
      <div className="mb-6">
        <h3 className="font-medium text-red-800 border-b border-red-300 pb-1 mb-2">
          ニクソン側
        </h3>
        {nixonTokens.length > 0 ? (
          nixonTokens.map((token, index) => renderToken(token, index))
        ) : (
          <div className="text-gray-500 text-sm italic">
            まだ獲得されたトークンはありません
          </div>
        )}
      </div>

      {/* 編集者側の獲得トークン */}
      <div className="mb-6">
        <h3 className="font-medium text-blue-800 border-b border-blue-300 pb-1 mb-2">
          編集者側
        </h3>
        {editorTokens.length > 0 ? (
          editorTokens.map((token, index) => renderToken(token, index))
        ) : (
          <div className="text-gray-500 text-sm italic">
            まだ獲得されたトークンはありません
          </div>
        )}
      </div>

      {/* 統計情報 */}
      {capturedTokens.length > 0 && (
        <div className="mt-6 p-2 bg-gray-200 rounded">
          <h3 className="font-medium text-gray-700 mb-1">統計</h3>
          <div className="text-sm">
            <div>ニクソン: {nixonTokens.length} トークン</div>
            <div>編集者: {editorTokens.length} トークン</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapturedTokensPanel;
