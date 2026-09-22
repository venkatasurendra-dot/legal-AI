import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, Square, FastForward } from 'lucide-react';
import { LanguageCode } from '../types';

interface AudioSpeechControlsProps {
  textToSpeak: string;
  messageId: string;
  language?: LanguageCode;
  activePlayingId: string | null;
  setActivePlayingId: (id: string | null) => void;
}

export const AudioSpeechControls: React.FC<AudioSpeechControlsProps> = ({
  textToSpeak,
  messageId,
  language = 'en',
  activePlayingId,
  setActivePlayingId,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [supported, setSupported] = useState(true);

  const isCurrentActive = activePlayingId === messageId;

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
    }
  }, []);

  // When another message starts playing, stop this one
  useEffect(() => {
    if (!isCurrentActive && isPlaying) {
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [isCurrentActive, isPlaying]);

  const cleanTextForAudio = (raw: string): string => {
    return raw
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/#/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[-_]{3,}/g, '')
      .trim();
  };

  const handlePlay = () => {
    if (!supported || typeof window === 'undefined') return;

    if (isCurrentActive && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    setActivePlayingId(messageId);

    const cleanText = cleanTextForAudio(textToSpeak);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Set language
    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'te') {
      utterance.lang = 'te-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = playbackSpeed;

    // Pick a matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const targetLangPrefix = language === 'hi' ? 'hi' : language === 'te' ? 'te' : 'en';
    const matchedVoice = voices.find((v) => v.lang.startsWith(targetLangPrefix)) || voices[0];
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (activePlayingId === messageId) {
        setActivePlayingId(null);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (activePlayingId === messageId) {
        setActivePlayingId(null);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setActivePlayingId(null);
    }
  };

  const cycleSpeed = () => {
    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
    setPlaybackSpeed(nextSpeed);
    if (isCurrentActive && isPlaying) {
      // Re-trigger with new rate
      handlePlay();
    }
  };

  if (!supported) return null;

  return (
    <div className="flex items-center space-x-1.5 text-[11px] bg-slate-900/80 border border-slate-700/60 rounded-lg px-2 py-1 select-none">
      {/* Play/Pause Button */}
      {isCurrentActive && isPlaying ? (
        <button
          type="button"
          onClick={handlePause}
          className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-medium p-0.5 transition-colors"
          title="Pause speech"
        >
          <Pause className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Pause</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handlePlay}
          className="text-slate-300 hover:text-amber-400 flex items-center space-x-1 font-medium p-0.5 transition-colors"
          title={isCurrentActive && isPaused ? 'Resume listening' : 'Listen to audio explanation'}
        >
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{isCurrentActive && isPaused ? 'Resume' : 'Listen'}</span>
        </button>
      )}

      {/* Stop button when active */}
      {isCurrentActive && (isPlaying || isPaused) && (
        <button
          type="button"
          onClick={handleStop}
          className="text-slate-400 hover:text-rose-400 p-0.5 transition-colors"
          title="Stop audio playback"
        >
          <Square className="w-3 h-3" />
        </button>
      )}

      {/* Speed multiplier toggle */}
      <button
        type="button"
        onClick={cycleSpeed}
        className="text-[10px] text-slate-400 hover:text-white px-1 py-0.5 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
        title="Change audio playback speed"
      >
        {playbackSpeed}x
      </button>

      {/* Animated Sound Equalizer indicator when playing */}
      {isCurrentActive && isPlaying && (
        <div className="flex items-center space-x-0.5 ml-1 h-3">
          <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
          <span className="w-0.5 bg-amber-300 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s] h-3.5" />
          <span className="w-0.5 bg-amber-500 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.2s] h-2.5" />
        </div>
      )}
    </div>
  );
};
