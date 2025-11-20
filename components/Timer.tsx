import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ClockIcon } from './icons';

interface TimerProps {
    initialSeconds: number;
    onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialSeconds, onTimeUp }) => {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Dùng useCallback để đảm bảo onTimeUp không thay đổi trừ khi cần thiết
    const handleTimeUp = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onTimeUp();
    }, [onTimeUp]);


    useEffect(() => {
        if (secondsLeft <= 0) {
            handleTimeUp();
            return;
        }

        intervalRef.current = setInterval(() => {
            setSecondsLeft(prev => prev - 1);
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [secondsLeft, handleTimeUp]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    
    const isRunningLow = secondsLeft <= 30 && secondsLeft > 0;

    return (
        <div 
            className={`fixed top-4 right-4 z-20 flex items-center gap-2 font-bold text-lg p-2 px-4 rounded-full shadow-lg transition-colors duration-500 ${
                isRunningLow 
                ? 'bg-danger text-white animate-pulse' 
                : 'bg-white/80 backdrop-blur-sm text-secondary-dark'
            }`}
            role="timer"
            aria-live="assertive"
        >
            <ClockIcon className="h-6 w-6" />
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>
    );
};

export default Timer;
