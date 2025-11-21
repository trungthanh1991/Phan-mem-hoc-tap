
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
        // Pop sound: Rapid pitch drop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'correct':
        // Cheerful chime: C5 -> E5 -> G5 (Major triad)
        playTone(523.25, 'sine', 0.1, now, 0.1);
        playTone(659.25, 'sine', 0.1, now + 0.1, 0.1);
        playTone(783.99, 'sine', 0.4, now + 0.2, 0.1);
        break;
      case 'wrong':
        // Soft "Uh-oh": G4 -> Eb4
        playTone(392.00, 'triangle', 0.2, now, 0.08);
        playTone(311.13, 'triangle', 0.4, now + 0.25, 0.08);
        break;
      case 'win':
        // Victory fanfare: C -> E -> G -> C (High) with rhythm
        playTone(523.25, 'square', 0.1, now, 0.05);
        playTone(523.25, 'square', 0.1, now + 0.15, 0.05);
        playTone(523.25, 'square', 0.1, now + 0.30, 0.05);
        playTone(659.25, 'square', 0.4, now + 0.45, 0.05); // Long E
        playTone(783.99, 'square', 0.4, now + 0.90, 0.05); // Long G
        playTone(1046.50, 'square', 0.8, now + 1.35, 0.05); // Long C High
        break;
      case 'badge':
        // Magical sparkle
        [880, 1108, 1318, 1760, 2093].forEach((freq, i) => {
          playTone(freq, 'sine', 0.2, now + i * 0.08, 0.05);
        });
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
