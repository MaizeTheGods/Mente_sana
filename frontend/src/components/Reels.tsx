import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { reelsAPI, Reel } from '../services/api';
import { Card, PageHeader, PageTitle, PageSubtitle } from './SharedStyles';

const ReelsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
`;

const ReelCard = styled(Card)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: #f1f5f9;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ReelContent = styled.div`
  padding: 16px;
`;

const ReelTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const ReelDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReelMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #94a3b8;
  flex-wrap: wrap;
  gap: 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #64748b;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #dc2626;
`;

const Reels: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = async () => {
    try {
      setLoading(true);
      const response = await reelsAPI.getReels({ limit: 50 });
      setReels(response.reels);
    } catch (err) {
      console.error('Error loading reels:', err);
      setError('Error al cargar los reels');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div>
        <PageHeader>
          <div>
            <PageTitle>Reels</PageTitle>
            <PageSubtitle>Contenido inspirador y motivacional</PageSubtitle>
          </div>
        </PageHeader>
        <LoadingContainer>
          <div>Cargando reels...</div>
        </LoadingContainer>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader>
          <div>
            <PageTitle>Reels</PageTitle>
            <PageSubtitle>Contenido inspirador y motivacional</PageSubtitle>
          </div>
        </PageHeader>
        <ErrorContainer>
          <div>{error}</div>
        </ErrorContainer>
      </div>
    );
  }

  return (
    <div>
      <PageHeader>
        <div>
          <PageTitle>Reels</PageTitle>
          <PageSubtitle>Contenido inspirador y motivacional</PageSubtitle>
        </div>
      </PageHeader>

      <ReelsContainer>
        {reels.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No hay reels disponibles aún.
          </div>
        ) : (
          reels.map((reel) => (
            <ReelCard key={reel._id}>
              <VideoContainer>
                <VideoElement
                  src={reel.videoUrl}
                  controls
                  preload="metadata"
                  poster="" // You can add a poster image if available
                />
              </VideoContainer>
              <ReelContent>
                <ReelTitle>{reel.title}</ReelTitle>
                <ReelDescription>{reel.description}</ReelDescription>
                <ReelMeta>
                  <span>Por {reel.createdBy.firstName} {reel.createdBy.lastName}</span>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span>{(reel.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                    {reel.duration > 0 && (
                      <span>{Math.floor(reel.duration / 60)}:{(reel.duration % 60).toString().padStart(2, '0')}</span>
                    )}
                    <span>{formatDate(reel.createdAt)}</span>
                  </div>
                </ReelMeta>
              </ReelContent>
            </ReelCard>
          ))
        )}
      </ReelsContainer>
    </div>
  );
};

export default Reels;