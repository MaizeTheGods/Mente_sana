import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { songsAPI, Song } from '../services/api';

interface MusicContextType {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  loadSongs: () => Promise<void>;
  isIOS: boolean;
  shouldShowMusic: boolean;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [isIOS, setIsIOS] = useState(false);
  const [shouldShowMusic, setShouldShowMusic] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Detect OS
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    setShouldShowMusic(!isIOSDevice); // Show music controls only on non-iOS
  }, []);

  // Load songs
  const loadSongs = async () => {
    try {
      const response = await songsAPI.getSongs();
      setSongs(response.songs);
      if (response.songs.length > 0 && !currentSong) {
        setCurrentSong(response.songs[0]);
      }
    } catch (error) {
      console.error('Failed to load songs:', error);
    }
  };

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.loop = false; // We'll handle playlist looping manually

      // Handle song end - play next
      audioRef.current.addEventListener('ended', () => {
        next();
      });

      // Handle errors
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        next(); // Skip to next song on error
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update audio source when current song changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error('Play failed:', e));
      }
    }
  }, [currentSong]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const play = () => {
    if (audioRef.current && currentSong && shouldShowMusic) {
      audioRef.current.play().catch(e => console.error('Play failed:', e));
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const next = () => {
    if (songs.length === 0) return;

    const currentIndex = currentSong ? songs.findIndex(s => s._id === currentSong._id) : -1;
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  };

  const previous = () => {
    if (songs.length === 0) return;

    const currentIndex = currentSong ? songs.findIndex(s => s._id === currentSong._id) : -1;
    const prevIndex = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
    setCurrentSong(songs[prevIndex]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  };

  // Auto-start music on mount if not iOS and songs available
  useEffect(() => {
    if (shouldShowMusic && songs.length > 0 && !currentSong) {
      loadSongs();
    }
  }, [shouldShowMusic, songs.length, currentSong]);

  const value: MusicContextType = {
    songs,
    currentSong,
    isPlaying,
    isMuted,
    volume,
    play,
    pause,
    next,
    previous,
    toggleMute,
    setVolume,
    loadSongs,
    isIOS,
    shouldShowMusic,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};