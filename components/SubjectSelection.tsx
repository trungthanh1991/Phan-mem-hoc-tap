
import React from 'react';
import { SUBJECTS } from '../constants';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import { useSound } from '../contexts/SoundContext';
import Card from './Card';
import { MedalIcon, ChartBarIcon, FireIcon, SpeakerWaveIcon, SpeakerQuietIcon } from './icons';

const SubjectSelection: React.FC = () => {
    const { handleSubjectSelect, showBadgeCollection, showParentsCorner } = useGame();
    const { consecutivePlayDays } = useUser();
    const { toggleMute, isMuted } = useSound();

    return (
        <div className="text-center relative pt-10">
            {/* Top Controls */}
            <div className="absolute top-0 left-0 w-full flex justify-between items-center px-2">
                 {/* Daily Streak */}
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-orange-600 font-bold py-2 px-4 rounded-full shadow-md animate-fade-in-up">
                    <FireIcon className="h-6 w-6 animate-pulse" />
                    <span>{consecutivePlayDays} ngày</span>
                </div>

                <div className="flex gap-3">
                     {/* Sound Toggle */}
                    <button
                        onClick={toggleMute}
                        className="flex items-center justify-center bg-white/80 backdrop-blur-sm text-primary font-semibold p-2 rounded-full shadow-md hover:shadow-lg hover:bg-white transition-all"
                        aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                    >
                        {isMuted ? <SpeakerQuietIcon className="h-6 w-6 text-gray-500" /> : <SpeakerWaveIcon className="h-6 w-6" />}
                    </button>

                    {/* Badge Button */}
                    <button
                        onClick={showBadgeCollection}
                        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-yellow-600 font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg hover:bg-white transition-all transform hover:scale-105"
                        aria-label="Xem bộ sưu tập huy hiệu"
                    >
                        <MedalIcon className="h-6 w-6" />
                        <span className="hidden sm:inline">Huy hiệu</span>
                    </button>
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-2 mt-4">
                Sân Chơi Trí Tuệ
            </h1>
            <p className="text-xl text-secondary mb-10">
                Chào mừng bé! Hãy chọn một môn học để bắt đầu nhé!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {SUBJECTS.map((subject) => {
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

                    return (
                        <Card
                            key={subject.id}
                            onClick={() => handleSubjectSelect(subject)}
                            className={`relative overflow-hidden flex flex-col items-center justify-center text-center p-8 group hover:shadow-2xl transform hover:-translate-y-2 ${bgClasses} ${subject.textColor}`}
                            style={bgStyle}
                        >
                            {hasBgImage && (
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                            )}

                            <div className="relative z-10 flex flex-col items-center justify-center">
                                <div className="relative">
                                    <subject.icon className="h-20 w-20 mb-4 transition-transform duration-300 group-hover:scale-110" />
                                    <div className="absolute inset-0 -z-10 bg-white/30 rounded-full blur-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                                </div>
                                <span className="text-2xl font-bold">{subject.name}</span>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-12 text-center">
                <button
                    onClick={showParentsCorner}
                    className="flex items-center gap-2 mx-auto bg-white/80 backdrop-blur-sm text-secondary-dark font-semibold py-2 px-5 rounded-full shadow-md hover:shadow-lg hover:bg-white transition-all transform hover:scale-105"
                    aria-label="Xem báo cáo học tập"
                >
                    <ChartBarIcon className="h-6 w-6" />
                    <span>Góc Phụ Huynh</span>
                </button>
            </div>
        </div>
    );
};

export default SubjectSelection;
