
import React from 'react';
import { SUBJECTS } from '../constants';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import { useSound } from '../contexts/SoundContext';
import Card from './Card';
import { MedalIcon, ChartBarIcon, FireIcon, SpeakerWaveIcon, SpeakerQuietIcon } from './icons';

const SubjectSelection: React.FC = () => {
    const { handleSubjectSelect, showBadgeCollection, showParentsCorner } = useGame();
    const { consecutivePlayDays, stats, earnedBadges } = useUser();
    const { toggleMute, isMuted } = useSound();

    return (
        <div className="text-center relative pt-10 px-4">
            {/* Top Controls */}
            <div className="absolute top-0 left-0 w-full flex justify-between items-center px-4">
                {/* Daily Streak - More fun! */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold py-3 px-5 rounded-full shadow-cartoon transform hover:scale-110 transition-all animate-float">
                    <FireIcon className="h-7 w-7 animate-bounce-fun" />
                    <span className="text-lg">🔥 {consecutivePlayDays} ngày</span>
                </div>

                <div className="flex gap-3">
                    {/* Sound Toggle */}
                    <button
                        onClick={toggleMute}
                        className="flex items-center justify-center bg-white text-primary font-semibold p-3 rounded-full shadow-cartoon hover:shadow-cartoon-hover transition-all transform hover:rotate-12"
                        aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                    >
                        {isMuted ? <SpeakerQuietIcon className="h-7 w-7 text-gray-500" /> : <SpeakerWaveIcon className="h-7 w-7" />}
                    </button>

                    {/* Badge Button - More attractive with notification */}
                    <button
                        onClick={showBadgeCollection}
                        className="relative flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-5 rounded-full shadow-cartoon hover:shadow-cartoon-hover transition-all transform hover:scale-110"
                        aria-label="Xem bộ sưu tập huy hiệu"
                    >
                        <MedalIcon className="h-7 w-7 animate-wiggle" />
                        <span className="hidden sm:inline">🏆 Huy hiệu</span>

                        {/* Blinking Badge Count */}
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full shadow-lg animate-bounce-fun min-w-[28px] text-center">
                            <span className="animate-pulse">{earnedBadges.length}</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Title with playful style */}
            <div className="mt-4 mb-8">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-3 animate-rainbow-pulse">
                    🎮 Sân Chơi Trí Tuệ ✨
                </h1>
                <p className="text-2xl text-gray-700 font-semibold">
                    👋 Chào bé yêu! Chọn môn học để khám phá nhé! 🚀
                </p>
            </div>

            {/* Subject cards with fun animations and stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {SUBJECTS.map((subject, index) => {
                    const hasBgImage = !!subject.backgroundImage;
                    const bgStyle = hasBgImage
                        ? {
                            backgroundImage: `url(${subject.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }
                        : {};

                    const bgClasses = hasBgImage
                        ? 'bg-cover bg-center'
                        : `bg-gradient-to-br ${subject.gradientFrom || ''} ${subject.gradientTo || ''}`;

                    // Fun emoji for each subject
                    const subjectEmojis: { [key: string]: string } = {
                        'Toán học': '🔢',
                        'Tiếng Việt': '📖',
                        'Tự nhiên & Xã hội': '🌍',
                        'Tiếng Anh': '🎯'
                    };

                    // Calculate stats for this subject
                    const subjectStats = stats[subject.id] || {};
                    let totalQuizzes = 0;
                    let totalCorrect = 0;
                    let totalQuestions = 0;

                    Object.values(subjectStats).forEach((topicStat: any) => {
                        totalQuizzes += topicStat.timesCompleted;
                        totalCorrect += topicStat.totalCorrect;
                        totalQuestions += topicStat.totalQuestions;
                    });

                    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
                    const masteryLevel = Math.min((totalCorrect / 100) * 100, 100);
                    const hasProgress = totalQuizzes > 0;

                    return (
                        <Card
                            key={subject.id}
                            onClick={() => handleSubjectSelect(subject)}
                            className={`relative overflow-hidden flex flex-col items-center justify-center text-center p-6 group hover:shadow-2xl transform hover:-translate-y-3 hover:scale-105 transition-all duration-300 shadow-cartoon-hover ${bgClasses} ${subject.textColor}`}
                            style={{
                                ...bgStyle,
                                animationDelay: `${index * 0.1}s`,
                                minHeight: '280px'
                            }}
                        >
                            {hasBgImage && (
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                            )}

                            <div className="relative z-10 flex flex-col items-center justify-center w-full">
                                {/* Emoji badge */}
                                <div className="absolute -top-3 -right-3 text-4xl animate-bounce-fun">
                                    {subjectEmojis[subject.name] || '📚'}
                                </div>

                                <div className="relative mb-3">
                                    <subject.icon className="h-24 w-24 transition-all duration-300 group-hover:scale-125 group-hover:rotate-6 drop-shadow-xl" />
                                    <div className="absolute inset-0 -z-10 bg-white/40 rounded-full blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 animate-pulse"></div>
                                </div>

                                <span className="text-2xl font-bold drop-shadow-lg mb-4">
                                    {subject.name}
                                </span>

                                {/* Achievement Stats */}
                                {hasProgress ? (
                                    <div className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-4 space-y-2 shadow-lg">
                                        <div className="flex justify-between items-center text-gray-800">
                                            <span className="text-sm font-semibold">📝 Bài đã làm:</span>
                                            <span className="text-lg font-black">{totalQuizzes}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-800">
                                            <span className="text-sm font-semibold">✅ Độ chính xác:</span>
                                            <span className={`text-lg font-black ${accuracy >= 80 ? 'text-green-600' :
                                                accuracy >= 60 ? 'text-yellow-600' : 'text-orange-600'
                                                }`}>
                                                {accuracy.toFixed(0)}%
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-xs font-bold text-gray-700">Mức độ thành thạo:</span>
                                                <span className="text-xs font-bold text-purple-700">{masteryLevel.toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                                                    style={{ width: `${masteryLevel}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-sm font-bold text-gray-800 block">
                                            👆 Bắt đầu học ngay!
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}</div>

            {/* Parents corner - subtle but accessible */}
            <div className="mt-12 text-center">
                <button
                    onClick={showParentsCorner}
                    className="flex items-center gap-2 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-cartoon hover:shadow-cartoon-hover transition-all transform hover:scale-105"
                    aria-label="Xem báo cáo học tập"
                >
                    <ChartBarIcon className="h-6 w-6" />
                    <span>📊 Góc Phụ Huynh</span>
                </button>
            </div>
        </div>
    );
};

export default SubjectSelection;
