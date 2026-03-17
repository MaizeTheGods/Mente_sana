import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  background-color: #70c5ce;
  max-width: 100%;
  height: auto;
  touch-action: none;
`;

const Score = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
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

const FlappyBird: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const stateRef = useRef({
    birdY: 250,
    birdVel: 0,
    pipes: [] as { x: number, top: number, passed: boolean }[]
  });

  const resetGame = useCallback(() => {
    stateRef.current = { birdY: 250, birdVel: 0, pipes: [] };
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  }, []);

  const jump = useCallback(() => {
    if (gameOver) resetGame();
    else if (!isPaused) stateRef.current.birdVel = -5;
  }, [gameOver, isPaused, resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = 0.25;
    const pipeWidth = 50;
    const pipeGap = 150;
    let frame = 0;

    const handleKey = (e: KeyboardEvent) => { if (e.key === ' ' || e.key === 'ArrowUp') jump(); };
    window.addEventListener('keydown', handleKey);

    const loop = setInterval(() => {
      if (isPaused || gameOver) return;

      const s = stateRef.current;
      s.birdVel += gravity;
      s.birdY += s.birdVel;

      if (frame % 90 === 0) {
        const h = Math.random() * (canvas.height - 250) + 50;
        s.pipes.push({ x: canvas.width, top: h, passed: false });
      }
      frame++;

      s.pipes.forEach(p => {
        p.x -= 2;
        if (30 + 20 > p.x && 30 < p.x + pipeWidth && (s.birdY < p.top || s.birdY + 20 > p.top + pipeGap)) setGameOver(true);
        if (p.x + pipeWidth < 30 && !p.passed) { p.passed = true; setScore(sc => sc + 1); }
      });
      s.pipes = s.pipes.filter(p => p.x + pipeWidth > 0);

      if (s.birdY < 0 || s.birdY + 20 > canvas.height) setGameOver(true);

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(30, s.birdY, 20, 20);
      ctx.fillStyle = '#22c55e';
      s.pipes.forEach(p => {
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        ctx.fillRect(p.x, p.top + pipeGap, pipeWidth, canvas.height);
      });
    }, 1000 / 60);

    return () => { clearInterval(loop); window.removeEventListener('keydown', handleKey); };
  }, [isPaused, gameOver, jump]);

  return (
    <GameContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '400px' }}>
        <Score>{score}</Score>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={() => setIsPaused(!isPaused)}>{isPaused ? '▶' : '||'}</Button>
          <Button onClick={resetGame} variant="danger">↺</Button>
        </div>
      </div>
      <div style={{ position: 'relative' }} onClick={jump}>
        <Canvas ref={canvasRef} width={400} height={500} />
        {gameOver && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
          <h2>¡BOOM!</h2><Button onClick={resetGame} variant="success">Volver a Intentar</Button>
        </div>}
      </div>
      <p style={{ fontSize: '14px', color: '#64748b' }}>Toca o presiona Espacio para saltar</p>
    </GameContainer>
  );
};

export default FlappyBird;
