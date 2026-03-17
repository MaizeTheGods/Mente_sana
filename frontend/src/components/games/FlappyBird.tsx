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
  background-color: #70c5ce;
`;

const Score = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
`;

const FlappyBird: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let birdY = canvas.height / 2;
    let birdVelocity = 0;
    const gravity = 0.25;
    const jump = -4.5;
    const birdSize = 20;

    let pipes: { x: number, top: number, passed: boolean }[] = [];
    const pipeWidth = 50;
    const pipeGap = 150;
    const pipeSpeed = 2;

    const spawnPipe = () => {
      const minPipeHeight = 50;
      const maxPipeHeight = canvas.height - pipeGap - minPipeHeight;
      const height = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
      pipes.push({ x: canvas.width, top: height, passed: false });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        birdVelocity = jump;
        if (gameOver) resetGame();
      }
    };

    const resetGame = () => {
      birdY = canvas.height / 2;
      birdVelocity = 0;
      pipes = [];
      setScore(0);
      setGameOver(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('mousedown', () => { birdVelocity = jump; if (gameOver) resetGame(); });

    let pipeInterval = 0;

    const gameLoop = setInterval(() => {
      if (gameOver) return;

      birdVelocity += gravity;
      birdY += birdVelocity;

      if (pipeInterval % 100 === 0) spawnPipe();
      pipeInterval++;

      pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
        
        // Collision
        if (
          30 + birdSize > pipe.x && 30 < pipe.x + pipeWidth &&
          (birdY < pipe.top || birdY + birdSize > pipe.top + pipeGap)
        ) {
          setGameOver(true);
        }

        if (pipe.x + pipeWidth < 30 && !pipe.passed) {
          pipe.passed = true;
          setScore(s => s + 1);
        }
      });

      pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

      if (birdY < 0 || birdY + birdSize > canvas.height) {
        setGameOver(true);
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Bird
      ctx.fillStyle = 'yellow';
      ctx.fillRect(30, birdY, birdSize, birdSize);

      // Pipes
      ctx.fillStyle = 'green';
      pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height);
      });

    }, 1000 / 60);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver]);

  return (
    <GameContainer>
      <Score>Puntuación: {score}</Score>
      {gameOver && <div style={{ color: 'red', fontSize: '20px' }}>¡Juego Terminado! Presiona Espacio para Reiniciar</div>}
      <Canvas ref={canvasRef} width={400} height={500} />
      <p style={{ fontSize: '14px', color: '#64748b' }}>Espacio o Flecha Arriba para volar</p>
    </GameContainer>
  );
};

export default FlappyBird;
