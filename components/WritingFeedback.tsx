import React from 'react';
import { WritingAnalysis } from '../types';
import Card from './Card';

interface Props {
    passage: string;
    analysis: WritingAnalysis;
    handwritingImage: string;
}

const ScoreIndicator: React.FC<{ score: number; label: string; color: string }> = ({ score, label, color }) => {
    const circumference = 2 * Math.PI * 45; // Bán kính 45
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-28 h-28">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                        className="text-gray-200"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                    />
                    <circle
                        className={color}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-secondary-dark">
                    {score}
                </span>
            </div>
            <p className="mt-2 font-semibold text-secondary">{label}</p>
        </div>
    );
};

const WritingFeedback: React.FC<Props> = ({ passage, analysis, handwritingImage }) => {
    const { legibilityScore, neatnessScore, correctnessScore, positiveFeedback, constructiveSuggestion } = analysis;

    return (
        <div className="space-y-6 w-full animate-fade-in-up">
            <Card className="bg-white">
                <h3 className="text-xl font-bold text-primary-dark mb-4 text-center">AI nhận xét bài viết của bé</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <ScoreIndicator score={legibilityScore} label="Dễ đọc" color="text-success" />
                    <ScoreIndicator score={neatnessScore} label="Ngay ngắn" color="text-primary" />
                    <ScoreIndicator score={correctnessScore} label="Đúng chuẩn" color="text-warning" />
                </div>
                <div className="space-y-4 text-center">
                    <div className="bg-green-100 p-3 rounded-lg">
                        <p className="font-semibold text-green-800">⭐ Lời khen: "{positiveFeedback}"</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                        <p className="font-semibold text-blue-800">💡 Góp ý: "{constructiveSuggestion}"</p>
                    </div>
                </div>
            </Card>

            <Card className="bg-white">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                     <div>
                         <h4 className="text-lg font-bold text-secondary-dark mb-2">Đoạn văn mẫu</h4>
                         <p className="text-xl p-4 bg-gray-100 rounded-lg">{passage}</p>
                     </div>
                      <div>
                         <h4 className="text-lg font-bold text-secondary-dark mb-2">Bài viết của bé</h4>
                         <img src={handwritingImage} alt="Chữ viết của bé" className="w-full rounded-lg border" />
                     </div>
                 </div>
            </Card>
        </div>
    );
};

export default WritingFeedback;