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
  background-color: #1a1a1a;
`;

const Score = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
`;

const DodgeBlocks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const playerSize = 30;
    let playerX = canvas.width / 2 - playerSize / 2;
    const playerY = canvas.height - playerSize - 10;
    
    let obstacles: { x: number, y: number, size: number, speed: number }[] = [];
    let keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => keys[e.key] = true;
    const handleKeyUp = (e: KeyboardEvent) => keys[e.key] = false;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = setInterval(() => {
      if (gameOver) return;

      // Move player
      if (keys['ArrowLeft'] && playerX > 0) playerX -= 5;
      if (keys['ArrowRight'] && playerX < canvas.width - playerSize) playerX += 5;

      // Spawn obstacles
      if (Math.random() < 0.05) {
        const size = Math.random() * 30 + 20;
        obstacles.push({
          x: Math.random() * (canvas.width - size),
          y: -size,
          size: size,
          speed: Math.random() * 3 + 2
        });
      }

      // Move and check collisions
      obstacles.forEach(obs => {
        obs.y += obs.speed;

        if (
          playerX < obs.x + obs.size &&
          playerX + playerSize > obs.x &&
          playerY < obs.y + obs.size &&
          playerY + playerSize > obs.y
        ) {
          setGameOver(true);
        }
      });

      // Remove off-screen obstacles and increase score
      const initialCount = obstacles.length;
      obstacles = obstacles.filter(obs => obs.y < canvas.height);
      if (initialCount > obstacles.length) setScore(s => s + 1);

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Player
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(playerX, playerY, playerSize, playerSize);

      // Obstacles
      ctx.fillStyle = '#ef4444';
      obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.size, obs.size);
      });

    }, 1000 / 60);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]);

  return (
    <GameContainer>
      <Score>Esquivados: {score}</Score>
      {gameOver && <div style={{ color: 'red', fontSize: '20px' }}>¡Golpeado! Refresca para reintentar</div>}
      <Canvas ref={canvasRef} width={400} height={500} />
      <p style={{ fontSize: '14px', color: '#64748b' }}>Usa las flechas Izquierda/Derecha para esquivar</p>
    </GameContainer>
  );
};

export default DodgeBlocks;
