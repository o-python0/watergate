import React from "react";

const EvidenceBoard: React.FC = () => {
  return (
    <div className="w-full h-full bg-blue-500 bg-opacity-50 rounded border border-blue-600 p-4 flex flex-col">
      <h2 className="text-white font-bold text-xl text-center mb-4">
        証拠ボード
      </h2>

      <div className="flex-grow flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg mb-3">証拠ボードは現在準備中です</p>
          <p className="text-sm opacity-80">
            証拠トークンが獲得されるとここに表示されます
          </p>
        </div>
      </div>
    </div>
  );
};

export default EvidenceBoard;
