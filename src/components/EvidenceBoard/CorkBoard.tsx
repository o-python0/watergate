// src/components/EvidenceBoard/CorkBoard.tsx
import React, { useMemo } from "react";
import BoardPin from "./BoradPin";

interface CorkBoardProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

const CorkBoard: React.FC<CorkBoardProps> = ({ width, height, children }) => {
  // コルクパターンを一度だけ生成して再レンダリング時に変わらないようにする
  const corkCircles = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        cx: Math.random() * 100,
        cy: Math.random() * 100,
        r: Math.random() * 2 + 0.5,
        fill: Math.random() > 0.5 ? "#D2B48C" : "#BC8F8F",
        opacity: Math.random() * 0.3 + 0.1,
      })),
    []
  );

  const renderCorkPattern = () => (
    <defs>
      <pattern
        id="cork-pattern"
        patternUnits="userSpaceOnUse"
        width="100"
        height="100"
      >
        <rect width="100" height="100" fill="#CDAA7D" />
        {corkCircles.map((circle, i) => (
          <circle
            key={i}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            fill={circle.fill}
            opacity={circle.opacity}
          />
        ))}
      </pattern>
    </defs>
  );

  return (
    <svg
      width={width}
      height={height}
      className="w-full h-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* コルクボードのテクスチャ定義 */}
      {renderCorkPattern()}

      {/* 背景：コルクボード */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#cork-pattern)"
      />

      {/* 四隅の画鋲 */}
      <BoardPin x={20} y={20} />
      <BoardPin x={width - 20} y={20} />
      <BoardPin x={20} y={height - 20} />
      <BoardPin x={width - 20} y={height - 20} />

      {children}
    </svg>
  );
};

export default CorkBoard;
