import { RefObject } from "react";
import { GameState, PlayerRole, Token } from "../constants/types";
import { drawTokenColors } from "./tokenUtils";
import { usePlayerStore } from "../store/playerStore";

const calculateTokenPosition = (
  position: number,
  cellHeight: number,
  localPlayerRole: PlayerRole
) => {
  // 座標計算を統一 (5 - position または position + 5)
  const adjustedPosition =
    localPlayerRole === PlayerRole.NIXON
      ? 5 - position // NIXONの場合: 5,-5 → 10,0
      : position + 5; // EDITORの場合: -5,5 → 0,10

  return adjustedPosition * cellHeight + cellHeight / 2;
};

const drawTrack = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  localPlayerRole: PlayerRole
) => {
  const trackWidth = canvas.width * 0.9;
  const cellHeight = canvas.height / 11;

  for (let i = 0; i < 11; i++) {
    // 数字の描画時にroleを考慮
    const position =
      localPlayerRole === PlayerRole.NIXON
        ? i <= 5
          ? 5 - i
          : i - 5
        : i <= 5
          ? i - 5
          : 5 - i;
    const y = i * cellHeight;

    ctx.fillStyle = i === 5 ? "#e5e7eb" : i % 2 === 0 ? "#f3f4f6" : "#ffffff";
    ctx.fillRect(0, y, canvas.width, cellHeight);

    if (i < 10) {
      ctx.beginPath();
      ctx.moveTo(0, y + cellHeight);
      ctx.lineTo(canvas.width, y + cellHeight);
      ctx.strokeStyle = "#d1d5db";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.fillStyle = "#CDAA7D";
    ctx.font = "42px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      Math.abs(position).toString(),
      canvas.width / 2,
      y + cellHeight / 2
    );
  }
};

const drawCircleToken = (
  ctx: CanvasRenderingContext2D,
  token: Token,
  tokenX: number,
  y: number
) => {
  const tokenSize = 18;
  ctx.beginPath();
  ctx.arc(tokenX, y, tokenSize, 0, Math.PI * 2);
  ctx.fillStyle = token.displayColor;
  ctx.fill();
  ctx.strokeStyle = token.border || "#2c3e50";
  ctx.lineWidth = 2;
  ctx.stroke();

  // ラベルの描画
  ctx.fillStyle = token.type === "power" ? "#ffffff" : "#000000";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(token.label, tokenX, y);
};

const drawEvidenceToken = (
  ctx: CanvasRenderingContext2D,
  token: Token,
  tokenX: number,
  y: number
) => {
  const width = 30;
  const height = 40;
  if (!token.isFaceUp) {
    // 裏向きトークンの描画
    ctx.fillStyle = "#000000";
    ctx.fillRect(tokenX - width / 2, y - height / 2, width, height);
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2;
    ctx.strokeRect(tokenX - width / 2, y - height / 2, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", tokenX, y);
  } else {
    // 表向きトークンの描画
    drawTokenColors(ctx, tokenX, y, width, height, token.colors);

    // 枠線を描画
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2;
    ctx.strokeRect(tokenX - width / 2, y - height / 2, width, height);

    // ラベルを描画
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(token.label, tokenX, y);
  }
};

/**
 * InvestigationTrackを描画する関数
 */
const drawInvestigationTrack = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  gameState: GameState,
  localPlayerRole: PlayerRole
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // キャンバスのサイズ調整
  const parent = canvas.parentElement;
  if (parent) {
    canvas.width = parent.clientWidth - 10;
    canvas.height = parent.clientHeight - 10;
  }

  // 背景を白で塗りつぶし
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // トラックの描画
  drawTrack(ctx, canvas, localPlayerRole);

  // オーナーがいないトークンのみをフィルタリング
  const tokens = [
    { ...gameState.initiative, type: "initiative" as const },
    { ...gameState.power, type: "power" as const },
    ...gameState.evidence,
  ]
    .filter((token) => token.owner === null)
    .sort((a, b) => a.position - b.position);

  // トークン配置の計算
  const tokenSpacing = 40;
  const totalWidth = tokens.length * tokenSpacing;

  // トークンの描画
  tokens.forEach((token, index) => {
    const cellHeight = canvas.height / 11;
    const y = calculateTokenPosition(
      token.position,
      cellHeight,
      localPlayerRole
    );
    const xOffset = index * tokenSpacing - totalWidth / 2 + tokenSpacing / 2;
    const tokenX = canvas.width / 2 + xOffset;

    switch (token.type) {
      case "initiative":
      case "power":
        drawCircleToken(ctx, token, tokenX, y);
        break;
      case "evidence":
        drawEvidenceToken(ctx, token, tokenX, y);
        break;
    }
  });
};

export { drawInvestigationTrack };
