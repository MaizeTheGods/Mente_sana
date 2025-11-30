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

  // Status logging function
  const logMusicStatus = () => {
    console.log('🎵 MUSIC SYSTEM - 📊 Current Status:');
    console.log('   OS: iOS =', isIOS, '| Should show music =', shouldShowMusic);
    console.log('   Songs loaded:', songs.length);
    console.log('   Current song:', currentSong ? currentSong.title : 'None');
    console.log('   Is playing:', isPlaying);
    console.log('   Is muted:', isMuted);
    console.log('   Volume:', volume);
    console.log('   Audio element exists:', !!audioRef.current);

    if (!shouldShowMusic) {
      console.log('   ❌ MUSIC DISABLED: iOS device detected');
    } else if (songs.length === 0) {
      console.log('   ❌ MUSIC DISABLED: No songs available');
    } else if (!currentSong) {
      console.log('   ❌ MUSIC DISABLED: No current song selected');
    } else if (!isPlaying) {
      console.log('   ⏸️  MUSIC PAUSED: User has not started playback yet');
    } else if (isMuted) {
      console.log('   🔇 MUSIC MUTED: Audio is playing but volume is 0');
    } else {
      console.log('   ✅ MUSIC PLAYING: All systems go!');
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
  }, []);

  // Load songs
  const loadSongs = async () => {
    try {
      console.log('🎵 MUSIC SYSTEM - Loading songs from server...');
      const response = await songsAPI.getSongs();
      console.log('🎵 MUSIC SYSTEM - Songs loaded:', response.songs.length, 'songs found');

      if (response.songs.length === 0) {
        console.log('🎵 MUSIC SYSTEM - ❌ No songs available on server');
        setSongs([]);
        return;
      }

      setSongs(response.songs);
      console.log('🎵 MUSIC SYSTEM - Song list updated:', response.songs.map(s => s.title));

      if (response.songs.length > 0 && !currentSong) {
        setCurrentSong(response.songs[0]);
        console.log('🎵 MUSIC SYSTEM - ✅ Set first song as current:', response.songs[0].title);
      } else if (currentSong) {
        console.log('🎵 MUSIC SYSTEM - Current song already set:', currentSong.title);
      }

      // Log status after loading songs
      setTimeout(logMusicStatus, 100);
    } catch (error) {
      console.error('🎵 MUSIC SYSTEM - ❌ Failed to load songs:', error);
      console.log('🎵 MUSIC SYSTEM - Possible reasons:');
      console.log('   - Backend server not responding');
      console.log('   - CORS issues');
      console.log('   - Network connectivity problems');
      console.log('   - Authentication token expired');
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
        console.log('🎵 MUSIC SYSTEM - 📻 Song ended, playing next...');
        next();
      });

      // Handle errors
      audioRef.current.addEventListener('error', (e) => {
        console.error('🎵 MUSIC SYSTEM - ❌ Audio error:', e);
        console.log('🎵 MUSIC SYSTEM - Skipping to next song...');
        next(); // Skip to next song on error
      });

      // Handle successful load
      audioRef.current.addEventListener('loadeddata', () => {
        console.log('🎵 MUSIC SYSTEM - ✅ Audio file loaded successfully');
      });

      // Handle play/pause events
      audioRef.current.addEventListener('play', () => {
        console.log('🎵 MUSIC SYSTEM - ▶️  Audio started playing');
      });

      audioRef.current.addEventListener('pause', () => {
        console.log('🎵 MUSIC SYSTEM - ⏸️  Audio paused');
      });
    }

    return () => {
      if (audioRef.current) {
        console.log('🎵 MUSIC SYSTEM - 🧹 Cleaning up audio element...');
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update audio source when current song changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      console.log('🎵 MUSIC SYSTEM - 🔄 Changing song...');
      console.log('   New song:', currentSong.title);
      console.log('   URL:', currentSong.url.substring(0, 50) + '...');

      audioRef.current.src = currentSong.url;

      if (isPlaying) {
        console.log('🎵 MUSIC SYSTEM - ▶️  Auto-playing new song...');
        audioRef.current.play().catch(e => {
          console.error('🎵 MUSIC SYSTEM - ❌ Auto-play failed:', e);
          console.log('🎵 MUSIC SYSTEM - This is normal - user must interact first');
        });
      } else {
        console.log('🎵 MUSIC SYSTEM - ⏸️  Song loaded but not playing (user paused)');
      }
    } else if (!currentSong) {
      console.log('🎵 MUSIC SYSTEM - ⚠️  No current song to load');
    }
  }, [currentSong, isPlaying]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      const actualVolume = isMuted ? 0 : volume;
      audioRef.current.volume = actualVolume;
      console.log('🎵 MUSIC SYSTEM - 🔊 Volume updated:');
      console.log('   Volume level:', volume);
      console.log('   Is muted:', isMuted);
      console.log('   Actual volume applied:', actualVolume);
    }
  }, [volume, isMuted]);

  const play = () => {
    console.log('🎵 MUSIC SYSTEM - Attempting to play music...');

    if (!shouldShowMusic) {
      console.log('🎵 MUSIC SYSTEM - ❌ Cannot play: Music disabled (iOS or unsupported device)');
      return;
    }

    if (!currentSong) {
      console.log('🎵 MUSIC SYSTEM - ❌ Cannot play: No current song selected');
      console.log('   Available songs:', songs.length);
      return;
    }

    if (!audioRef.current) {
      console.log('🎵 MUSIC SYSTEM - ❌ Cannot play: Audio element not initialized');
      return;
    }

    console.log('🎵 MUSIC SYSTEM - ✅ All conditions met, starting playback...');
    console.log('   Song:', currentSong.title);
    console.log('   URL:', currentSong.url.substring(0, 50) + '...');

    audioRef.current.play()
      .then(() => {
        console.log('🎵 MUSIC SYSTEM - ✅ Playback started successfully');
        setIsPlaying(true);
        setTimeout(logMusicStatus, 100);
      })
      .catch(e => {
        console.error('🎵 MUSIC SYSTEM - ❌ Play failed:', e);
        console.log('🎵 MUSIC SYSTEM - Possible reasons for play failure:');
        console.log('   - Browser autoplay policy (user must interact first)');
        console.log('   - Audio file corrupted or inaccessible');
        console.log('   - Network connectivity issues');
        console.log('   - Browser security restrictions');
        setIsPlaying(false);
        setTimeout(logMusicStatus, 100);
      });
  };

  const pause = () => {
    console.log('🎵 MUSIC SYSTEM - Pausing music...');
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      console.log('🎵 MUSIC SYSTEM - ✅ Music paused');
      setTimeout(logMusicStatus, 100);
    } else {
      console.log('🎵 MUSIC SYSTEM - ❌ Cannot pause: Audio element not initialized');
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
    const newMutedState = !isMuted;
    console.log('🎵 MUSIC SYSTEM - 🔇 Toggle mute:');
    console.log('   Was muted:', isMuted);
    console.log('   Now muted:', newMutedState);
    console.log('   Volume will be set to:', newMutedState ? 0 : volume);
    setIsMuted(newMutedState);
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