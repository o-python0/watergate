import { TokenColor } from "../constants/types";
import { COLOR_TO_HEX_MAP } from "../constants";

/**
 * トークンの色配列から16進数カラーコードを取得するユーティリティ関数
 *
 * @param colors トークンの色配列
 * @param defaultColor デフォルトの色 (省略可)
 * @returns 16進数カラーコード
 */
export const getTokenColorHex = (
  colors: TokenColor[] | undefined,
  defaultColor = "#808080"
): string => {
  if (!colors || colors.length === 0) {
    return defaultColor;
  }

  const color = colors[0];
  return color in COLOR_TO_HEX_MAP ? COLOR_TO_HEX_MAP[color] : defaultColor;
};

/**
 * 単一色のHEXコードを取得する関数
 *
 * @param color 色
 * @returns 16進数カラーコード
 */
export const getColorHex = (color: TokenColor): string => {
  return color in COLOR_TO_HEX_MAP ? COLOR_TO_HEX_MAP[color] : "#808080";
};

/**
 * トークンの色を描画する関数
 * 複数色の場合は上下半分ずつに分けて表示
 *
 * @param ctx キャンバスコンテキスト
 * @param tokenX X座標（中心）
 * @param y Y座標（中心）
 * @param width 幅
 * @param height 高さ
 * @param colors 色の配列
 */
export const drawTokenColors = (
  ctx: CanvasRenderingContext2D,
  tokenX: number,
  y: number,
  width: number,
  height: number,
  colors: TokenColor[] | undefined
): void => {
  // 上下左右の座標を計算（中心から）
  const left = tokenX - width / 2;
  const top = y - height / 2;

  if (!colors || colors.length === 0) {
    // 色がない場合はグレーで塗りつぶし
    ctx.fillStyle = "#808080";
    ctx.fillRect(left, top, width, height);
    return;
  }

  if (colors.length === 1) {
    // 1色の場合は単色で塗りつぶし
    ctx.fillStyle = getColorHex(colors[0]);
    ctx.fillRect(left, top, width, height);
    return;
  }

  // 2色以上の場合は上下半分ずつに分けて表示
  // 上半分を最初の色で描画
  ctx.fillStyle = getColorHex(colors[0]);
  ctx.fillRect(left, top, width, height / 2);

  // 下半分を2番目の色で描画
  ctx.fillStyle = getColorHex(colors[1]);
  ctx.fillRect(left, top + height / 2, width, height / 2);
};
