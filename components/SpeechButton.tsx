import React from 'react';

interface SpeechButtonProps {
    textToSpeak: string;
    className?: string;
}

// Chức năng đọc thành tiếng đã được vô hiệu hóa để tiết kiệm tài nguyên API.
// Component này không còn được sử dụng và sẽ không hiển thị gì.
const SpeechButton: React.FC<SpeechButtonProps> = () => {
    return null;
};

export default SpeechButton;