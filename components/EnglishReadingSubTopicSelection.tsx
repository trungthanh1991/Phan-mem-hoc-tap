import React from 'react';
import { ENGLISH_READING_SUBTOPICS } from '../constants';
import { useGame } from '../contexts/GameContext';
import Card from './Card';

const EnglishReadingSubTopicSelection: React.FC = () => {
    const { selectedSubject, handleEnglishSubTopicSelect, handleBackToTopicSelection } = useGame();

    if (!selectedSubject) {
        return null;
    }

    return (
        <div className="text-center w-full max-w-4xl mx-auto py-6 px-4">
            <button
                onClick={handleBackToTopicSelection}
                className="text-primary hover:underline mb-6"
            >
                &larr; Quay lại chọn chủ đề
            </button>

            <h2 className="text-3xl md:text-4xl font-bold text-secondary-dark mb-2">
                Luyện Đọc Tiếng Anh
            </h2>

            <p className="text-lg text-secondary mb-8">
                Bé muốn đọc từ vựng về chủ đề nhỏ nào?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ENGLISH_READING_SUBTOPICS.map((subTopic) => (
                    <Card
                        key={subTopic.id}
                        onClick={() => handleEnglishSubTopicSelect(subTopic)}
                        className={`relative text-secondary-dark text-lg font-medium border-2 hover:shadow-xl transform hover:scale-105 ${selectedSubject.lightBgColor} ${selectedSubject.borderColor} hover:bg-white`}
                    >
                        {subTopic.name}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default EnglishReadingSubTopicSelection;
