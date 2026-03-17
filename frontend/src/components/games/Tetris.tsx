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

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 25;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
];

const COLORS = ['cyan', 'yellow', 'purple', 'green', 'red', 'blue', 'orange'];

const TetrisGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let piece = {
      pos: { x: 3, y: 0 },
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };

    const collide = (p: typeof piece) => {
      for (let y = 0; y < p.shape.length; y++) {
        for (let x = 0; x < p.shape[y].length; x++) {
          if (p.shape[y][x] !== 0) {
            let newX = p.pos.x + x;
            let newY = p.pos.y + y;
            if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && grid[newY][newX] !== 0)) {
              return true;
            }
          }
        }
      }
      return false;
    };

    const merge = () => {
      piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            grid[piece.pos.y + y][piece.pos.x + x] = piece.color;
          }
        });
      });
    };

    const rotate = (matrix: number[][]) => {
      return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
    };

    const clearLines = () => {
      let linesCleared = 0;
      for (let y = ROWS - 1; y >= 0; y--) {
        if (grid[y].every(cell => cell !== 0)) {
          grid.splice(y, 1);
          grid.unshift(Array(COLS).fill(0));
          linesCleared++;
          y++;
        }
      }
      if (linesCleared > 0) setScore(s => s + (linesCleared * 100));
    };

    const drop = () => {
      piece.pos.y++;
      if (collide(piece)) {
        piece.pos.y--;
        merge();
        clearLines();
        piece = {
          pos: { x: 3, y: 0 },
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        };
        if (collide(piece)) {
          setGameOver(true);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') {
        piece.pos.x--;
        if (collide(piece)) piece.pos.x++;
      } else if (e.key === 'ArrowRight') {
        piece.pos.x++;
        if (collide(piece)) piece.pos.x--;
      } else if (e.key === 'ArrowDown') {
        drop();
      } else if (e.key === 'ArrowUp') {
        const prevShape = piece.shape;
        piece.shape = rotate(piece.shape);
        if (collide(piece)) piece.shape = prevShape;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const gameLoop = setInterval(() => {
      if (!gameOver) {
        drop();
        draw();
      }
    }, 500);

    const draw = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      grid.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            ctx.fillStyle = value as string;
            ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        });
      });

      // Draw piece
      ctx.fillStyle = piece.color;
      piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            ctx.fillRect((piece.pos.x + x) * BLOCK_SIZE, (piece.pos.y + y) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        });
      });
    };

    const animationReq = requestAnimationFrame(function anim() {
      draw();
      if (!gameOver) requestAnimationFrame(anim);
    });

    return () => {
      clearInterval(gameLoop);
      cancelAnimationFrame(animationReq);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver]);

  return (
    <GameContainer>
      <Score>Puntuación: {score}</Score>
      {gameOver && <div style={{ color: 'red', fontSize: '20px' }}>¡Juego Terminado!</div>}
      <Canvas ref={canvasRef} width={COLS * BLOCK_SIZE} height={ROWS * BLOCK_SIZE} />
      <p style={{ fontSize: '14px', color: '#64748b' }}>Flechas: Mover/Rotar</p>
    </GameContainer>
  );
};

export default TetrisGame;
