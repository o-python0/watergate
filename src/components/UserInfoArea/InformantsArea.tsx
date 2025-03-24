// src/components/InformantsArea.tsx
import React from "react";

const InformantsArea: React.FC = () => {
  return (
    <div className="bg-yellow-100 border border-yellow-300 rounded h-full p-3">
      <h3 className="text-yellow-800 font-bold text-center border-b border-yellow-300 pb-1 mb-3">
        情報提供者
      </h3>

      <div className="flex flex-col items-center justify-center h-5/6">
        {/* ここに情報提供者のコンテンツを追加 */}
        <div className="text-sm text-gray-600 text-center">
          情報提供者は現在利用できません
        </div>

        {/* プレースホルダーアイコン */}
        <div className="mt-3 p-3 bg-yellow-200 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default InformantsArea;
