import React, { useState } from 'react';
import styled from 'styled-components';
import { PageHeader, PageTitle, PageSubtitle, Card } from './SharedStyles';
import SnakeGame from './games/Snake';
import PongGame from './games/Pong';
import TetrisGame from './games/Tetris';
import FlappyBird from './games/FlappyBird';
import DodgeBlocks from './games/DodgeBlocks';

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px 0;
`;

const GameCard = styled(Card)`
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
  border: 1px solid rgba(0,0,0,0.05);
  background: white;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: #2e7d32;
  }
`;

const GameIcon = styled.div<{ bgColor: string }>`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: ${props => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-bottom: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const GameTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
`;

const GameDescription = styled.p`
  font-size: 15px;
  color: #64748b;
  line-height: 1.5;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 40px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f1f5f9;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;

  &:hover {
    background: #e2e8f0;
    color: #ef4444;
    transform: rotate(90deg);
  }
`;

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  component: React.ReactNode;
}

const Juegos: React.FC = () => {
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  const games: Game[] = [
    {
      id: 'snake',
      title: 'Snake',
      description: 'El clásico juego de la serpiente. ¡No choques contigo misma!',
      icon: '🐍',
      color: '#e8f5e9',
      component: <SnakeGame />
    },
    {
      id: 'pong',
      title: 'Pong',
      description: 'Tenis de mesa retro contra la computadora.',
      icon: '🏓',
      color: '#f8fafc',
      component: <PongGame />
    },
    {
      id: 'tetris',
      title: 'Tetris',
      description: 'Encaja las piezas y limpia las líneas. ¡Un clásico eterno!',
      icon: '🧱',
      color: '#f3e8ff',
      component: <TetrisGame />
    },
    {
      id: 'flappy',
      title: 'Flappy Bird',
      description: 'Vuela entre las tuberías sin chocar. ¡Ten cuidado!',
      icon: '🐦',
      color: '#fff7ed',
      component: <FlappyBird />
    },
    {
      id: 'dodge',
      title: 'Dodge the Blocks',
      description: 'Esquiva todos los bloques que caen. ¿Cuánto aguantarás?',
      icon: '⬛',
      color: '#fee2e2',
      component: <DodgeBlocks />
    }
  ];

  return (
    <div>
      <PageHeader>
        <div>
          <PageTitle>Zona de Juegos 🎮</PageTitle>
          <PageSubtitle>Tómate un descanso y relájate con estos clásicos</PageSubtitle>
        </div>
      </PageHeader>

      <GamesGrid>
        {games.map((game) => (
          <GameCard key={game.id} onClick={() => setActiveGame(game)}>
            <GameIcon bgColor={game.color}>{game.icon}</GameIcon>
            <GameTitle>{game.title}</GameTitle>
            <GameDescription>{game.description}</GameDescription>
          </GameCard>
        ))}
      </GamesGrid>

      {activeGame && (
        <ModalOverlay onClick={() => setActiveGame(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setActiveGame(null)}>✕</CloseButton>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>
                {activeGame.icon} {activeGame.title}
              </h2>
              <p style={{ color: '#64748b' }}>{activeGame.description}</p>
            </div>
            {activeGame.component}
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Juegos;
