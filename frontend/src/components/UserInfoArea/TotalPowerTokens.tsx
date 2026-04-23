import React from "react";

interface Props {
  count: number;
}

const TotalPowerTokens: React.FC<Props> = ({ count = 0 }) => {
  const maxCount = 5; // 最大表示数
  const actualCount = Math.min(count, maxCount);
  const powerTokens = Array(maxCount)
    .fill(0)
    .map((_, index) => (index < actualCount ? "acquired" : "empty"));

  return (
    <div className="bg-gray-200 p-4 rounded">
      <div className="flex justify-center space-x-3">
        {powerTokens.map((status, index) => (
          <div
            key={index}
            className={`w-5 h-5 rounded-full ${
              status === "acquired" ? "bg-red-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TotalPowerTokens;
