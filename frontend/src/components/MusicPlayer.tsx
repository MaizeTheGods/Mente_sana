import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useMusic } from '../contexts/MusicContext';

// Wave animation for sound visualization
const wave = keyframes`
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.5);
  }
`;

// Add keyframes to CSS
const GlobalKeyframes = styled.div`
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(46, 125, 50, 0.5);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
    }
  }

  @keyframes wave {
    0%, 100% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(1.5);
    }
  }
`;

const MusicButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;

  @media (max-width: 768px) {
    bottom: 15px;
    right: 15px;
  }
`;

const MuteButton = styled.button<{ isMuted: boolean; isPlaying: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: ${props =>
    props.isMuted
      ? 'linear-gradient(135deg, #dc3545, #c82333)'
      : 'linear-gradient(135deg, #2e7d32, #28a745)'
  };
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  ${props => props.isPlaying && !props.isMuted && `
    animation: pulse 2s infinite;
  `}

  @media (max-width: 768px) {
    width: 55px;
    height: 55px;
    font-size: 22px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
`;

const SoundWaves = styled.div<{ isPlaying: boolean; isMuted: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 2px;
  opacity: ${props => (props.isPlaying && !props.isMuted) ? 1 : 0};
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    gap: 1px;
  }
`;

const WaveBar = styled.div`
  width: 3px;
  height: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  animation: ${wave} 1.5s ease-in-out infinite;

  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.3s; }

  @media (max-width: 768px) {
    width: 2px;
    height: 10px;
  }
`;

const Tooltip = styled.div<{ show: boolean }>`
  position: absolute;
  bottom: 70px;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: ${props => props.show ? 1 : 0};
  transform: translateY(${props => props.show ? '0' : '10px'});
  transition: all 0.3s ease;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 15px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid rgba(0, 0, 0, 0.8);
  }

  @media (max-width: 768px) {
    bottom: 65px;
    font-size: 11px;
    padding: 6px 10px;
  }
`;

const MusicPlayer: React.FC = () => {
  const {
    songs,
    isPlaying,
    isMuted,
    shouldShowMusic,
    play,
    toggleMute,
    loadSongs
  } = useMusic();

  const [showTooltip, setShowTooltip] = useState(false);

  // Load songs on mount
  useEffect(() => {
    if (shouldShowMusic) {
      loadSongs();
    }
  }, [shouldShowMusic, loadSongs]);

  // Music does NOT auto-start - only starts when user clicks the button
  // This prevents unwanted audio playback on login

  // Don't render anything on iOS
  if (!shouldShowMusic) {
    return null;
  }

  return (
    <>
      <GlobalKeyframes />
      <MusicButtonContainer>
        <Tooltip show={showTooltip}>
          {!isPlaying ? 'Reproducir música' : (isMuted ? 'Activar música' : 'Silenciar música')}
        </Tooltip>

        <MuteButton
          isMuted={isMuted}
          isPlaying={isPlaying}
          onClick={() => {
            // If not playing, start playing first
            if (!isPlaying && songs.length > 0) {
              play();
            } else {
              // If already playing, toggle mute
              toggleMute();
            }
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          title={!isPlaying ? 'Reproducir música' : (isMuted ? 'Activar música' : 'Silenciar música')}
        >
          <SoundWaves isPlaying={isPlaying} isMuted={isMuted}>
            <WaveBar />
            <WaveBar />
            <WaveBar />
            <WaveBar />
          </SoundWaves>
          {isMuted ? '🔇' : '🔊'}
        </MuteButton>
      </MusicButtonContainer>
    </>
  );
};

export default MusicPlayer;