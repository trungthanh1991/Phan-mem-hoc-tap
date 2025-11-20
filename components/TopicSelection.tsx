
import React, { useState, useEffect } from 'react';
import { TOPICS, QUIZ_LENGTH } from '../constants';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import Card from './Card';
import { ClockIcon, StarIcon } from './icons';

const TopicSelection: React.FC = () => {
    const { selectedSubject, handleTopicSelect, handleBackToSubjects, error, handleStartExam } = useGame();
    const { getWeakestTopicId, stats } = useUser();
    const [recommendedTopicId, setRecommendedTopicId] = useState<string | null>(null);

    useEffect(() => {
        if (selectedSubject) {
            const weakestId = getWeakestTopicId(selectedSubject.id);
            setRecommendedTopicId(weakestId);
        }
    }, [selectedSubject, getWeakestTopicId]);

    if (!selectedSubject) {
        return null;
    }

    const hasBgImage = !!selectedSubject.backgroundImage;

    const bgStyle = hasBgImage
        ? {
              backgroundImage: `url(${selectedSubject.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
          }
        : {};

    // Lấy thống kê cho môn học hiện tại
    const currentSubjectStats = stats[selectedSubject.id] || {};

    return (
        <div
            className="text-center min-h-screen w-full py-6 px-4 relative"
            style={bgStyle}
        >
            {hasBgImage && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-0"></div>
            )}

            <div className="relative z-10 bg-transparent">
                
                <button
                    onClick={handleBackToSubjects}
                    className="text-primary hover:underline mb-6 font-medium bg-white/60 px-3 py-1 rounded-full"
                >
                    &larr; Quay lại chọn môn học
                </button>

                <h2 className="text-3xl md:text-4xl font-bold text-secondary-dark mb-2 drop-shadow-sm">
                    Môn {selectedSubject.name}
                </h2>

                <p className="text-lg text-secondary mb-8 font-medium">
                    Bé muốn ôn tập về chủ đề nào?
                </p>

                {recommendedTopicId && (
                    <Card
                        className="bg-blue-100 border border-primary text-primary-dark text-left px-4 py-3 mb-6 flex items-center gap-3 animate-fade-in-up shadow-lg"
                        role="alert"
                    >
                        <span className="text-2xl animate-bounce">💡</span>
                        <span className="font-semibold">
                            Bé nên luyện thêm chủ đề được gợi ý bên dưới nhé!
                        </span>
                    </Card>
                )}

                {error && (
                    <Card
                        className="bg-danger-light border border-danger text-danger-dark text-left px-4 py-3 mb-6"
                        role="alert"
                    >
                        {error}
                    </Card>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TOPICS[selectedSubject.id].map((topic) => {
                        const isRecommended = topic.id === recommendedTopicId;
                        const topicStat = currentSubjectStats[topic.id];
                        
                        // Tính toán tiến độ (dựa trên số câu đúng / tổng số câu đã làm, hoặc chỉ đơn giản là số lần hoàn thành)
                        // Ở đây ta dùng tỉ lệ đúng * số lượng bài đã làm để tạo cảm giác "thông thạo"
                        // Max bar = 100% nếu làm đúng > 50 câu tích lũy
                        const totalCorrect = topicStat?.totalCorrect || 0;
                        const masteryLevel = Math.min((totalCorrect / 50) * 100, 100);
                        
                        const isMastered = masteryLevel >= 100;

                        return (
                            <Card
                                key={topic.id}
                                onClick={() => handleTopicSelect(topic)}
                                className={`relative flex flex-col justify-between text-secondary-dark text-xl font-medium border-2 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${selectedSubject.lightBgColor} ${selectedSubject.borderColor} hover:bg-white ${
                                    isRecommended ? 'ring-4 ring-offset-2 ring-primary' : ''
                                }`}
                            >
                                {isRecommended && (
                                    <div className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20 animate-pulse">
                                        GỢI Ý
                                    </div>
                                )}
                                {isMastered && (
                                    <div className="absolute -top-2 -left-2 text-yellow-500 z-20 drop-shadow-md">
                                        <StarIcon className="h-8 w-8 fill-current" />
                                    </div>
                                )}

                                <div className="mb-4 z-10 relative">
                                    {topic.name}
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-white/50 rounded-full h-2.5 mt-2 overflow-hidden border border-gray-200/50">
                                    <div 
                                        className={`h-2.5 rounded-full transition-all duration-1000 ${isMastered ? 'bg-yellow-400' : selectedSubject.baseColor}`} 
                                        style={{ width: `${masteryLevel}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-right mt-1 text-secondary/70 font-normal">
                                    {totalCorrect} câu đúng
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-8 border-t-2 border-dashed border-gray-300 pt-8">
                    <h3 className="text-2xl font-bold text-secondary-dark mb-4">
                        Hoặc thử sức với...
                    </h3>

                    <Card
                        onClick={handleStartExam}
                        className="flex items-center justify-center gap-4 text-secondary-dark text-xl font-medium border-2 hover:shadow-xl transform hover:scale-105 bg-indigo-100 border-indigo-500 hover:bg-white max-w-sm mx-auto transition-all duration-300"
                    >
                        <ClockIcon className="h-8 w-8 text-indigo-600 animate-spin-slow" />
                        <span>Bài Thi Thử Tổng Hợp</span>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TopicSelection;
