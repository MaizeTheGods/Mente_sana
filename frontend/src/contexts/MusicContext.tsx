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
    // Only log status changes, not every time
    const status = {
      songs: songs.length,
      currentSong: currentSong?.title || 'None',
      isPlaying,
      isMuted,
      volume
    };

    // Log only if status actually changed
    if (JSON.stringify(status) !== JSON.stringify(lastLoggedStatus.current)) {
      console.log('🎵 MUSIC STATUS:', status);
      lastLoggedStatus.current = { ...status };
    }
  };

  // Detect OS
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    setShouldShowMusic(!isIOSDevice); // Show music controls only on non-iOS

    console.log('🎵 MUSIC SYSTEM - OS Detection:');
    console.log('   User Agent:', userAgent);
    console.log('   Is iOS Device:', isIOSDevice);
    console.log('   Should Show Music:', !isIOSDevice);
    if (isIOSDevice) {
      console.log('   ❌ Music disabled: iOS detected - Apple blocks background audio');
    } else {
      console.log('   ✅ Music enabled: Non-iOS device detected');
    }

    // Log initial status
    setTimeout(logMusicStatus, 100);
  }, [logMusicStatus]);

  // Load songs
  const loadSongs = async () => {
    // Prevent multiple simultaneous loads
    if (isLoadingSongs || songs.length > 0) return;

    // Only load songs if user is authenticated and is admin
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      console.log('🎵 Music loading skipped: User not authenticated or not admin');
      return;
    }

    setIsLoadingSongs(true);
    try {
      const response = await songsAPI.getSongs();
      console.log('🎵 Found', response.songs.length, 'songs');

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
      console.error('🎵 Failed to load songs:', error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoadingSongs(false);
    }
  };

  // Initialize audio element
  useEffect(() => {
    console.log('🎵 MUSIC SYSTEM - Initializing audio element...');
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.loop = false; // We'll handle playlist looping manually

      console.log('🎵 MUSIC SYSTEM - ✅ Audio element created');
      console.log('   Initial volume:', volume);
      console.log('   Loop disabled (playlist mode)');

      // Handle song end - play next
      audioRef.current.addEventListener('ended', () => {
        next();
      });

      // Handle errors
      audioRef.current.addEventListener('error', (e) => {
        console.error('🎵 Audio error, skipping to next');
        next();
      });
    }

    return () => {
      if (audioRef.current) {
        console.log('🎵 MUSIC SYSTEM - 🧹 Cleaning up audio element...');
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [next, volume]);

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
      console.log('🎵 Cannot play: conditions not met');
      return;
    }

    audioRef.current.play()
      .then(() => {
        console.log('🎵 Playback started:', currentSong.title);
        setIsPlaying(true);
        setTimeout(logMusicStatus, 100);
      })
      .catch(e => {
        console.error('🎵 Play failed:', e.message);
        setIsPlaying(false);
        setTimeout(logMusicStatus, 100);
      });
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      console.log('🎵 Music paused');
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
  }, [shouldShowMusic, user, songs.length, isLoadingSongs, loadSongs]);

  // Clear songs when user logs out or changes to non-admin
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      if (songs.length > 0) {
        console.log('🎵 Clearing songs: User logged out or no longer admin');
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