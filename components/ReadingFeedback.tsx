import React from 'react';
import { ReadingAnalysis } from '../types';
import Card from './Card';

interface Props {
    passage: string;
    analysis: ReadingAnalysis;
}

const ReadingFeedback: React.FC<Props> = ({ passage, analysis }) => {
    const { accuracy, incorrectWords, unclearWords, missedWords, feedback } = analysis;

    const incorrectMap = new Map(incorrectWords.map(item => [item.expected.toLowerCase(), item.actual]));
    const unclearSet = new Set(unclearWords.map(word => word.toLowerCase()));
    const missedSet = new Set((missedWords || []).map(word => word.toLowerCase()));

    const getAccuracyColor = () => {
        if (accuracy >= 80) return 'text-success-dark';
        if (accuracy >= 50) return 'text-amber-800';
        return 'text-danger-dark';
    };

    const renderPassageWithFeedback = () => {
        const words = passage.split(/(\s+)/); // Tách từ và giữ lại khoảng trắng
        return words.map((word, index) => {
            const cleanWord = word.replace(/[.,?!]/g, '').toLowerCase();
            if (incorrectMap.has(cleanWord)) {
                return (
                    <span key={index} className="group relative">
                        <span className="bg-red-200 text-red-800 rounded px-1 py-0.5 decoration-2 underline decoration-red-500 decoration-wavy">{word}</span>
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-secondary-dark text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            Bé đọc: "{incorrectMap.get(cleanWord)}"
                        </span>
                    </span>
                );
            }
            if (unclearSet.has(cleanWord)) {
                 return (
                    <span key={index} className="group relative">
                        <span className="bg-amber-200 text-amber-800 rounded px-1 py-0.5 decoration-2 underline decoration-amber-500 decoration-wavy">{word}</span>
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-secondary-dark text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            Từ này đọc chưa rõ
                        </span>
                    </span>
                );
            }
            if (missedSet.has(cleanWord)) {
                return (
                    <span key={index} className="group relative">
                        <span className="bg-gray-200 text-gray-600 rounded px-1 py-0.5 line-through decoration-gray-500">{word}</span>
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-secondary-dark text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            Bé bỏ qua từ này
                        </span>
                    </span>
                );
            }
            return <span key={index}>{word}</span>;
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <Card className="bg-blue-50">
                    <p className="text-lg font-semibold text-secondary">Tỷ lệ chính xác</p>
                    <p className={`text-5xl font-bold ${getAccuracyColor()}`}>{accuracy.toFixed(0)}%</p>
                </Card>
                 <Card className="bg-blue-50 flex flex-col justify-center">
                    <p className="text-lg font-semibold text-secondary">Nhận xét từ AI</p>
                    <p className="text-xl font-bold text-primary-dark">"{feedback}"</p>
                </Card>
            </div>
            <div>
                 <p className="text-lg font-semibold text-secondary-dark mb-2 text-center">Phân tích chi tiết:</p>
                <p className="text-2xl leading-relaxed text-secondary-dark">
                    {renderPassageWithFeedback()}
                </p>
                 <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 justify-center">
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-red-200 border border-red-400"></span>
                        <span className="text-sm text-secondary-dark">Đọc sai</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-amber-200 border border-amber-400"></span>
                        <span className="text-sm text-secondary-dark">Đọc chưa rõ</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-gray-200 border border-gray-400"></span>
                        <span className="text-sm text-secondary-dark">Bỏ qua</span>
                    </div>
                </div>
            </div>
           
        </div>
    );
};

export default ReadingFeedback;