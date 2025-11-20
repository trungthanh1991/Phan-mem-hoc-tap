
import React, { createContext, useContext, useRef, useCallback, ReactNode } from 'react';

type SoundType = 'click' | 'correct' | 'wrong' | 'win' | 'badge';

interface SoundContextType {
  playSound: (type: SoundType) => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = React.useState(false);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number, volume: number = 0.1) => {
    if (!audioCtxRef.current || isMuted) return;
    const ctx = audioCtxRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const playSound = useCallback((type: SoundType) => {
    initAudio();
    if (!audioCtxRef.current || isMuted) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    switch (type) {
      case 'click':
        playTone(600, 'sine', 0.1, now, 0.05);
        break;
      case 'correct':
        // Ding-dong: C5 -> E5
        playTone(523.25, 'sine', 0.3, now, 0.1);
        playTone(659.25, 'sine', 0.6, now + 0.1, 0.1);
        break;
      case 'wrong':
        // Buzz low
        playTone(150, 'sawtooth', 0.3, now, 0.05);
        playTone(130, 'sawtooth', 0.3, now + 0.1, 0.05);
        break;
      case 'win':
        // Fanfare arpeggio
        playTone(523.25, 'triangle', 0.2, now, 0.1); // C
        playTone(659.25, 'triangle', 0.2, now + 0.1, 0.1); // E
        playTone(783.99, 'triangle', 0.2, now + 0.2, 0.1); // G
        playTone(1046.50, 'triangle', 0.8, now + 0.3, 0.1); // C high
        break;
      case 'badge':
        // Magical twinkle
        playTone(880, 'sine', 0.1, now, 0.1);
        playTone(1108, 'sine', 0.1, now + 0.1, 0.1);
        playTone(1318, 'sine', 0.1, now + 0.2, 0.1);
        playTone(1760, 'sine', 0.4, now + 0.3, 0.1);
        break;
    }
  }, [initAudio, isMuted]);

  const toggleMute = () => setIsMuted(prev => !prev);

  return (
    <SoundContext.Provider value={{ playSound, toggleMute, isMuted }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
