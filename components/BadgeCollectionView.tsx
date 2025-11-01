import React from 'react';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import { BADGES } from '../constants';
import Button from './Button';

const BadgeCollectionView: React.FC = () => {
    const { handleBackToSubjects } = useGame();
    const { earnedBadges } = useUser();

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-2">Bộ Sưu Tập Huy Hiệu</h1>
            <p className="text-xl text-secondary mb-10">Đây là những thành tích tuyệt vời của bé!</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {BADGES.map((badge) => {
                    const isEarned = earnedBadges.includes(badge.id);
                    return (
                        <div
                            key={badge.id}
                            className={`p-6 rounded-2xl flex flex-col items-center justify-start text-center transition-all duration-300 ${
                                isEarned
                                    ? 'bg-white shadow-lg'
                                    : 'bg-gray-200/50'
                            }`}
                        >
                            <div className={`relative p-4 rounded-full mb-3 ${isEarned ? 'bg-yellow-100' : 'bg-gray-300'}`}>
                                <badge.icon className={`h-16 w-16 ${isEarned ? 'text-yellow-500' : 'text-gray-500'}`} />
                                {isEarned && (
                                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <h3 className={`font-bold text-lg ${isEarned ? 'text-secondary-dark' : 'text-gray-600'}`}>
                                {badge.name}
                            </h3>
                            <p className={`text-sm mt-1 ${isEarned ? 'text-secondary' : 'text-gray-500'}`}>
                                {badge.description}
                            </p>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-12">
                <Button onClick={handleBackToSubjects} variant="secondary">
                    &larr; Quay lại
                </Button>
            </div>
        </div>
    );
};

export default BadgeCollectionView;
