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
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ variant?: 'danger' | 'success' | 'action' }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: ${props => 
    props.variant === 'danger' ? '#ef4444' : 
    props.variant === 'success' ? '#10b981' : 
    props.variant === 'action' ? '#6366f1' : '#3b82f6'};
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

const MobilePad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 10px;
  width: 100%;
  max-width: 300px;
  @media (min-width: 769px) { display: none; }
`;

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20;

const SHAPES = [
  [[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 0]],
  [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]]
];
const COLORS = ['#06b6d4', '#eab308', '#a855f7', '#22c55e', '#ef4444', '#3b82f6', '#f97316'];

const TetrisGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gridRef = useRef(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const pieceRef = useRef({
    pos: { x: 3, y: 0 },
    shape: SHAPES[0],
    color: COLORS[0]
  });

  const resetGame = () => {
    gridRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    spawnPiece();
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const spawnPiece = () => {
    const idx = Math.floor(Math.random() * SHAPES.length);
    pieceRef.current = {
      pos: { x: 3, y: 0 },
      shape: SHAPES[idx],
      color: COLORS[idx]
    };
  };

  const rotate = (m: number[][]) => m[0].map((_, i) => m.map(row => row[i]).reverse());

  const collide = (p: any, g: any) => {
    for (let y = 0; y < p.shape.length; y++) {
      for (let x = 0; x < p.shape[y].length; x++) {
        if (p.shape[y][x] !== 0) {
          let ny = p.pos.y + y;
          let nx = p.pos.x + x;
          if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && g[ny][nx] !== 0)) return true;
        }
      }
    }
    return false;
  };

  const move = (dir: number) => {
    pieceRef.current.pos.x += dir;
    if (collide(pieceRef.current, gridRef.current)) pieceRef.current.pos.x -= dir;
  };

  const handleRotate = () => {
    const s = pieceRef.current.shape;
    pieceRef.current.shape = rotate(s);
    if (collide(pieceRef.current, gridRef.current)) pieceRef.current.shape = s;
  };

  const drop = () => {
    pieceRef.current.pos.y++;
    if (collide(pieceRef.current, gridRef.current)) {
      pieceRef.current.pos.y--;
      pieceRef.current.shape.forEach((row, y) => {
        row.forEach((v, x) => {
          if (v) gridRef.current[pieceRef.current.pos.y + y][pieceRef.current.pos.x + x] = pieceRef.current.color;
        });
      });
      // Clear lines
      for (let y = ROWS - 1; y >= 0; y--) {
        if (gridRef.current[y].every(c => c !== 0)) {
          gridRef.current.splice(y, 1);
          gridRef.current.unshift(Array(COLS).fill(0));
          setScore(s => s + 100);
          y++;
        }
      }
      spawnPiece();
      if (collide(pieceRef.current, gridRef.current)) setGameOver(true);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKey = (e: KeyboardEvent) => {
      if (gameOver || isPaused) return;
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowDown') drop();
      if (e.key === 'ArrowUp') handleRotate();
    };
    window.addEventListener('keydown', handleKey);

    const loop = setInterval(() => {
      if (!isPaused && !gameOver) drop();
    }, 800);

    let anim = requestAnimationFrame(function draw() {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Grid
      gridRef.current.forEach((row, y) => row.forEach((v, x) => {
        if (v) { ctx.fillStyle = v as string; ctx.fillRect(x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE-1, BLOCK_SIZE-1); }
      }));
      // Piece
      ctx.fillStyle = pieceRef.current.color;
      pieceRef.current.shape.forEach((row, y) => row.forEach((v, x) => {
        if (v) ctx.fillRect((pieceRef.current.pos.x+x)*BLOCK_SIZE, (pieceRef.current.pos.y+y)*BLOCK_SIZE, BLOCK_SIZE-1, BLOCK_SIZE-1);
      }));
      anim = requestAnimationFrame(draw);
    });

    return () => { clearInterval(loop); cancelAnimationFrame(anim); window.removeEventListener('keydown', handleKey); };
  }, [isPaused, gameOver]);

  return (
    <GameContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '200px' }}>
        <h3>{score}</h3>
        <Controls>
          <Button onClick={() => setIsPaused(!isPaused)}>{isPaused ? '▶' : '||'}</Button>
          <Button onClick={resetGame} variant="danger">↺</Button>
        </Controls>
      </div>
      <div style={{ position: 'relative' }}>
        <Canvas ref={canvasRef} width={COLS*BLOCK_SIZE} height={ROWS*BLOCK_SIZE} />
        {gameOver && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2>GAME OVER</h2><Button onClick={resetGame} variant="success">Reintentar</Button>
        </div>}
      </div>
      <MobilePad>
        <Button onClick={() => move(-1)}>◀</Button>
        <Button onClick={handleRotate} variant="action">↻</Button>
        <Button onClick={() => move(1)}>▶</Button>
        <div />
        <Button onClick={drop} style={{ gridColumn: '2' }}>▼</Button>
      </MobilePad>
    </GameContainer>
  );
};

export default TetrisGame;
