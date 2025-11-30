import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useMusic } from '../contexts/MusicContext';

const MuteButton = styled.button<{ isMuted: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: ${props => props.isMuted ? '#dc3545' : '#2e7d32'};
  color: white;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MusicPlayer: React.FC = () => {
  const {
    songs,
    currentSong,
    isPlaying,
    isMuted,
    shouldShowMusic,
    play,
    pause,
    toggleMute,
    loadSongs
  } = useMusic();

  // Load songs on mount
  useEffect(() => {
    if (shouldShowMusic) {
      loadSongs();
    }
  }, [shouldShowMusic, loadSongs]);

  // Auto-start music when songs are loaded and user is logged in
  useEffect(() => {
    if (shouldShowMusic && songs.length > 0 && !isPlaying) {
      // Small delay to ensure audio element is ready
      const timer = setTimeout(() => {
        play();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldShowMusic, songs.length, isPlaying, play]);

  // Don't render anything on iOS
  if (!shouldShowMusic) {
    return null;
  }

  return (
    <MuteButton
      isMuted={isMuted}
      onClick={toggleMute}
      title={isMuted ? 'Activar música' : 'Silenciar música'}
    >
      {isMuted ? '🔇' : '🔊'}
    </MuteButton>
  );
};

export default MusicPlayer;