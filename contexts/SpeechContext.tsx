import React, { createContext, useState, useContext, ReactNode, useCallback, useRef } from 'react';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cancel = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ''; // Ngăn tải thêm
      audioRef.current = null;
    }
    setIsSpeaking(false);
    setSpeakingText(null);
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!text) return;

    // Nếu đang đọc cùng một văn bản thì bấm lần nữa để dừng
    if (isSpeaking && speakingText === text) {
      cancel();
      return;
    }

    // Nếu đang đọc văn bản khác, hủy nó trước khi bắt đầu cái mới
    if (isSpeaking) {
      cancel();
    }
    
    setIsSpeaking(true);
    setSpeakingText(text);

    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=vi&client=tw-ob`;
      const audio = new Audio(url);
      audioRef.current = audio;
      
      const onEnd = () => {
          if (audioRef.current === audio) {
              cancel();
          }
          // Dọn dẹp listener
          audio.removeEventListener('ended', onEnd);
          audio.removeEventListener('error', onError);
      };

      const onError = (e: ErrorEvent) => {
          console.error("Lỗi khi lấy hoặc phát âm thanh TTS:", e);
          if (audioRef.current === audio) {
              cancel();
          }
           // Dọn dẹp listener
          audio.removeEventListener('ended', onEnd);
          audio.removeEventListener('error', onError);
      };

      audio.addEventListener('ended', onEnd);
      audio.addEventListener('error', onError);
      
      await audio.play();

    } catch (error) {
      console.error("Lỗi khi khởi tạo phát âm thanh TTS:", error);
      cancel(); // Đặt lại trạng thái nếu có lỗi
    }
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
