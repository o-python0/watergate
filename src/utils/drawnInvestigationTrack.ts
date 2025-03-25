import { RefObject } from "react";
import { GameState, TokenColor } from "../constants/types";
import { drawTokenColors } from "./tokenUtils";

type Token = {
  id: string | number;
  type: "evidence" | "power" | "initiative";
  position: number;
  colors?: TokenColor[];
  displayColor: string;
  border?: string;
  label: string;
  isFaceUp?: boolean;
};

const calculateTokenPosition = (position: number, cellHeight: number) => {
  return (5 - position) * cellHeight + cellHeight / 2;
};

const drawTrack = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  const trackWidth = canvas.width * 0.9;
  const cellHeight = canvas.height / 11;

  for (let i = 0; i < 11; i++) {
    const position = i <= 5 ? 5 - i : i - 5;
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

const drawInvestigationTrack = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  gameState: GameState
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const parent = canvas.parentElement;
  if (parent) {
    canvas.width = parent.clientWidth - 10;
    canvas.height = parent.clientHeight - 10;
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawTrack(ctx, canvas);

  const tokens = [gameState.initiative, gameState.power, ...gameState.evidence];
  const tokenSpacing = 40;
  const totalWidth = tokens.length * tokenSpacing;

  tokens.forEach((token, index) => {
    const cellHeight = canvas.height / 11;
    const y = calculateTokenPosition(token.position, cellHeight);
    const xOffset = index * tokenSpacing - totalWidth / 2 + tokenSpacing / 2;
    const tokenX = canvas.width / 2 + xOffset;

    if (token.type === "evidence") {
      drawEvidenceToken(ctx, token, tokenX, y);
    } else {
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
    }
  });
};

export { drawInvestigationTrack };
