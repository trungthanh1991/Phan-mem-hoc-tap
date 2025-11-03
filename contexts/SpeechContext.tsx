
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';

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

  useEffect(() => {
    // Kích hoạt việc tải danh sách giọng nói
    const initialVoiceLoad = () => {
      window.speechSynthesis.getVoices();
    };
    
    window.speechSynthesis.addEventListener('voiceschanged', initialVoiceLoad);
    initialVoiceLoad();

    // Dọn dẹp khi component unmount
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', initialVoiceLoad);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cancel = useCallback(() => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingText(null);
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.warn("Trình duyệt không hỗ trợ Text-to-Speech.");
      return;
    }

    if (isSpeaking && speakingText === text) {
      cancel();
      return;
    }

    // Luôn dừng việc đọc hiện tại trước khi bắt đầu đọc mới
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // FIX: Lấy danh sách giọng nói trực tiếp tại thời điểm gọi hàm `speak`.
    // Điều này giải quyết vấn đề race condition khi danh sách giọng nói chưa được tải xong
    // lúc component render lần đầu.
    const allVoices = window.speechSynthesis.getVoices();
    
    // Logic chọn giọng nói với độ ưu tiên
    const googleVietnameseFemaleVoice = allVoices.find(v => 
        v.lang.startsWith('vi') && 
        v.name.toLowerCase().includes('google') &&
        (v.name.includes('Nữ') || v.name.toLowerCase().includes('female'))
    );
    const googleVietnameseVoice = allVoices.find(v => 
        v.lang.startsWith('vi') && 
        v.name.toLowerCase().includes('google')
    );
    const vietnameseFemaleVoice = allVoices.find(v => 
        v.lang.startsWith('vi') && 
        (v.name.includes('Nữ') || v.name.toLowerCase().includes('female'))
    );
    // Mở rộng tìm kiếm cho tất cả các giọng 'vi' để tương thích tốt hơn
    const vietnameseVoice = allVoices.find(v => v.lang.startsWith('vi'));

    utterance.voice = googleVietnameseFemaleVoice || googleVietnameseVoice || vietnameseFemaleVoice || vietnameseVoice || null;
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingText(null);
    };
    
    utterance.onerror = (e) => {
        console.error("Lỗi phát âm thanh:", e);
        setIsSpeaking(false);
        setSpeakingText(null);
    }

    window.speechSynthesis.speak(utterance);
  }, [cancel, isSpeaking, speakingText]);

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
