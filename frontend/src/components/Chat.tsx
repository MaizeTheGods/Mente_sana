import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { chatAPI, ChatGroup } from '../services/api';
import {
  PageContainer,
  GlassCard,
  PageTitle
} from './SharedStyles';

const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const GroupCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const GroupIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  text-align: center;
`;

const GroupTitle = styled.h3`
  color: #2e7d32;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
`;

const GroupDescription = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const GroupStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #4caf50;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
  }
`;

const InfoSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #4caf50;
`;

const InfoTitle = styled.h3`
  color: #2e7d32;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
`;

const InfoText = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
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
    <PageContainer>
      <GlassCard style={{ maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }}>
        <PageTitle>Grupos de Apoyo</PageTitle>

        <InfoSection>
          <InfoTitle>¿Cómo funcionan los grupos?</InfoTitle>
          <InfoText>
            Nuestros grupos de apoyo son espacios seguros y moderados donde puedes conectar con personas que comparten experiencias similares.
            Todos los participantes respetan la confidencialidad y se apoyan mutuamente en su camino hacia el bienestar mental.
          </InfoText>
        </InfoSection>

        <InfoSection>
          <InfoTitle>💡 Consejos importantes</InfoTitle>
          <InfoText>
            • Sé respetuoso y empático con los demás<br />
            • Mantén la confidencialidad de lo compartido<br />
            • Si necesitas ayuda profesional urgente, contacta a servicios de emergencia<br />
            • Los grupos complementan, no reemplazan, la atención profesional
          </InfoText>
        </InfoSection>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <PageTitle>Cargando grupos...</PageTitle>
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
                onClick={() => handleJoinGroup(group._id, group.isMember || false)}
              >
                <GroupIcon>{getCategoryIcon(group.category)}</GroupIcon>
                <GroupTitle>{group.name}</GroupTitle>
                <GroupDescription>{group.description}</GroupDescription>
                <GroupStats>
                  <span>👥 {group.isMember ? 'Miembro' : 'Unirse'}</span>
                  <span>📱 {getCategoryLabel(group.category)}</span>
                </GroupStats>
              </GroupCard>
            ))}
          </GroupsGrid>
        )}

        <div style={{ textAlign: 'center' }}>
          <BackButton onClick={() => navigate('/dashboard')}>
            ← Regresar al Dashboard
          </BackButton>
        </div>
      </GlassCard>
    </PageContainer>
  );
};

export default Chat;