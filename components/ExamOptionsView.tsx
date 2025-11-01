import React from 'react';
import { useGame } from '../contexts/GameContext';
import Card from './Card';

const ExamOptionsView: React.FC = () => {
    const { selectedSubject, handleSelectExamDuration, handleBackToSubjects } = useGame();

    if (!selectedSubject) return null;

    return (
        <div className="w-full max-w-2xl mx-auto p-4 md:p-6 text-center animate-fade-in-up">
            <button onClick={handleBackToSubjects} className="text-primary hover:underline mb-6">&larr; Quay lại</button>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">Bài Thi Thử</h1>
            <p className="text-xl text-secondary mb-8">Bé muốn thử sức với bài thi có độ dài thế nào?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card onClick={() => handleSelectExamDuration('short')} className="bg-green-100 border-green-500 hover:bg-white text-center">
                    <h3 className="text-2xl font-bold text-green-700">Ngắn</h3>
                    <p className="text-green-600 mt-1">Kiểm tra nhanh</p>
                </Card>
                <Card onClick={() => handleSelectExamDuration('medium')} className="bg-amber-100 border-amber-500 hover:bg-white text-center">
                     <h3 className="text-2xl font-bold text-amber-700">Trung bình</h3>
                    <p className="text-amber-600 mt-1">Thử thách vừa sức</p>
                </Card>
                <Card onClick={() => handleSelectExamDuration('long')} className="bg-red-100 border-red-500 hover:bg-white text-center">
                     <h3 className="text-2xl font-bold text-red-700">Dài</h3>
                    <p className="text-red-600 mt-1">Ôn tập toàn diện</p>
                </Card>
            </div>
        </div>
    );
};
export default ExamOptionsView;