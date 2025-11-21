import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useRef } from 'react';

interface SpeechContextType {
  speak: (text: string, lang?: 'vi-VN' | 'en-US') => void;
  cancel: () => void;
  isSpeaking: boolean;
  speakingText: string | null;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export const SpeechProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Tải giọng đọc ngay lập tức nếu có
      loadVoices();
      // Và lắng nghe sự kiện khi danh sách giọng đọc thay đổi hoặc được tải xong
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        window.speechSynthesis.cancel();
      };
    }
  }, []);


  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback((text: string, lang: 'vi-VN' | 'en-US' = 'vi-VN') => {
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

    utterance.lang = lang;
    utterance.pitch = 1.2;
    utterance.rate = lang === 'en-US' ? 1.0 : 0.9;
    utterance.volume = 1;

    // Sử dụng Web Speech API có sẵn của trình duyệt để chọn giọng đọc
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (lang === 'vi-VN') {
      // Tìm giọng Việt Nam từ Web Speech API
      // Ưu tiên: Google Vietnamese > Microsoft Vietnamese > bất kỳ giọng vi-VN nào
      selectedVoice = voices.find(v =>
        v.lang === 'vi-VN' && v.name.toLowerCase().includes('google')
      ) || voices.find(v =>
        v.lang === 'vi-VN' && v.name.toLowerCase().includes('microsoft')
      ) || voices.find(v =>
        v.lang.startsWith('vi')
      );

      console.log('🇻🇳 Giọng Việt được chọn:', selectedVoice?.name || 'Mặc định trình duyệt');

    } else if (lang === 'en-US') {
      // Tìm giọng Anh - Ưu tiên giọng nữ UK
      selectedVoice = voices.find(v =>
        v.lang === 'en-GB' && v.name.toLowerCase().includes('female')
      ) || voices.find(v =>
        v.lang === 'en-GB'
      ) || voices.find(v =>
        v.lang === 'en-US' && v.name.toLowerCase().includes('female')
      ) || voices.find(v =>
        v.lang.startsWith('en')
      );

      console.log('🇬🇧 Giọng Anh được chọn:', selectedVoice?.name || 'Mặc định trình duyệt');
    }

    // Áp dụng giọng đọc đã chọn
    if (selectedVoice) {
      utterance.voice = selectedVoice;
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
  }, [cancel, isSpeaking, speakingText, voices]);

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