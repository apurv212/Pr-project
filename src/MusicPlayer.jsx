import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Lock, Play, Pause, Volume2, SkipForward, SkipBack } from 'lucide-react';

const MusicPlayer = ({ darkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const audioRef = useRef(null);
  const playerRef = useRef(null);

  const musicCategories = [
    { id: 'bollywood', label: 'B', name: 'Bollywood', color: 'from-red-500 to-pink-500' },
    { id: 'bhojpuri', label: 'Bh', name: 'Bhojpuri', color: 'from-green-500 to-teal-500' },
    { id: '90s', label: '90s', name: '90s ṁūs̱îĉ', color: 'from-purple-500 to-indigo-500' },
    { id: 'mix', label: 'Mix', name: 'Mixed', color: 'from-orange-500 to-yellow-500' }
  ];

  // Updated tracks with renamed file names
  const musicTracks = {
    bollywood: [
      // Empty for now as bolly folder is empty
    ],
    bhojpuri: [
      { id: 1, title: 'Khesari Lal Yadav X Neelkamal Singh', url: '/music/bhoj/Khesari_lal_Yadav_X_Neel.mp3' },
      { id: 2, title: 'Bhojpuri DJ Universal Nonstop', url: '/music/bhoj/Bhojpuri_Dj_Universal.mp3' },
      { id: 3, title: 'Chit Badali Khiya Ke Maja', url: '/music/bhoj/Chit_Badali_Khiya_.mp3' },
      { id: 4, title: 'Power Star Pawan Singh', url: '/music/bhoj/Power_Star_Pawan_Singh.mp3' },
      { id: 5, title: 'Dil Deewana Bhojpuri', url: '/music/bhoj/DIL_DEEWANA_BHOJPURI.mp3' },
      { id: 6, title: 'Raja Aise Kahe Dekha Tara', url: '/music/bhoj/Raja_Aise_Kahe_Dekha_Tara.mp3' },
      { id: 7, title: 'Munni Badnam Hui X Lahriya', url: '/music/bhoj/MUNNI_BADNAM_HUI_X.mp3' },
      { id: 8, title: 'Aaj Ki Raat X Balamuwa', url: '/music/bhoj/Aaj_Ki_Raat_X_Balamuwa_.mp3' },
      { id: 9, title: 'Bandook - Arvind Akela Kallu', url: '/music/bhoj/Bandook_ArvindAkelaKallu.mp3' }
    ],
    '90s': [
      { id: 10, title: 'Tumsa Koi Pyaara', url: '/music/90/Tumsa Koi Pyaara.mp3' },
      { id: 11, title: '90s Bollywood Mega Dance 2', url: '/music/90/90_s_Bollywood_2.mp3' },
      { id: 12, title: 'Bollywood 90s Wedding Mashup', url: '/music/90/Bollywood_90_s_Wedding.mp3' },
      { id: 13, title: '90s Bollywood Dance 1', url: '/music/90/90s_bollyword_1.mp3' },
      { id: 14, title: 'Udit Narayan Kumar Sanu Mashup', url: '/music/90/Udit_Narayan_Kumar.mp3' },
      { id: 15, title: '90s Bollywood Mashup 3', url: '/music/90/90_Bollywood_mashuo_3.mp3' },
      { id: 16, title: 'Himesh Reshammiya Mashup', url: '/music/90/Himesh_Reshammiya_Mashup_1.mp3' },
      { id: 17, title: 'Dil Laga Liya Mashup', url: '/music/90/Dil_Laga_Liya_mashup.mp3' }
    ],
    mix: [
      // Mix category can include cross-genre mashups
      { id: 18, title: 'Munni Badnam Mix', url: '/music/bhoj/MUNNI_BADNAM_HUI_X.mp3' },
      { id: 19, title: 'Aaj Ki Raat Mix', url: '/music/bhoj/Aaj_Ki_Raat_X_Balamuwa_.mp3' },
      { id: 20, title: 'Dil Deewana Mix', url: '/music/bhoj/DIL_DEEWANA_BHOJPURI.mp3' }
    ]
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (playerRef.current && !playerRef.current.contains(event.target) && isExpanded) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  // Handle triple click logic without showing counter
  const handleLineClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      
      // Reset count after 2 seconds of no clicks
      setTimeout(() => {
        setClickCount(0);
      }, 2000);

      if (newCount >= 5) {
        if (isAuthenticated) {
          setIsExpanded(!isExpanded);
        } else {
          setShowPasswordPrompt(true);
        }
        return 0; // Reset count after action
      }
      
      return newCount;
    });
  };

  // Get current category tracks
  const getCurrentTracks = useCallback(() => {
    return selectedCategory ? musicTracks[selectedCategory.id] || [] : [];
  }, [selectedCategory]);

  // Auto-play next track when current ends - FIXED
  const handleTrackEnd = useCallback(() => {
    const tracks = getCurrentTracks();
    if (tracks.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
      setCurrentTrack(tracks[nextIndex]);
      // Keep playing state true for auto-play
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentTrackIndex, getCurrentTracks]);

  // Audio event handlers - FIXED for auto-play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    // Fixed auto-play functionality
    const handleEnded = () => {
      handleTrackEnd(); // This will set the next track and keep isPlaying true
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [handleTrackEnd]);

  // Handle track change with improved auto-play - FIXED
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const playTrack = async () => {
      try {
        setIsLoading(true);
        audio.pause();
        audio.src = currentTrack.url;
        audio.load();
        audio.currentTime = 0;
        setCurrentTime(0);
        
        // Wait for audio to be ready before playing
        if (isPlaying) {
          const playWhenReady = () => {
            audio.play()
              .then(() => {
                setIsLoading(false);
              })
              .catch((error) => {
                console.error('Error playing track:', error);
                setIsPlaying(false);
                setIsLoading(false);
              });
          };

          if (audio.readyState >= 3) { // HAVE_FUTURE_DATA or higher
            playWhenReady();
          } else {
            audio.addEventListener('canplay', playWhenReady, { once: true });
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading track:', error);
        setIsPlaying(false);
        setIsLoading(false);
      }
    };

    playTrack();
  }, [currentTrack, isPlaying]);

  const handleCategoryClick = (category) => {
      setSelectedCategory(category);
      setCurrentTrackIndex(0);
      const tracks = musicTracks[category.id];
      if (tracks && tracks.length > 0) {
        setCurrentTrack(tracks[0]);
      } else {
      alert(`No s̱ôṉg̱s available in ${category.name} category yet.`);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === '7677672641') {
      setIsAuthenticated(true);
      setIsExpanded(true);
      setShowPasswordPrompt(false);
      setPassword('');
    } else {
      alert('Incorrect password!');
      setPassword('');
    }
  };

  const handleTrackPlay = async (track, index) => {
    try {
      setCurrentTrack(track);
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error loading audio:', error);
      alert(`Error loading audio: ${track.title}`);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error('Error playing audio:', error);
            alert('Cannot play this audio file. Please check the audio URL.');
          });
      }
    }
  };

  // Navigation functions - FIXED for auto-play
  const handleNextTrack = () => {
    const tracks = getCurrentTracks();
    if (tracks.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
      setCurrentTrack(tracks[nextIndex]);
      // Maintain current playing state
      if (isPlaying) {
        setIsPlaying(true);
      }
    }
  };

  const handlePrevTrack = () => {
    const tracks = getCurrentTracks();
    if (tracks.length > 0) {
      const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      setCurrentTrack(tracks[prevIndex]);
      // Maintain current playing state
      if (isPlaying) {
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        volume={volume}
        preload="metadata"
        onError={(e) => {
          console.error('Audio error:', e);
          alert('Error loading audio file. Please check if the file exists in the public/music folder.');
          setIsPlaying(false);
          setIsLoading(false);
        }}
      />

      {/* Glass Line at Bottom - NO click counter display */}
      <div className="absolute bottom-1 left-1 z-50" ref={playerRef}>
        <div
          onClick={handleLineClick}
          className={`w-1 h-16 cursor-pointer transition-all duration-500 backdrop-blur-sm border border-white/20 relative ${
            darkMode 
              ? 'bg-white/10 hover:bg-white/20' 
              : 'bg-black/10 hover:bg-black/20'
          } ${isExpanded ? 'rounded-t-full' : 'rounded-full'}`}
        >
          <div className="w-full h-full flex items-center justify-center">
            <Music 
              size={12} 
              className={`transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              } ${darkMode ? 'text-white/70' : 'text-black/70'}`} 
            />
          </div>
        </div>

        {/* Expanded Panel with Full Glassy Background */}
        <div className={`transition-all duration-500 overflow-hidden ${
          isExpanded ? 'h-auto opacity-100' : 'h-0 opacity-0'
        }`}>
          <div className={`backdrop-blur-lg border border-white/30 rounded-t-3xl p-8 relative shadow-2xl ${
            darkMode 
              ? 'bg-gray-900/90 text-white border-gray-700/50' 
              : 'bg-white/90 text-gray-800 border-gray-300/50'
          }`}>
            {!selectedCategory ? (
              // Category Selection
              <div className="grid grid-cols-2 gap-6 min-w-[400px]">
                <h2 className="col-span-2 text-2xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  ṁūs̱îĉ Collection
                </h2>
                {musicCategories.map((category) => {
                  const hasMusic = musicTracks[category.id]?.length > 0;
                  return (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-to-br ${category.color} text-white shadow-xl hover:shadow-2xl ${
                        !hasMusic ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold mb-1">{category.label}</div>
                          <div className="text-sm opacity-90">{category.name}</div>
                          {!hasMusic && (
                            <div className="text-xs opacity-75 mt-1">No s̱ôṉg̱s yet</div>
                          )}
                        </div>
                        <div className="flex flex-col items-center">
                          <Music size={24} />
                          {hasMusic && (
                            <div className="text-xs mt-2 bg-white/20 px-2 py-1 rounded-full">
                              {musicTracks[category.id].length} s̱ôṉg̱s
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Music Player
              <div className="min-w-[500px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                    {selectedCategory.name}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentTrack(null);
                      setIsPlaying(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white transition-all duration-300 shadow-lg"
                  >
                    Back
                  </button>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent">
                  {getCurrentTracks().map((track, index) => (
                    <div
                      key={track.id}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                        currentTrack?.id === track.id
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 shadow-lg'
                          : darkMode 
                          ? 'bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50' 
                          : 'bg-gray-100/60 hover:bg-gray-200/60 border border-gray-300/50'
                      }`}
                    >
                      <span className="flex-1 truncate font-medium">{track.title}</span>
                      <button
                        onClick={() => handleTrackPlay(track, index)}
                        className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-300 shadow-lg"
                        disabled={isLoading}
                      >
                        {isLoading && currentTrack?.id === track.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : currentTrack?.id === track.id && isPlaying ? (
                          <Pause size={16} />
                        ) : (
                          <Play size={16} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Current Track Player */}
                {currentTrack && (
                  <div className={`mt-6 p-6 rounded-2xl shadow-xl ${
                    darkMode ? 'bg-gray-800/60 border border-gray-700/50' : 'bg-gray-100/60 border border-gray-300/50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold truncate text-lg">{currentTrack.title}</span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handlePrevTrack}
                          className="p-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white transition-all duration-300"
                          disabled={getCurrentTracks().length <= 1}
                        >
                          <SkipBack size={16} />
                        </button>
                        <button
                          onClick={togglePlayPause}
                          className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-300 shadow-lg"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : isPlaying ? (
                            <Pause size={20} />
                          ) : (
                            <Play size={20} />
                          )}
                        </button>
                        <button
                          onClick={handleNextTrack}
                          className="p-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white transition-all duration-300"
                          disabled={getCurrentTracks().length <= 1}
                        >
                          <SkipForward size={16} />
                        </button>
                        <Volume2 size={18} className="text-gray-500 ml-2" />
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div 
                        className="w-full bg-gray-300 rounded-full h-3 cursor-pointer overflow-hidden"
                        onClick={handleSeek}
                      >
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-100"
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Time Display */}
                    <div className="flex justify-between text-sm text-gray-500 font-medium">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70]">
          <div className={`p-8 rounded-3xl max-w-md w-full mx-4 shadow-2xl border ${
            darkMode 
              ? 'bg-gray-800/95 text-white border-gray-600/50' 
              : 'bg-white/95 text-gray-800 border-gray-300/50'
          }`}>
            <div className="text-center mb-6">
              <Lock size={48} className="mx-auto mb-4 text-indigo-500" />
              <h3 className="text-2xl font-bold mb-2">Access Required</h3>
              <p className="text-sm opacity-70">
                Enter password to unlock the ṁūs̱îĉ player
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full px-4 py-3 rounded-xl mb-6 ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-100/50 border-gray-300 text-gray-800 placeholder-gray-500'
                } border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
                autoFocus
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordPrompt(false);
                    setPassword('');
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-300"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer; 