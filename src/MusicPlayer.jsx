import React, { useState, useRef, useEffect } from 'react';
import { Music, Lock, Play, Pause, Volume2, SkipForward, SkipBack, X } from 'lucide-react';

const MusicPlayer = ({ darkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [password, setPassword] = useState('');
  const [authenticatedCategories, setAuthenticatedCategories] = useState([]);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  const musicCategories = [
    { id: 'bollywood', label: 'B', name: 'Bollywood', color: 'from-red-500 to-pink-500' },
    { id: 'bhojpuri', label: 'Bh', name: 'Bhojpuri', color: 'from-green-500 to-teal-500' },
    { id: '90s', label: '90s', name: '90s Music', color: 'from-purple-500 to-indigo-500' },
    { id: 'mix', label: 'Mix', name: 'Mixed', color: 'from-orange-500 to-yellow-500' }
  ];

  // Updated tracks with working URLs - keep only the ones that work
  const musicTracks = {
    bollywood: [
      { id: 1, title: 'Sample Bollywood Song 1', url: 'your-audio-url-here.mp3' },
      { id: 2, title: 'Sample Bollywood Song 2', url: 'your-audio-url-here.mp3' }
    ],
    bhojpuri: [
      { id: 1, title: 'Raja aise kahe d', url: 'https://audio.jukehost.co.uk/clP3NJjMb5H8vlPCzXGF9Cry92GdqpTT' },


      { id: 2, title: 'Pawan singh mix', url: 'https://audio.jukehost.co.uk/eopqPwMjAsAGGuRsN7GV7jZ3hTIMQnzJ' },

      { id: 3, title: 'Arvind akela mix', url: 'https://audio.jukehost.co.uk/FOy20Pl8uUnyzHmTD6qvLlOBXjtAhL3X' },

      { id: 4, title: 'pawan singh long', url: 'https://audio.jukehost.co.uk/hbDMFw5qgbeXIzGK9b2RxllLzSz9Vwxr' },
    ],
    '90s': [
      { id: 5, title: 'Sample 90s Song 1', url: 'your-audio-url-here.mp3' },
      { id: 6, title: 'Sample 90s Song 2', url: 'your-audio-url-here.mp3' }
    ],
    mix: [
      { id: 8, title: 'Sample Mixed Song 1', url: 'your-audio-url-here.mp3' },
      { id: 9, title: 'Sample Mixed Song 2', url: 'your-audio-url-here.mp3' }
    ]
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  const handleCategoryClick = (category) => {
    if (authenticatedCategories.includes(category.id)) {
      setSelectedCategory(category);
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
      setShowPasswordPrompt(false);
      setPassword('');
      setPendingCategory(null);
    } else {
      alert('Incorrect password!');
      setPassword('');
    }
  };

  const handleTrackPlay = async (track) => {
    try {
      if (currentTrack?.id === track.id) {
        togglePlayPause();
        return;
      }

      setCurrentTrack(track);
      setCurrentTime(0);
      
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.load();
        
        // Try to play the audio
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error('Error playing audio:', error);
              alert(`Cannot play this audio file. The URL might not be a direct audio link.\nTrack: ${track.title}`);
              setIsPlaying(false);
            });
        }
      }
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
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        volume={volume}
        onError={(e) => {
          console.error('Audio error:', e);
          alert('Error loading audio file. Please check if the URL is a direct audio link.');
          setIsPlaying(false);
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
                {musicCategories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-to-br ${category.color} text-white shadow-lg`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{category.label}</div>
                        <div className="text-sm opacity-90">{category.name}</div>
                      </div>
                      {authenticatedCategories.includes(category.id) ? (
                        <Music size={20} />
                      ) : (
                        <Lock size={20} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Music Player
              <div className="min-w-[400px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{selectedCategory.name}</h3>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="px-3 py-1 rounded-full bg-gray-500/20 hover:bg-gray-500/30 transition-colors"
                  >
                    Back
                  </button>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {musicTracks[selectedCategory.id]?.map((track) => (
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
                        onClick={() => handleTrackPlay(track)}
                        className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                      >
                        {currentTrack?.id === track.id && isPlaying ? (
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
                          onClick={togglePlayPause}
                          className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                        >
                          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
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