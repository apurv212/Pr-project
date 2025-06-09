import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Lock, Play, Pause, Volume2, SkipForward, SkipBack, X } from 'lucide-react';

const MusicPlayer = ({ darkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [password, setPassword] = useState('');
  const [authenticatedCategories, setAuthenticatedCategories] = useState([]);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const musicCategories = [
    { id: 'bollywood', label: 'B', name: 'Bollywood', color: 'from-red-500 to-pink-500' },
    { id: 'bhojpuri', label: 'Bh', name: 'Bhojpuri', color: 'from-green-500 to-teal-500' },
    { id: '90s', label: '90s', name: '90s Music', color: 'from-purple-500 to-indigo-500' },
    { id: 'mix', label: 'Mix', name: 'Mixed', color: 'from-orange-500 to-yellow-500' }
  ];

  // Updated tracks to load from public/music folders
  const musicTracks = {
    bollywood: [
      { id: 1, title: 'Bollywood Song 1', url: '/music/bolly/song1.mp3' },
      { id: 2, title: 'Bollywood Song 2', url: '/music/bolly/song2.mp3' },
      { id: 3, title: 'Bollywood Song 3', url: '/music/bolly/song3.mp3' }
    ],
    bhojpuri: [
      { id: 4, title: 'arvind akela kallu', url: 'https://audio.jukehost.co.uk/FOy20Pl8uUnyzHmTD6qvLlOBXjtAhL3X' },
      { id: 5, title: 'non stop Bhojpuri Song', url: 'https://audio.jukehost.co.uk/hbDMFw5qgbeXIzGK9b2RxllLzSz9Vwxr' },
      { id: 6, title: 'pawan singh', url: 'https://audio.jukehost.co.uk/eopqPwMjAsAGGuRsN7GV7jZ3hTIMQnzJ' },
    ],
    '90s': [
      { id: 7, title: 'Dil Laga Liya X Aaja We Mahiya Mashup', url: '/music/90/Dil_Laga_Liya_X_Aaja_We_Mahiya_Mashup_90s_Love_Songs_90s_Hit.mp3' }
    ],
    mix: [
      { id: 10, title: 'Munni Badnam Hui X Lahriya Luta', url: '/music/mix/MUNNI_BADNAM_HUI_X_LAHRIYA_LUTA_A_RAJA_BHOJPURI_X_HINDI_MEGA.mp3' },
      { id: 11, title: 'Aaj Ki Raat X Balamuwa Ke Ballam', url: '/music/mix/Aaj_Ki_Raat_X_Balamuwa_Ke_Ballam_Dj_Anshu_aX_Club_Mix_Stre.mp3' },
      { id: 12, title: 'Bandookk - Arvind Akela Kallu', url: '/music/mix/#VIDEO_Bandookk_बनदक_#ArvindAkelaKallu_#ShilpiRaj_Daad.mp3' }
    ]
  };

  // Get current category tracks
  const getCurrentTracks = useCallback(() => {
    return selectedCategory ? musicTracks[selectedCategory.id] || [] : [];
  }, [selectedCategory]);

  // Auto-play next track when current ends
  const handleTrackEnd = useCallback(() => {
    const tracks = getCurrentTracks();
    if (tracks.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
      setCurrentTrack(tracks[nextIndex]);
      // Auto-play will be handled by useEffect
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentTrackIndex, getCurrentTracks]);

  // Audio event handlers with optimization
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      // Throttle updates to reduce CPU usage
      if (Date.now() % 100 < 50) return;
      setCurrentTime(audio.currentTime);
    };
    
    const updateDuration = () => setDuration(audio.duration);
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      handleTrackEnd(); // Auto-play next track
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

  // Handle track change with auto-play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const playTrack = async () => {
      try {
        audio.pause();
        audio.src = currentTrack.url;
        audio.load();
        audio.currentTime = 0;
        setCurrentTime(0);
        
        if (isPlaying) {
          await audio.play();
        }
      } catch (error) {
        console.error('Error playing track:', error);
        setIsPlaying(false);
      }
    };

    playTrack();
  }, [currentTrack, isPlaying]);

  const handleCategoryClick = (category) => {
    if (authenticatedCategories.includes(category.id)) {
      setSelectedCategory(category);
      setCurrentTrackIndex(0);
      const tracks = musicTracks[category.id];
      if (tracks && tracks.length > 0) {
        setCurrentTrack(tracks[0]);
      } else {
        alert(`No songs available in ${category.name} category yet. Please add some songs to the public/music/${category.id === 'bollywood' ? 'bolly' : category.id === 'bhojpuri' ? 'bhoj' : category.id} folder.`);
      }
    } else {
      setPendingCategory(category);
      setShowPasswordPrompt(true);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === '7677672641') {
      setAuthenticatedCategories([...authenticatedCategories, pendingCategory.id]);
      setSelectedCategory(pendingCategory);
      setCurrentTrackIndex(0);
      const tracks = musicTracks[pendingCategory.id];
      if (tracks && tracks.length > 0) {
        setCurrentTrack(tracks[0]);
      } else {
        alert(`No songs available in ${pendingCategory.name} category yet. Please add some songs to the public/music/${pendingCategory.id === 'bollywood' ? 'bolly' : pendingCategory.id === 'bhojpuri' ? 'bhoj' : pendingCategory.id} folder.`);
      }
      setShowPasswordPrompt(false);
      setPassword('');
      setPendingCategory(null);
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

  // Navigation functions
  const handleNextTrack = () => {
    const tracks = getCurrentTracks();
    if (tracks.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
      setCurrentTrack(tracks[nextIndex]);
      if (isPlaying) {
        setIsPlaying(true); // This will trigger playback in useEffect
      }
    }
  };

  const handlePrevTrack = () => {
    const tracks = getCurrentTracks();
    if (tracks.length > 0) {
      const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      setCurrentTrack(tracks[prevIndex]);
      if (isPlaying) {
        setIsPlaying(true); // This will trigger playback in useEffect
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
      {/* Optimized Audio Element with preload="metadata" to reduce loading */}
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

      {/* Glass Line at Bottom - Only visible in footer area */}
      <div className="absolute bottom-1 left-1 z-50">
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-1 h-16 cursor-pointer transition-all duration-500 backdrop-blur-sm border border-white/20 ${
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

        {/* Expanded Panel */}
        <div className={`transition-all duration-500 overflow-hidden ${
          isExpanded ? 'h-auto opacity-100' : 'h-0 opacity-0'
        }`}>
          <div className={`backdrop-blur-md border border-white/20 rounded-t-2xl p-6 relative ${
            darkMode 
              ? 'bg-gray-900/80 text-white' 
              : 'bg-white/80 text-gray-800'
          }`}>
            {/* Close Button */}
            {isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-200/50 text-gray-600 hover:text-gray-800'
                }`}
                aria-label="Close music player"
              >
                <X size={14} />
              </button>
            )}

            {!selectedCategory ? (
              // Category Selection
              <div className="grid grid-cols-2 gap-4 min-w-[300px]">
                {musicCategories.map((category) => {
                  const hasMusic = musicTracks[category.id]?.length > 0;
                  return (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-to-br ${category.color} text-white shadow-lg ${
                        !hasMusic ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold">{category.label}</div>
                          <div className="text-sm opacity-90">{category.name}</div>
                          {!hasMusic && (
                            <div className="text-xs opacity-75 mt-1">No songs yet</div>
                          )}
                        </div>
                        <div className="flex flex-col items-center">
                          {authenticatedCategories.includes(category.id) ? (
                            <Music size={20} />
                          ) : (
                            <Lock size={20} />
                          )}
                          {hasMusic && (
                            <div className="text-xs mt-1">{musicTracks[category.id].length} songs</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Music Player
              <div className="min-w-[400px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{selectedCategory.name}</h3>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentTrack(null);
                      setIsPlaying(false);
                    }}
                    className="px-3 py-1 rounded-full bg-gray-500/20 hover:bg-gray-500/30 transition-colors"
                  >
                    Back
                  </button>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {getCurrentTracks().map((track, index) => (
                    <div
                      key={track.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        currentTrack?.id === track.id
                          ? 'bg-indigo-500/20 border border-indigo-500/30'
                          : darkMode 
                          ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                          : 'bg-gray-100/50 hover:bg-gray-200/50'
                      }`}
                    >
                      <span className="flex-1 truncate">{track.title}</span>
                      <button
                        onClick={() => handleTrackPlay(track, index)}
                        className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
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
                  <div className={`mt-4 p-4 rounded-lg ${
                    darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium truncate">{currentTrack.title}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handlePrevTrack}
                          className="p-1 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                          disabled={getCurrentTracks().length <= 1}
                        >
                          <SkipBack size={12} />
                        </button>
                        <button
                          onClick={togglePlayPause}
                          className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : isPlaying ? (
                            <Pause size={16} />
                          ) : (
                            <Play size={16} />
                          )}
                        </button>
                        <button
                          onClick={handleNextTrack}
                          className="p-1 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                          disabled={getCurrentTracks().length <= 1}
                        >
                          <SkipForward size={12} />
                        </button>
                        <Volume2 size={16} className="text-gray-500" />
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div 
                        className="w-full bg-gray-300 rounded-full h-2 cursor-pointer"
                        onClick={handleSeek}
                      >
                        <div 
                          className="bg-indigo-500 h-2 rounded-full transition-all duration-100"
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Time Display */}
                    <div className="flex justify-between text-xs text-gray-500">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className={`p-6 rounded-2xl max-w-sm w-full mx-4 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}>
            <h3 className="text-lg font-bold mb-4">Enter Password</h3>
            <p className="text-sm opacity-70 mb-4">
              This category is password protected. Enter the password to access {pendingCategory?.name}.
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full px-4 py-2 rounded-lg mb-4 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-800'
                } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordPrompt(false);
                    setPassword('');
                    setPendingCategory(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                >
                  Access
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