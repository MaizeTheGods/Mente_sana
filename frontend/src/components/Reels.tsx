import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { reelsAPI, Reel } from '../services/api';
import { PageHeader, PageTitle, PageSubtitle } from './SharedStyles';

const ReelsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const VideoWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  max-width: 400px;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
`;

const VideoOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  color: white;
  border-radius: 0 0 12px 12px;
`;

const ReelTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const ReelDescription = styled.p`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
  opacity: 0.9;
`;

const ReelMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  opacity: 0.7;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-50%) scale(1.1);
  }

  &.left {
    left: 20px;
  }

  &.right {
    right: 20px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;

    &.left {
      left: 10px;
    }

    &.right {
      right: 10px;
    }
  }
`;

const ProgressIndicator = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
`;

const ProgressDot = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.3)'};
  transition: background 0.3s ease;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #64748b;
  background: #000;
  color: white;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #dc2626;
  background: #000;
  color: white;
  text-align: center;
  padding: 20px;
`;

const LogContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 100;
  max-width: 300px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Reels: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [logMessage, setLogMessage] = useState<string>('');
  const [showLog, setShowLog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadReels();
  }, []);

  useEffect(() => {
    // Auto-play when reels are loaded and current index changes
    if (reels.length > 0 && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current!.play();
          showLogMessage(`▶️ Reproduciendo: ${reels[currentReelIndex].title}`);
        } catch (err) {
          console.log('Auto-play failed:', err);
        }
      };
      playVideo();
    }
  }, [currentReelIndex, reels]);

  const loadReels = async () => {
    try {
      setLoading(true);
      const response = await reelsAPI.getReels({ limit: 50 });
      setReels(response.reels);
      if (response.reels.length > 0) {
        showLogMessage(`📹 Cargados ${response.reels.length} reels`);
      }
    } catch (err) {
      console.error('Error loading reels:', err);
      setError('Error al cargar los reels');
    } finally {
      setLoading(false);
    }
  };

  const showLogMessage = (message: string) => {
    console.log(message);
    setLogMessage(message);
    setShowLog(true);
    setTimeout(() => setShowLog(false), 3000);
  };

  const nextReel = () => {
    if (reels.length === 0) return;

    const nextIndex = (currentReelIndex + 1) % reels.length;
    setCurrentReelIndex(nextIndex);
    showLogMessage(`⏭️ Siguiente: ${reels[nextIndex].title}`);
  };

  const previousReel = () => {
    if (reels.length === 0) return;

    const prevIndex = currentReelIndex === 0 ? reels.length - 1 : currentReelIndex - 1;
    setCurrentReelIndex(prevIndex);
    showLogMessage(`⏮️ Anterior: ${reels[prevIndex].title}`);
  };

  const handleVideoEnded = () => {
    showLogMessage(`🏁 Terminó: ${reels[currentReelIndex].title}`);
    nextReel();
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
      <LoadingContainer>
        <div>Cargando reels...</div>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <div>{error}</div>
      </ErrorContainer>
    );
  }

  if (reels.length === 0) {
    return (
      <ReelsContainer>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          color: 'white',
          textAlign: 'center',
          padding: '20px'
        }}>
          No hay reels disponibles aún.
        </div>
      </ReelsContainer>
    );
  }

  const currentReel = reels[currentReelIndex];

  return (
    <ReelsContainer>
      <LogContainer className={showLog ? 'visible' : ''}>
        {logMessage}
      </LogContainer>

      <ProgressIndicator>
        {reels.map((_, index) => (
          <ProgressDot key={index} active={index === currentReelIndex} />
        ))}
      </ProgressIndicator>

      <NavigationButton className="left" onClick={previousReel}>
        ‹
      </NavigationButton>

      <VideoWrapper>
        <VideoElement
          ref={videoRef}
          src={currentReel.videoUrl}
          onEnded={handleVideoEnded}
          playsInline
          muted={false}
          autoPlay
        />
        <VideoOverlay>
          <ReelTitle>{currentReel.title}</ReelTitle>
          <ReelDescription>{currentReel.description}</ReelDescription>
          <ReelMeta>
            <span>Por {currentReel.createdBy.firstName} {currentReel.createdBy.lastName}</span>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span>{(currentReel.fileSize / 1024 / 1024).toFixed(1)} MB</span>
              {currentReel.duration > 0 && (
                <span>{Math.floor(currentReel.duration / 60)}:{(currentReel.duration % 60).toString().padStart(2, '0')}</span>
              )}
              <span>{formatDate(currentReel.createdAt)}</span>
            </div>
          </ReelMeta>
        </VideoOverlay>
      </VideoWrapper>

      <NavigationButton className="right" onClick={nextReel}>
        ›
      </NavigationButton>
    </ReelsContainer>
  );
};

export default Reels;