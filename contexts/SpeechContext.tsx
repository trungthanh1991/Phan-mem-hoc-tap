import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useRef } from 'react';

interface SpeechContextType {
  speak: (text: string) => void;
  cancel: () => void;
  isSpeaking: boolean;
  speakingText: string | null;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export const SpeechProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!text) return;
    
    if (isSpeaking && speakingText === text) {
      cancel();
      return;
    }
    
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.error("Web Speech API không được hỗ trợ trên trình duyệt này.");
        return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.lang = 'vi-VN';
    utterance.pitch = 1.2; 
    utterance.rate = 0.9;  
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find(voice => voice.lang === 'vi-VN');
    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingText(null);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Lỗi khi đọc văn bản:', event);
      setIsSpeaking(false);
      setSpeakingText(null);
      utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  }, [cancel, isSpeaking, speakingText]);

  useEffect(() => {
    const handleVoicesChanged = () => {
      // Cần thiết để tải danh sách giọng đọc trên một số trình duyệt
    };
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        // Tải giọng đọc ngay khi có thể
        window.speechSynthesis.getVoices();
    }
    
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const value = { speak, cancel, isSpeaking, speakingText };

  return (
    <SpeechContext.Provider value={value}>
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = (): SpeechContextType => {
  const context = useContext(SpeechContext);
  if (context === undefined) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  return context;
};
