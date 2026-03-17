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
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  max-width: 100%;
  height: auto;
  touch-action: none;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
`;

const Button = styled.button<{ variant?: 'danger' | 'success' }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: ${props => props.variant === 'danger' ? '#ef4444' : props.variant === 'success' ? '#10b981' : '#3b82f6'};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MobileControls = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(2, 60px);
  gap: 10px;
  margin-top: 10px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const DirectionButton = styled.button`
  width: 60px;
  height: 60px;
  background: #e2e8f0;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:active {
    background: #cbd5e1;
  }
`;

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const snakeRef = useRef([{ x: 10, y: 10 }]);
  const foodRef = useRef({ x: 15, y: 15 });
  const directionRef = useRef({ dx: 1, dy: 0 });
  const nextDirectionRef = useRef({ dx: 1, dy: 0 });
  const gridSize = 20;

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    foodRef.current = { x: 15, y: 15 };
    directionRef.current = { dx: 1, dy: 0 };
    nextDirectionRef.current = { dx: 1, dy: 0 };
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tileCount = canvas.width / gridSize;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current.dy !== 1) nextDirectionRef.current = { dx: 0, dy: -1 }; break;
        case 'ArrowDown': if (directionRef.current.dy !== -1) nextDirectionRef.current = { dx: 0, dy: 1 }; break;
        case 'ArrowLeft': if (directionRef.current.dx !== 1) nextDirectionRef.current = { dx: -1, dy: 0 }; break;
        case 'ArrowRight': if (directionRef.current.dx !== -1) nextDirectionRef.current = { dx: 1, dy: 0 }; break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const gameLoop = setInterval(() => {
      if (isPaused || gameOver) return;

      directionRef.current = nextDirectionRef.current;
      const head = { 
        x: snakeRef.current[0].x + directionRef.current.dx, 
        y: snakeRef.current[0].y + directionRef.current.dy 
      };

      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
          snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      snakeRef.current.unshift(head);

      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => s + 10);
        foodRef.current = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
      } else {
        snakeRef.current.pop();
      }

      // Draw
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(foodRef.current.x * gridSize, foodRef.current.y * gridSize, gridSize - 2, gridSize - 2);

      ctx.fillStyle = '#10b981';
      snakeRef.current.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#059669' : '#10b981';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      });
    }, 120);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPaused, gameOver]);

  return (
    <GameContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '400px', alignItems: 'center' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Puntos: {score}</h3>
        <Controls>
          <Button onClick={() => setIsPaused(!isPaused)} variant={isPaused ? 'success' : undefined}>
            {isPaused ? 'Reanudar' : 'Pausa'}
          </Button>
          <Button onClick={resetGame} variant="danger">Reiniciar</Button>
        </Controls>
      </div>

      <div style={{ position: 'relative' }}>
        <Canvas ref={canvasRef} width={400} height={400} />
        {gameOver && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', borderRadius: '12px'
          }}>
            <h2 style={{ color: 'white', marginBottom: '15px' }}>¡Juego Terminado!</h2>
            <Button onClick={resetGame} variant="success" style={{ padding: '12px 24px' }}>Jugar de Nuevo</Button>
          </div>
        )}
      </div>

      <MobileControls>
        <div />
        <DirectionButton onClick={() => directionRef.current.dy !== 1 && (nextDirectionRef.current = { dx: 0, dy: -1 })}>▲</DirectionButton>
        <div />
        <DirectionButton onClick={() => directionRef.current.dx !== 1 && (nextDirectionRef.current = { dx: -1, dy: 0 })}>◀</DirectionButton>
        <DirectionButton onClick={() => directionRef.current.dy !== -1 && (nextDirectionRef.current = { dx: 0, dy: 1 })}>▼</DirectionButton>
        <DirectionButton onClick={() => directionRef.current.dx !== -1 && (nextDirectionRef.current = { dx: 1, dy: 0 })}>▶</DirectionButton>
      </MobileControls>
    </GameContainer>
  );
};

export default SnakeGame;
