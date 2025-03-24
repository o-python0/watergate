import { TokenColor } from "../constants/types";

// 色のHEXコードを取得する関数
export const getColorHex = (color: TokenColor): string => {
  switch (color) {
    case "red":
      return "#e74c3c";
    case "blue":
      return "#3498db";
    case "green":
      return "#2ecc71";
    default:
      return "#808080";
  }
};
