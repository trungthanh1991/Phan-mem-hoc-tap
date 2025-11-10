
import React from 'react';
import { useSpeech } from '../contexts/SpeechContext';
import { SpeakerWaveIcon, SpeakerQuietIcon } from './icons';

interface SpeechButtonProps {
    textToSpeak: string;
    className?: string;
    iconSize?: string;
    lang?: 'vi-VN' | 'en-US';
}

const SpeechButton: React.FC<SpeechButtonProps> = ({ textToSpeak, className = '', iconSize = 'h-6 w-6', lang = 'vi-VN' }) => {
    const { speak, isSpeaking, speakingText } = useSpeech();

    const isCurrentlySpeaking = isSpeaking && speakingText === textToSpeak;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card clicks, etc.
        speak(textToSpeak, lang);
    };

    const baseClasses = 'p-2 rounded-full hover:bg-secondary-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary';
    
    return (
        <button
            onClick={handleClick}
            className={`${baseClasses} ${className}`}
            aria-label={isCurrentlySpeaking ? "Dừng đọc" : "Đọc to văn bản"}
        >
            {isCurrentlySpeaking ? (
                <SpeakerQuietIcon className={`${iconSize} text-primary`} />
            ) : (
                <SpeakerWaveIcon className={`${iconSize} text-secondary`} />
            )}
        </button>
    );
};

export default SpeechButton;