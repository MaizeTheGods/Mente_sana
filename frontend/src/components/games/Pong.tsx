import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
`;

const Canvas = styled.canvas`
  border: 4px solid #1e293b;
  border-radius: 12px;
  background-color: #000;
  max-width: 100%;
  height: auto;
  touch-action: none;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ variant?: 'danger' | 'success' }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: ${props => props.variant === 'danger' ? '#ef4444' : props.variant === 'success' ? '#10b981' : '#3b82f6'};
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [isPaused, setIsPaused] = useState(false);
  
  const stateRef = useRef({
    p1Y: 160,
    p2Y: 160,
    ballX: 300,
    ballY: 200,
    ballSpeedX: 5,
    ballSpeedY: 5
  });

  const resetGame = () => {
    stateRef.current = {
      p1Y: 160,
      p2Y: 160,
      ballX: 300,
      ballY: 200,
      ballSpeedX: 5,
      ballSpeedY: 5
    };
    setScore({ p1: 0, p2: 0 });
    setIsPaused(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const paddleWidth = 10, paddleHeight = 80;
    const paddleSpeed = 8;
    let keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => keys[e.key] = true;
    const handleKeyUp = (e: KeyboardEvent) => keys[e.key] = false;

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touchY = e.touches[0].clientY - rect.top;
      stateRef.current.p1Y = (touchY * (canvas.height / rect.height)) - paddleHeight / 2;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchmove', handleTouch, { passive: false });

    const gameLoop = setInterval(() => {
      if (isPaused) return;

      const state = stateRef.current;

      // Move paddles
      if (keys['ArrowUp'] && state.p1Y > 0) state.p1Y -= paddleSpeed;
      if (keys['ArrowDown'] && state.p1Y < canvas.height - paddleHeight) state.p1Y += paddleSpeed;

      // AI Paddle
      const p2Center = state.p2Y + paddleHeight / 2;
      if (p2Center < state.ballY - 10) state.p2Y += paddleSpeed * 0.7;
      else if (p2Center > state.ballY + 10) state.p2Y -= paddleSpeed * 0.7;

      // Move ball
      state.ballX += state.ballSpeedX;
      state.ballY += state.ballSpeedY;

      if (state.ballY <= 0 || state.ballY >= canvas.height) state.ballSpeedY = -state.ballSpeedY;

      if (state.ballX <= paddleWidth) {
        if (state.ballY > state.p1Y && state.ballY < state.p1Y + paddleHeight) {
          state.ballSpeedX = -state.ballSpeedX * 1.05;
          state.ballX = paddleWidth;
        } else {
          setScore(s => ({ ...s, p2: s.p2 + 1 }));
          state.ballX = canvas.width / 2;
          state.ballSpeedX = 5;
        }
      }

      if (state.ballX >= canvas.width - paddleWidth) {
        if (state.ballY > state.p2Y && state.ballY < state.p2Y + paddleHeight) {
          state.ballSpeedX = -state.ballSpeedX * 1.05;
          state.ballX = canvas.width - paddleWidth;
        } else {
          setScore(s => ({ ...s, p1: s.p1 + 1 }));
          state.ballX = canvas.width / 2;
          state.ballSpeedX = -5;
        }
      }

      // Draw
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, state.p1Y, paddleWidth, paddleHeight);
      ctx.fillRect(canvas.width - paddleWidth, state.p2Y, paddleWidth, paddleHeight);
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, 8, 0, Math.PI * 2);
      ctx.fill();
    }, 1000 / 60);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchmove', handleTouch);
    };
  }, [isPaused]);

  return (
    <GameContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px' }}>
        <h3>{score.p1} - {score.p2}</h3>
        <Controls>
          <Button onClick={() => setIsPaused(!isPaused)}>{isPaused ? 'Reanudar' : 'Pausa'}</Button>
          <Button onClick={resetGame} variant="danger">Reiniciar</Button>
        </Controls>
      </div>
      <Canvas ref={canvasRef} width={600} height={400} />
      <p style={{ fontSize: '14px', color: '#64748b' }}>Arrastra en pantalla o usa flechas</p>
    </GameContainer>
  );
};

export default PongGame;
