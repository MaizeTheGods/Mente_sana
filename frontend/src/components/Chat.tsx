import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { chatAPI, ChatGroup } from '../services/api';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  Card,
  Badge,
  Button
} from './SharedStyles';
import Loader from './Loader';

const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const GroupCard = styled(Card)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #e2e8f0;
  
  &:hover {
    border-color: #2e7d32;
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const GroupTitle = styled.h3`
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const GroupDescription = styled.p`
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
`;

const InfoSection = styled.div`
  background: #f0fdf4;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  border-left: 4px solid #2e7d32;
`;

const InfoTitle = styled.h3`
  color: #1e293b;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
`;

const InfoText = styled.p`
  color: #475569;
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
`;

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
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
    loadGroups();
  }, []);

  const handleJoinGroup = async (groupId: string, isMember: boolean) => {
    try {
      if (!isMember) {
        await chatAPI.joinGroup(groupId);
      }
      navigate(`/chat/${groupId}`);
    } catch (error: any) {
      console.error('Failed to join group:', error);
      alert('Error al unirse al grupo. Inténtalo de nuevo.');
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      anxiety: '😰',
      depression: '😢',
      stress: '😤',
      general: '👥',
      recovery: '🌱',
      family: '👨‍👩‍👧‍👦'
    };
    return icons[category] || '👥';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      anxiety: 'Ansiedad',
      depression: 'Depresión',
      stress: 'Estrés',
      general: 'General',
      recovery: 'Recuperación',
      family: 'Familiares'
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px' }}>
        <Loader />
        <div style={{ color: '#64748b', fontSize: '16px', fontWeight: '500', marginTop: '20px' }}>Cargando grupos...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader>
        <div>
          <PageTitle>Grupos de Apoyo</PageTitle>
          <PageSubtitle>Conecta con personas que comparten tus experiencias</PageSubtitle>
        </div>
      </PageHeader>

      <InfoSection>
        <InfoTitle>👋 Bienvenido a la comunidad</InfoTitle>
        <InfoText>
          Nuestros grupos de apoyo son espacios seguros y moderados. Recuerda ser respetuoso, empático y mantener la confidencialidad de lo que se comparte aquí.
        </InfoText>
      </InfoSection>

      {error ? (
        <InfoSection style={{ background: '#fef2f2', borderColor: '#dc2626' }}>
          <InfoTitle style={{ color: '#dc2626' }}>Error</InfoTitle>
          <InfoText>{error}</InfoText>
        </InfoSection>
      ) : groups.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <p>No hay grupos disponibles en este momento.</p>
        </Card>
      ) : (
        <GroupsGrid>
          {groups.map(group => (
            <GroupCard
              key={group._id}
              onClick={() => handleJoinGroup(group._id, group.isMember || false)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Badge bg="#f0fdf4" color="#16a34a">
                  {getCategoryLabel(group.category)}
                </Badge>
                <span style={{ fontSize: '24px' }}>{getCategoryIcon(group.category)}</span>
              </div>
              <GroupTitle>{group.name}</GroupTitle>
              <GroupDescription>{group.description}</GroupDescription>
              <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                <Button
                  variant={group.isMember ? "secondary" : "primary"}
                  style={{ width: '100%', fontSize: '13px' }}
                >
                  {group.isMember ? 'Entrar al Chat' : 'Unirse al Grupo'}
                </Button>
              </div>
            </GroupCard>
          ))}
        </GroupsGrid>
      )}
    </div>
  );
};

export default Chat;