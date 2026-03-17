import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Canvas = styled.canvas`
  border: 4px solid #1e293b;
  border-radius: 8px;
  background-color: #000;
`;

const Score = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
`;

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const paddleWidth = 10, paddleHeight = 80;
    let p1Y = canvas.height / 2 - paddleHeight / 2;
    let p2Y = canvas.height / 2 - paddleHeight / 2;
    let ballX = canvas.width / 2, ballY = canvas.height / 2;
    let ballSpeedX = 5, ballSpeedY = 5;
    const paddleSpeed = 8;
    
    let keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => keys[e.key] = true;
    const handleKeyUp = (e: KeyboardEvent) => keys[e.key] = false;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = setInterval(() => {
      // Move paddles
      if (keys['ArrowUp'] && p1Y > 0) p1Y -= paddleSpeed;
      if (keys['ArrowDown'] && p1Y < canvas.height - paddleHeight) p1Y += paddleSpeed;

      // AI Paddle (P2)
      const p2Center = p2Y + paddleHeight / 2;
      if (p2Center < ballY - 10) p2Y += paddleSpeed * 0.7;
      else if (p2Center > ballY + 10) p2Y -= paddleSpeed * 0.7;

      // Move ball
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Wall bounce
      if (ballY <= 0 || ballY >= canvas.height) ballSpeedY = -ballSpeedY;

      // Paddle collision
      if (ballX <= paddleWidth) {
        if (ballY > p1Y && ballY < p1Y + paddleHeight) {
          ballSpeedX = -ballSpeedX * 1.05;
          ballX = paddleWidth;
        } else {
          setScore(s => ({ ...s, p2: s.p2 + 1 }));
          ballX = canvas.width / 2;
          ballSpeedX = 5;
        }
      }

      if (ballX >= canvas.width - paddleWidth) {
        if (ballY > p2Y && ballY < p2Y + paddleHeight) {
          ballSpeedX = -ballSpeedX * 1.05;
          ballX = canvas.width - paddleWidth;
        } else {
          setScore(s => ({ ...s, p1: s.p1 + 1 }));
          ballX = canvas.width / 2;
          ballSpeedX = -5;
        }
      }

      // Draw
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      ctx.fillRect(0, p1Y, paddleWidth, paddleHeight); // P1
      ctx.fillRect(canvas.width - paddleWidth, p2Y, paddleWidth, paddleHeight); // P2
      
      ctx.beginPath();
      ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Net
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.strokeStyle = 'white';
      ctx.stroke();

    }, 1000 / 60);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <GameContainer>
      <Score>{score.p1} - {score.p2}</Score>
      <Canvas ref={canvasRef} width={600} height={400} />
      <p style={{ fontSize: '14px', color: '#64748b' }}>Usa las flechas Arriba/Abajo para mover tu paleta</p>
    </GameContainer>
  );
};

export default PongGame;
