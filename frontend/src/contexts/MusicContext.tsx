import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { songsAPI, Song } from '../services/api';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [isIOS, setIsIOS] = useState(false);
  const [shouldShowMusic, setShouldShowMusic] = useState(false);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Track last logged status to avoid spam
  const lastLoggedStatus = useRef<any>(null);

  // Status logging function - reduced verbosity
  const logMusicStatus = () => {
    // Logging disabled per user request
  };

  // Detect OS
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    setShouldShowMusic(!isIOSDevice); // Show music controls only on non-iOS

    // Log initial status
    setTimeout(logMusicStatus, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load songs
  const loadSongs = async () => {
    // Prevent multiple simultaneous loads
    if (isLoadingSongs || songs.length > 0) return;

    // Only load songs if user is authenticated and is admin
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return;
    }

    setIsLoadingSongs(true);
    try {
      const response = await songsAPI.getSongs();

      if (response.songs.length === 0) {
        setSongs([]);
        return;
      }

      setSongs(response.songs);

      if (response.songs.length > 0 && !currentSong) {
        setCurrentSong(response.songs[0]);
      }

      setTimeout(logMusicStatus, 100);
    } catch (error) {
      // Error logging disabled per user request
    } finally {
      setIsLoadingSongs(false);
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
        next();
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  // Update audio source when current song changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url;

      if (isPlaying) {
        audioRef.current.play().catch(e => {
          // Auto-play failed - normal, user must interact first
        });
      }
    }
  }, [currentSong, isPlaying]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      const actualVolume = isMuted ? 0 : volume;
      audioRef.current.volume = actualVolume;
    }
  }, [volume, isMuted]);

  const play = () => {
    if (!shouldShowMusic || !currentSong || !audioRef.current) {
      return;
    }

    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setTimeout(logMusicStatus, 100);
      })
      .catch(e => {
        setIsPlaying(false);
        setTimeout(logMusicStatus, 100);
      });
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setTimeout(logMusicStatus, 100);
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

  // Auto-load songs on mount if not iOS and user is authenticated and admin
  useEffect(() => {
    if (shouldShowMusic && songs.length === 0 && !isLoadingSongs && user && (user.role === 'admin' || user.role === 'owner')) {
      loadSongs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShowMusic, user, songs.length, isLoadingSongs]);

  // Clear songs when user logs out or changes to non-admin
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      if (songs.length > 0) {
        setSongs([]);
        setCurrentSong(null);
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }
      }
    }
  }, [user, songs.length]);

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