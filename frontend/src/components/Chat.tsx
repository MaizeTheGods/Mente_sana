import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { chatAPI, ChatGroup } from '../services/api';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="70" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="60" cy="30" r="1.5" fill="rgba(255,255,255,0.08)"/></svg>');
    opacity: 0.5;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 40px;
  font-size: 32px;
  font-weight: 700;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const GroupCard = styled.div<{ isMember: boolean }>`
  background: linear-gradient(135deg,
    ${props => props.isMember ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.9)'} 0%,
    ${props => props.isMember ? 'rgba(129, 199, 132, 0.05)' : 'rgba(248, 249, 250, 0.8)'} 100%);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: 2px solid ${props => props.isMember ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.5)'};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.isMember ? '#4caf50' : '#667eea'};

    &::before {
      left: 100%;
    }
  }

  ${props => props.isMember && `
    &::after {
      content: '✓';
      position: absolute;
      top: 16px;
      right: 16px;
      background: #4caf50;
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
    }
  `}
`;

const GroupIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  text-align: center;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;

  ${GroupCard}:hover & {
    transform: scale(1.1);
  }
`;

const GroupTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
  line-height: 1.3;
`;

const GroupDescription = styled.p`
  color: #5a6c7d;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: center;
`;

const GroupStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
`;

const MemberBadge = styled.span<{ isMember: boolean }>`
  background: ${props => props.isMember
    ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
`;

const CategoryBadge = styled.span`
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
`;

const BackButton = styled.button`
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 30px;
  box-shadow: 0 8px 15px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 20px rgba(102, 126, 234, 0.4);
  }
`;

const InfoSection = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.8) 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px 0 0 2px;
  }
`;

const InfoTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoText = styled.p`
  color: #5a6c7d;
  line-height: 1.7;
  margin: 0;
  font-size: 15px;
`;

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await chatAPI.getGroups();
      setGroups(response.groups);
    } catch (error) {
      console.error('Failed to load chat groups:', error);
      setError('No se pudieron cargar los grupos de chat. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string, isMember: boolean) => {
    try {
      if (!isMember) {
        // Only try to join if not already a member
        await chatAPI.joinGroup(groupId);
      }
      // Navigate to the chat room
      navigate(`/chat/${groupId}`);
    } catch (error: any) {
      console.error('Failed to join group:', error);
      alert('Error al unirse al grupo. Inténtalo de nuevo.');
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      anxiety: '😰',
      depression: '😢',
      stress: '😤',
      general: '👥',
      recovery: '🌱',
      family: '👨‍👩‍👧‍👦'
    };
    return icons[category as keyof typeof icons] || '👥';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      anxiety: 'Ansiedad',
      depression: 'Depresión',
      stress: 'Estrés',
      general: 'General',
      recovery: 'Recuperación',
      family: 'Familiares'
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <Container>
      <Card>
        <Title>Grupos de Apoyo</Title>

        <InfoSection>
          <InfoTitle>🤝 ¿Cómo funcionan los grupos?</InfoTitle>
          <InfoText>
            Nuestros grupos de apoyo son espacios seguros y moderados donde puedes conectar con personas que comparten experiencias similares.
            Todos los participantes respetan la confidencialidad y se apoyan mutuamente en su camino hacia el bienestar mental.
          </InfoText>
        </InfoSection>

        <InfoSection>
          <InfoTitle>💡 Consejos importantes</InfoTitle>
          <InfoText>
            • Sé respetuoso y empático con los demás<br/>
            • Mantén la confidencialidad de lo compartido<br/>
            • Si necesitas ayuda profesional urgente, contacta a servicios de emergencia<br/>
            • Los grupos complementan, no reemplazan, la atención profesional
          </InfoText>
        </InfoSection>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Title>Cargando grupos...</Title>
          </div>
        ) : error ? (
          <InfoSection style={{ borderLeftColor: '#e74c3c', background: '#fdf2f2' }}>
            <InfoTitle style={{ color: '#e74c3c' }}>Error</InfoTitle>
            <InfoText style={{ color: '#c0392b' }}>{error}</InfoText>
          </InfoSection>
        ) : groups.length === 0 ? (
          <InfoSection>
            <InfoTitle>No hay grupos disponibles</InfoTitle>
            <InfoText>
              Actualmente no hay grupos de chat activos. Los grupos estarán disponibles próximamente.
              Mientras tanto, puedes explorar nuestros ejercicios y consejos.
            </InfoText>
          </InfoSection>
        ) : (
          <GroupsGrid>
            {groups.map(group => (
              <GroupCard
                key={group._id}
                isMember={group.isMember || false}
                onClick={() => handleJoinGroup(group._id, group.isMember || false)}
              >
                <GroupIcon>{getCategoryIcon(group.category)}</GroupIcon>
                <GroupTitle>{group.name}</GroupTitle>
                <GroupDescription>{group.description}</GroupDescription>
                <GroupStats>
                  <MemberBadge isMember={group.isMember || false}>
                    {group.isMember ? '✓ Miembro' : '👥 Unirse'}
                  </MemberBadge>
                  <CategoryBadge>{getCategoryLabel(group.category)}</CategoryBadge>
                </GroupStats>
              </GroupCard>
            ))}
          </GroupsGrid>
        )}

        <div style={{ textAlign: 'center' }}>
          <BackButton onClick={() => window.history.back()}>
            ← Regresar al Dashboard
          </BackButton>
        </div>
      </Card>
    </Container>
  );
};

export default Chat;