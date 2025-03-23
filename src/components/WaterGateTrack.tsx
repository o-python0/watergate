import React, { useRef, useEffect, useState } from 'react';
import { testHandCards } from '../constants';
import { useGame } from '../contexts/GameContexts';
import HandCards from './playerArea/HandsCards';

// 型定義
interface TrackConfig {
  x: number;
  yStart: number;
  yEnd: number;
  width: number;
  cells: number;
}

interface Token {
  position: number;
  radius: number;
  color: string;
  border: string;
  label: string;
}

interface EvidenceToken {
  id: number;
  position: number;
  color: string;
  owner: string | null;
  label: string;
  shape: string;
}

interface GameState {
  track: TrackConfig;
  initiativeMarker: Token;
  powerToken: Token;
  evidenceTokens: EvidenceToken[];
}

type TokenType = 'initiative' | 'power' | 'evidence';

interface WatergateTrackProps {
  initialState?: GameState;
  onTokenMove?: (tokenType: TokenType, tokenId: number | null, newPosition: number) => void;
}

const WatergateTrack: React.FC<WatergateTrackProps> = ({ initialState, onTokenMove }) => {
  const { gameState } = useGame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  

  // キャンバス描画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // マス目のY座標を計算する関数（整数位置のみ）
    const getCellY = (position: number): number => {
      // positionは-5から+5の範囲の整数
      const cellIndex = position + 5; // 0から10のインデックス
      const cellCount = gameState.track.cells;
      const cellHeight = (gameState.track.yEnd - gameState.track.yStart) / (cellCount - 1);
      return gameState.track.yStart + cellIndex * cellHeight;
    };
    
    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 背景
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // タイトル
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    // ctx.fillText('ウォーターゲート - 調査トラック', canvas.width / 2, 25);
    
    // トラックの描画
    const { track } = gameState;
    
    // マス目の背景
    const x = track.x - track.width / 2;
    const cellHeight = (track.yEnd - track.yStart) / (track.cells - 1);
    
    for (let i = 0; i < track.cells; i++) {
      const y = track.yStart + i * cellHeight - cellHeight / 2;
      const position = 5 - i; // +5から-5までのポジション
      
      // マス目の背景（交互に色を変える）
      ctx.fillStyle = i % 2 === 0 ? '#ecf0f1' : '#e0e0e0';
      
      // 中央のマス目は特別な色に
      if (position === 0) {
        ctx.fillStyle = '#d5dbdb';
      }
      
      // マス目を描画（位置を調整してマス目間に隙間を作る）
      ctx.fillRect(x, y, track.width, cellHeight);
      ctx.strokeStyle = '#7f8c8d';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, track.width, cellHeight);
      
      // 位置ラベル（マス目の中に表示、マイナス記号なし）
      ctx.fillStyle = '#34495e';
      ctx.textAlign = 'center';
      ctx.font = 'bold 14px Arial';
      
      // 数値を表示（マイナス記号なしで絶対値を表示）
      const displayValue = Math.abs(position).toString();
      ctx.fillText(displayValue, x + 15, y + cellHeight / 2 + 5);
    }
    
    // 各マス目にあるトークンを集計
    interface TokenPosition {
      type: TokenType;
      data: Token | EvidenceToken;
    }
    
    const tokensByPosition: Record<number, TokenPosition[]> = {};
    
    // イニシアチブマーカーの位置を追加
    const initiativePosition = Math.round(gameState.initiativeMarker.position);
    if (!tokensByPosition[initiativePosition]) {
      tokensByPosition[initiativePosition] = [];
    }
    tokensByPosition[initiativePosition].push({
      type: 'initiative',
      data: gameState.initiativeMarker
    });
    
    // 勢力トークンの位置を追加
    const powerPosition = Math.round(gameState.powerToken.position);
    if (!tokensByPosition[powerPosition]) {
      tokensByPosition[powerPosition] = [];
    }
    tokensByPosition[powerPosition].push({
      type: 'power',
      data: gameState.powerToken
    });
    
    // 証拠トークンの位置を追加
    gameState.evidenceTokens.forEach(token => {
      const tokenPosition = Math.round(token.position);
      if (!tokensByPosition[tokenPosition]) {
        tokensByPosition[tokenPosition] = [];
      }
      tokensByPosition[tokenPosition].push({
        type: 'evidence',
        data: token
      });
    });
    
    // 各マス目でトークンを描画
    for (const position in tokensByPosition) {
      const tokens = tokensByPosition[position];
      const y = getCellY(parseInt(position));
      
      // マス目内でのトークンの配置を計算
      const tokenCount = tokens.length;
      
      // マス目の数値を避けてトークンを配置するため、左端から少し余白を取る
      const startX = x + 35; // マス目の数値のスペースを確保
      const availableWidth = track.width - 40; // 使用可能な幅
      
      tokens.forEach((token, index) => {
        // トークンのx座標を計算（均等に分布）
        const tokenX = startX + (index * availableWidth / (tokenCount));
        
        if (token.type === 'evidence') {
          // 証拠トークン（四角形）を描画
          const evidenceToken = token.data as EvidenceToken;
          const size = 25; // 四角形のサイズ
          ctx.fillStyle = evidenceToken.color;
          ctx.fillRect(tokenX - size/2, y - size/2, size, size);
          ctx.strokeStyle = '#2c3e50';
          ctx.lineWidth = 2;
          ctx.strokeRect(tokenX - size/2, y - size/2, size, size);
          
          // トークンのラベル
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(evidenceToken.label, tokenX, y);
        } else {
          // 円形トークン（イニシアチブマーカーと勢力トークン）を描画
          const circleToken = token.data as Token;
          ctx.beginPath();
          ctx.arc(tokenX, y, circleToken.radius, 0, Math.PI * 2);
          ctx.fillStyle = circleToken.color;
          ctx.fill();
          ctx.strokeStyle = circleToken.border;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // トークンのラベル
          ctx.fillStyle = token.type === 'power' ? '#ffffff' : '#000000';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(circleToken.label, tokenX, y);
        }
      });
    }
    
  }, [gameState]);
  

  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative mb-4 mt-6">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400}
          className="border border-gray-300 bg-white"
        />
      </div>

      <HandCards cards={testHandCards}/>
      
    </div>
  );
};

export default WatergateTrack;