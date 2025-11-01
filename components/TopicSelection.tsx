import React, { useState, useEffect } from 'react';
import { TOPICS } from '../constants';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import Card from './Card';
import { ClockIcon } from './icons';

const TopicSelection: React.FC = () => {
    const { selectedSubject, handleTopicSelect, handleBackToSubjects, error, handleStartExam } = useGame();
    const { getWeakestTopicId } = useUser();
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

    return (
        <div className="text-center">
            <button onClick={handleBackToSubjects} className="text-primary hover:underline mb-6">&larr; Quay lại chọn môn học</button>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-dark mb-2">Môn {selectedSubject.name}</h2>
            <p className="text-lg text-secondary mb-8">Bé muốn ôn tập về chủ đề nào?</p>

            {recommendedTopicId && (
                <Card className="bg-blue-100 border border-primary text-primary-dark text-left px-4 py-3 mb-6 flex items-center gap-3 animate-fade-in-up" role="alert">
                    <span className="text-2xl">💡</span>
                    <span>Dựa vào kết quả trước đó, có vẻ bé cần rèn luyện thêm về chủ đề được gợi ý bên dưới!</span>
                </Card>
            )}

            {error && <Card className="bg-danger-light border border-danger text-danger-dark text-left px-4 py-3 mb-6" role="alert">{error}</Card>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOPICS[selectedSubject.id].map((topic) => {
                    const isRecommended = topic.id === recommendedTopicId;
                    return (
                        <Card
                            key={topic.id}
                            onClick={() => handleTopicSelect(topic)}
                            className={`relative text-secondary-dark text-xl font-medium border-2 hover:shadow-xl transform hover:scale-105 ${selectedSubject.lightBgColor} ${selectedSubject.borderColor} hover:bg-white ${isRecommended ? 'ring-4 ring-offset-2 ring-primary' : ''}`}
                        >
                            {isRecommended && (
                                <div className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    GỢI Ý
                                </div>
                            )}
                            {topic.name}
                        </Card>
                    );
                })}
            </div>

            <div className="mt-8 border-t-2 border-dashed pt-8">
                <h3 className="text-2xl font-bold text-secondary-dark mb-4">Hoặc thử sức với...</h3>
                <Card
                    onClick={handleStartExam}
                    className={`flex items-center justify-center gap-4 text-secondary-dark text-xl font-medium border-2 hover:shadow-xl transform hover:scale-105 bg-indigo-100 border-indigo-500 hover:bg-white max-w-sm mx-auto`}
                >
                    <ClockIcon className="h-8 w-8 text-indigo-600" />
                    <span>Bài Thi Thử</span>
                </Card>
            </div>

        </div>
    );
};

export default TopicSelection;