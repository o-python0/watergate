import React from "react";

interface CardIconProps {
  className?: string;
  color?: string;
  size?: number;
  count?: number;
  textColor?: string;
}

export const DeckCardIcon: React.FC<CardIconProps> = ({
  className = "",
  color = "#4CAF50",
  size = 24,
  count,
  textColor = "#ffffff",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size * 1.4} // 縦長比率を1.4に設定
    viewBox="0 0 24 34" // ビューボックスも調整
    className={className}
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="28" // 高さを増加
      rx="2"
      fill={color}
      stroke="#000000"
      strokeWidth="1.5"
    />
    {/* 枚数テキストを表示 */}
    {count !== undefined && (
      <text
        x="12"
        y="19" // 中央に配置
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="bold"
      >
        {count}
      </text>
    )}
  </svg>
);

export const DiscardCardIcon: React.FC<CardIconProps> = ({
  className = "",
  color = "#F44336",
  size = 24,
  count,
  textColor = "#ffffff",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size * 1.4} // 縦長比率を1.4に設定
    viewBox="0 0 24 34" // ビューボックスも調整
    className={className}
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="28" // 高さを増加
      rx="2"
      fill={color}
      stroke="#000000"
      strokeWidth="1.5"
    />
    {/* 枚数テキストを表示 */}
    {count !== undefined && (
      <text
        x="12"
        y="19" // 中央に配置
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="bold"
      >
        {count}
      </text>
    )}
  </svg>
);

export const ExcludedCardIcon: React.FC<CardIconProps> = ({
  className = "",
  color = "#9E9E9E",
  size = 24,
  count,
  textColor = "#ffffff",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size * 1.4} // 縦長比率を1.4に設定
    viewBox="0 0 24 34" // ビューボックスも調整
    className={className}
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="28"
      rx="2"
      fill={color}
      stroke="#000000"
      strokeWidth="1.5"
    />
    {/* バツ印を追加 */}
    <line x1="6" y1="6" x2="18" y2="28" stroke="#000000" strokeWidth="1.5" />
    <line x1="18" y1="6" x2="6" y2="28" stroke="#000000" strokeWidth="1.5" />
    {/* 枚数テキストを表示 */}
    {count !== undefined && (
      <text
        x="12"
        y="19" // 中央に配置
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="bold"
      >
        {count}
      </text>
    )}
  </svg>
);

export const TokenIcon: React.FC<CardIconProps> = ({
  className = "",
  color = "#FFC107",
  size = 24,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      fill={color}
      stroke="#000000"
      strokeWidth="1.5"
    />
  </svg>
);
