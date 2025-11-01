import React from 'react';
import { useSpeech } from '../contexts/SpeechContext';
import { SpeakerWaveIcon, SpeakerQuietIcon } from './icons';

interface SpeechButtonProps {
    textToSpeak: string;
    className?: string;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({ textToSpeak, className = '' }) => {
    const { speak, stop, isSpeaking, speakingText } = useSpeech();
    const isCurrentlySpeakingThis = isSpeaking && speakingText === textToSpeak;

    const handleToggleSpeech = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isCurrentlySpeakingThis) {
            stop();
        } else {
            speak(textToSpeak);
        }
    };

    return (
        <button
            onClick={handleToggleSpeech}
            className={`p-2 rounded-full hover:bg-primary-light/20 focus:outline-none focus:ring-2 focus:ring-primary-light transition-colors ${className}`}
            aria-label={isCurrentlySpeakingThis ? "Dừng đọc" : "Đọc to"}
        >
            {isCurrentlySpeakingThis ? (
                <SpeakerWaveIcon className="h-6 w-6 text-primary animate-pulse" />
            ) : (
                <SpeakerQuietIcon className="h-6 w-6 text-secondary" />
            )}
        </button>
    );
};

export default SpeechButton;
