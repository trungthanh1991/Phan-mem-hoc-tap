import React, { createContext, useState, useContext, ReactNode, useRef, useCallback } from 'react';
import { generateSpeech } from '../services/geminiService';

interface SpeechContextType {
    speak: (text: string) => void;
    stop: () => void;
    isSpeaking: boolean;
    speakingText: string | null;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

// Giải mã chuỗi base64 thành mảng byte
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Giải mã dữ liệu âm thanh PCM thô thành AudioBuffer có thể phát được
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


export const SpeechProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speakingText, setSpeakingText] = useState<string | null>(null);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

    const stop = useCallback(() => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.onended = null;
            sourceNodeRef.current.stop();
            sourceNodeRef.current = null;
        }
        setIsSpeaking(false);
        setSpeakingText(null);
    }, []);

    const speak = useCallback(async (text: string) => {
        if (isSpeaking) {
            stop();
        }

        setIsSpeaking(true);
        setSpeakingText(text);

        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioContext = audioContextRef.current;
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const base64Audio = await generateSpeech(text);
            const audioBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(audioBytes, audioContext, 24000, 1);
            
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            
            source.onended = () => {
                if (sourceNodeRef.current === source) {
                    setIsSpeaking(false);
                    setSpeakingText(null);
                    sourceNodeRef.current = null;
                }
            };
            
            source.start();
            sourceNodeRef.current = source;

        } catch (error) {
            console.error('Lỗi khi phát giọng nói từ Gemini:', error);
            setIsSpeaking(false);
            setSpeakingText(null);
        }
    }, [isSpeaking, stop]);

    const value = { speak, stop, isSpeaking, speakingText };

    return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
};

export const useSpeech = (): SpeechContextType => {
    const context = useContext(SpeechContext);
    if (context === undefined) {
        throw new Error('useSpeech must be used within a SpeechProvider');
    }
    return context;
};