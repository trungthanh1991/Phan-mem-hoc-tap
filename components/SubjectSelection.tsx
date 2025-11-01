
import React from 'react';
import { SUBJECTS } from '../constants';
import { useGame } from '../contexts/GameContext';
import Card from './Card';
import { MedalIcon, ChartBarIcon } from './icons';

const SubjectSelection: React.FC = () => {
    const { handleSubjectSelect, showBadgeCollection, showParentsCorner } = useGame();

    return (
        <div className="text-center relative">
             <div className="absolute top-0 right-0 -mt-4">
                <button
                    onClick={showBadgeCollection}
                    className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-yellow-600 font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg hover:bg-white transition-all transform hover:scale-105"
                    aria-label="Xem bộ sưu tập huy hiệu"
                >
                    <MedalIcon className="h-6 w-6" />
                    <span>Huy hiệu</span>
                </button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-2">Sân Chơi Trí Tuệ</h1>
            <p className="text-xl text-secondary mb-10">Chào mừng bé! Hãy chọn một môn học để bắt đầu nhé!</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {SUBJECTS.map((subject) => (
                    <Card
                        key={subject.id}
                        onClick={() => handleSubjectSelect(subject)}
                        className={`flex flex-col items-center justify-center text-center p-8 group hover:shadow-2xl transform hover:-translate-y-2 bg-gradient-to-br ${subject.gradientFrom} ${subject.gradientTo} ${subject.textColor}`}
                    >
                        <div className="relative">
                            <subject.icon className="h-20 w-20 mb-4 transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 -z-10 bg-white/30 rounded-full blur-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                        </div>
                        <span className="text-2xl font-bold">{subject.name}</span>
                    </Card>
                ))}
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