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
  border: 4px solid #334155;
  border-radius: 12px;
  background-color: #0f172a;
  max-width: 100%;
  height: auto;
  touch-action: none;
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

const MobileControls = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
  @media (min-width: 769px) { display: none; }
`;

const DodgeBlocks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const stateRef = useRef({
    playerX: 185,
    obstacles: [] as any[]
  });

  const resetGame = () => {
    stateRef.current = { playerX: 185, obstacles: [] };
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let keys: { [key: string]: boolean } = {};
    const handleKey = (e: KeyboardEvent) => keys[e.key] = true;
    const handleKeyUp = (e: KeyboardEvent) => keys[e.key] = false;
    
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      stateRef.current.playerX = (x * (canvas.width / rect.width)) - 15;
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchmove', handleTouch, { passive: false });

    const loop = setInterval(() => {
      if (isPaused || gameOver) return;

      const s = stateRef.current;
      if (keys['ArrowLeft'] && s.playerX > 0) s.playerX -= 7;
      if (keys['ArrowRight'] && s.playerX < canvas.width - 30) s.playerX += 7;

      if (Math.random() < 0.08) {
        s.obstacles.push({ x: Math.random() * (canvas.width-30), y: -30, size: 30, speed: 3 + Math.random()*4 });
      }

      s.obstacles.forEach(o => {
        o.y += o.speed;
        if (s.playerX < o.x + 30 && s.playerX + 30 > o.x && 460 < o.y + 30 && 490 > o.y) setGameOver(true);
      });

      const initial = s.obstacles.length;
      s.obstacles = s.obstacles.filter(o => o.y < canvas.height);
      if (initial > s.obstacles.length) setScore(sc => sc + 1);

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#60a5fa'; ctx.fillRect(s.playerX, 460, 30, 30);
      ctx.fillStyle = '#f87171'; s.obstacles.forEach(o => ctx.fillRect(o.x, o.y, 30, 30));
    }, 1000 / 60);

    return () => { clearInterval(loop); window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleKeyUp); canvas.removeEventListener('touchmove', handleTouch); };
  }, [isPaused, gameOver]);

  return (
    <GameContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '400px' }}>
        <h3>Puntos: {score}</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={() => setIsPaused(!isPaused)}>{isPaused ? '▶' : '||'}</Button>
          <Button onClick={resetGame} variant="danger">↺</Button>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <Canvas ref={canvasRef} width={400} height={500} />
        {gameOver && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
          <h2>GAME OVER</h2><Button onClick={resetGame} variant="success">Reintentar</Button>
        </div>}
      </div>
      <MobileControls>
        <Button onTouchStart={() => {}} onTouchEnd={() => {}} style={{ width: '80px', height: '50px' }}>Mueve arrastrando</Button>
      </MobilePad>
    </GameContainer>
  );
};

export default DodgeBlocks;
