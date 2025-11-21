import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useSound } from '../contexts/SoundContext';

const AVATARS = [
    '🦸‍♂️', '🦸‍♀️', '🤴', '👸', '🧚‍♀️', '🧜‍♀️',
    '🧙‍♂️', '🧝‍♀️', '🧛‍♂️', '🧞‍♂️', '🧟‍♂️', '🧞‍♀️',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊',
    '🐻', '🐼', '🐨', '🐯', '🦁', '🐮',
    '🐷', '🐸', '🐵', '🐔', '🐧', '🐦',
    '🦄', '🦖', '🦕', '🐙', '🦋', '🐝',
    '🤖', '👽', '👻', '💀', '💩', '🤡'
];

interface AvatarSelectorProps {
    onClose: () => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ onClose }) => {
    const { avatar, setAvatar } = useUser();
    const { playSound } = useSound();

    const handleSelect = (newAvatar: string) => {
        setAvatar(newAvatar);
        playSound('click');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 relative transform animate-scale-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    Chọn nhân vật của bé
                </h2>
                <p className="text-center text-gray-600 mb-6">Bé thích nhân vật nào nhất?</p>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 max-h-[60vh] overflow-y-auto p-2">
                    {AVATARS.map((avt) => (
                        <button
                            key={avt}
                            onClick={() => handleSelect(avt)}
                            className={`text-4xl p-4 rounded-2xl transition-all transform hover:scale-125 hover:bg-blue-50 ${avatar === avt
                                    ? 'bg-blue-100 ring-4 ring-blue-400 shadow-lg scale-110'
                                    : 'bg-gray-50 hover:shadow-md'
                                }`}
                        >
                            {avt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AvatarSelector;
