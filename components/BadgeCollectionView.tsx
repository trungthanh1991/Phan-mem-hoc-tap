
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import { BADGES } from '../constants';

const BadgeCollectionView: React.FC = () => {
    const { handleBackToSubjects } = useGame();
    const { earnedBadges } = useUser();

    const categories = {
        achievement: { name: '🏆 Cột mốc', badges: BADGES.filter(b => ['first_quiz', 'grand_master_20', 'ultimate_achiever', 'marathon_runner', 'quiz_pro_25', 'quiz_master_50', 'quiz_legend_100'].includes(b.id)) },
        perfection: { name: '⭐ Hoàn hảo', badges: BADGES.filter(b => ['perfect_score', 'perfectionist', 'perfect_score_5', 'perfect_score_10', 'correct_100', 'correct_500'].includes(b.id)) },
        subjects: { name: '📚 Môn học', badges: BADGES.filter(b => ['math_whiz', 'language_lover', 'science_sleuth', 'english_explorer', 'subject_master', 'all_rounder'].includes(b.id)) },
        special: { name: '✨ Đặc biệt', badges: BADGES.filter(b => !['first_quiz', 'grand_master_20', 'ultimate_achiever', 'marathon_runner', 'quiz_pro_25', 'quiz_master_50', 'quiz_legend_100', 'perfect_score', 'perfectionist', 'perfect_score_5', 'perfect_score_10', 'correct_100', 'correct_500', 'math_whiz', 'language_lover', 'science_sleuth', 'english_explorer', 'subject_master', 'all_rounder'].includes(b.id)).slice(0, 12) }
    };

    const earnedCount = earnedBadges.length;
    const totalCount = BADGES.length;
    const progressPercentage = (earnedCount / totalCount) * 100;

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 text-center relative pb-20">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={handleBackToSubjects}
                    className="absolute top-0 left-0 md:relative md:top-auto md:left-auto mb-4 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-bold px-6 py-3 rounded-full shadow-cartoon hover:shadow-cartoon-hover transform hover:scale-105 transition-all"
                >
                    ⬅️ Quay lại
                </button>

                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-3 mt-12 md:mt-0 animate-rainbow-pulse">
                    🏆 Bộ Sưu Tập Huy Hiệu
                </h1>
                <p className="text-2xl text-gray-700 font-semibold">
                    ⭐ Chiến tích vẻ vang của bé!
                </p>
            </div>

            {/* Progress Summary */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 shadow-cartoon mb-12 border-4 border-purple-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-2xl p-6 shadow-cartoon">
                        <div className="text-5xl font-black text-yellow-600 mb-2">{earnedCount}</div>
                        <div className="text-gray-700 font-semibold">🏅 Đã đạt được</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-cartoon">
                        <div className="text-5xl font-black text-blue-600 mb-2">{totalCount - earnedCount}</div>
                        <div className="text-gray-700 font-semibold">🎯 Còn lại</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-cartoon">
                        <div className="text-5xl font-black text-green-600 mb-2">{progressPercentage.toFixed(0)}%</div>
                        <div className="text-gray-700 font-semibold">📊 Hoàn thành</div>
                    </div>
                </div>

                <div className="text-left">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-purple-800">Tiến độ thu thập:</span>
                        <span className="text-lg font-bold text-purple-800">{earnedCount} / {totalCount}</span>
                    </div>
                    <div className="w-full bg-white/60 rounded-full h-8 shadow-inner overflow-hidden border-4 border-purple-300">
                        <div
                            className="h-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-1000 rounded-full relative"
                            style={{ width: `${progressPercentage}%` }}
                        >
                            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Badge Categories */}
            <div className="space-y-10">
                {Object.entries(categories).map(([key, category]) => (
                    <div key={key}>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left flex items-center gap-3">
                            {category.name}
                            <span className="text-lg font-semibold bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
                                {category.badges.filter(b => earnedBadges.includes(b.id)).length}/{category.badges.length}
                            </span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {category.badges.map((badge) => {
                                const isEarned = earnedBadges.includes(badge.id);
                                return (
                                    <div
                                        key={badge.id}
                                        className={`p-6 rounded-3xl flex flex-col items-center justify-start text-center transform transition-all duration-300 ${isEarned
                                                ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-400 shadow-cartoon hover:scale-110 animate-fade-in-up'
                                                : 'bg-gray-200/70 border-4 border-gray-300 grayscale hover:grayscale-0'
                                            }`}
                                    >
                                        <div className={`relative p-4 rounded-full mb-4 ${isEarned ? 'bg-white shadow-lg' : 'bg-gray-300'}`}>
                                            <badge.icon className={`h-16 w-16 ${isEarned ? 'text-yellow-600' : 'text-gray-500'}`} />
                                            {isEarned && (
                                                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg animate-bounce-fun">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className={`font-black text-base mb-2 ${isEarned ? 'text-gray-800' : 'text-gray-600'}`}>
                                            {badge.name}
                                        </h3>
                                        <p className={`text-sm leading-tight ${isEarned ? 'text-gray-700' : 'text-gray-500'}`}>
                                            {badge.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Motivational Message */}
            {earnedCount < totalCount && (
                <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl p-8 shadow-cartoon">
                    <h3 className="text-3xl font-bold mb-3">🎯 Tiếp tục phấn đấu!</h3>
                    <p className="text-xl">
                        Còn <span className="font-black text-yellow-300">{totalCount - earnedCount}</span> huy hiệu đang chờ bé chinh phục! 💪
                    </p>
                </div>
            )}

            {earnedCount === totalCount && (
                <div className="mt-12 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-3xl p-10 shadow-cartoon animate-bounce-fun">
                    <div className="text-6xl mb-4">👑</div>
                    <h3 className="text-4xl font-black mb-3">Chúc mừng! Bé quá xuất sắc!</h3>
                    <p className="text-2xl font-bold">
                        Bé đã thu thập hết tất cả {totalCount} huy hiệu! 🎉✨🏆
                    </p>
                </div>
            )}
        </div>
    );
};

export default BadgeCollectionView;
