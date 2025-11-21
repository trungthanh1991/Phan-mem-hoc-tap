import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';
import { SUBJECTS, TOPICS } from '../constants';
import Card from './Card';
import Button from './Button';
import { BrainIcon, TargetIcon, LightbulbIcon, ChartBarIcon } from './icons';
import { MistakeRecord } from '../types';

interface WeaknessAnalysis {
    subjectId: string;
    subjectName: string;
    topics: {
        topicId: string;
        topicName: string;
        mistakeCount: number;
        accuracy: number;
    }[];
    totalMistakes: number;
}

const SmartReviewView: React.FC = () => {
    const { stats, getUserData } = useUser();
    const { handleBackToSubjects, handleTopicSelect, handleSubjectSelect } = useGame();
    const [weaknesses, setWeaknesses] = useState<WeaknessAnalysis[]>([]);

    useEffect(() => {
        analyzeWeaknesses();
    }, [stats]);

    const analyzeWeaknesses = () => {
        const userData = getUserData();
        const mistakes = userData.mistakes || [];

        // Group mistakes by subject and topic
        const mistakesBySubject: Record<string, Record<string, MistakeRecord[]>> = {};

        mistakes.forEach(mistake => {
            if (!mistakesBySubject[mistake.subjectId]) {
                mistakesBySubject[mistake.subjectId] = {};
            }
            if (!mistakesBySubject[mistake.subjectId][mistake.topicId]) {
                mistakesBySubject[mistake.subjectId][mistake.topicId] = [];
            }
            mistakesBySubject[mistake.subjectId][mistake.topicId].push(mistake);
        });

        // Calculate weaknesses
        const analyses: WeaknessAnalysis[] = [];

        Object.keys(mistakesBySubject).forEach(subjectId => {
            const subject = SUBJECTS.find(s => s.id === subjectId);
            if (!subject) return;

            const topicAnalyses = [];
            const subjectTopics = TOPICS[subjectId] || [];

            Object.keys(mistakesBySubject[subjectId]).forEach(topicId => {
                const topic = subjectTopics.find(t => t.id === topicId);
                if (!topic) return;

                const topicMistakes = mistakesBySubject[subjectId][topicId];
                const topicStats = stats[subjectId]?.[topicId];

                const accuracy = topicStats
                    ? (topicStats.totalCorrect / topicStats.totalQuestions) * 100
                    : 0;

                topicAnalyses.push({
                    topicId: topic.id,
                    topicName: topic.name,
                    mistakeCount: topicMistakes.length,
                    accuracy
                });
            });

            // Sort by most mistakes
            topicAnalyses.sort((a, b) => b.mistakeCount - a.mistakeCount);

            const totalMistakes = topicAnalyses.reduce((sum, t) => sum + t.mistakeCount, 0);

            analyses.push({
                subjectId: subject.id,
                subjectName: subject.name,
                topics: topicAnalyses,
                totalMistakes
            });
        });

        // Sort by total mistakes
        analyses.sort((a, b) => b.totalMistakes - a.totalMistakes);
        setWeaknesses(analyses);
    };

    const handleStartReview = (subjectId: string, topicId: string) => {
        const subject = SUBJECTS.find(s => s.id === subjectId);
        const topic = TOPICS[subjectId]?.find(t => t.id === topicId);

        if (subject && topic) {
            handleSubjectSelect(subject);
            handleTopicSelect(topic);
        }
    };

    const getRecommendations = () => {
        const recs: string[] = [];

        if (weaknesses.length === 0) {
            return ['🎉 Tuyệt vời! Bé chưa có điểm yếu nào đáng kể. Hãy tiếp tục học tập!'];
        }

        weaknesses.forEach(weakness => {
            const weakestTopic = weakness.topics[0];
            if (weakestTopic && weakestTopic.accuracy < 70) {
                recs.push(`📚 Nên ôn lại "${weakestTopic.topicName}" trong môn ${weakness.subjectName}`);
            }
        });

        if (recs.length === 0) {
            recs.push('✅ Bé đang học rất tốt! Hãy thử thách bản thân với các chủ đề mới.');
        }

        return recs.slice(0, 5); // Top 5 recommendations
    };

    const totalMistakes = weaknesses.reduce((sum, w) => sum + w.totalMistakes, 0);
    const recommendations = getRecommendations();

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-6 animate-fade-in-up">
            <div className="mb-6">
                <button onClick={handleBackToSubjects} className="text-primary hover:underline mb-4">
                    &larr; Quay lại
                </button>
                <div className="flex items-center gap-3 mb-2">
                    <BrainIcon className="h-10 w-10 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">Ôn Tập Thông Minh</h1>
                </div>
                <p className="text-xl text-secondary">AI phân tích để giúp bé ôn tập hiệu quả hơn!</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500 p-3 rounded-full">
                            <TargetIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-900">{totalMistakes}</p>
                            <p className="text-sm text-blue-700">Câu cần ôn lại</p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-500 p-3 rounded-full">
                            <ChartBarIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-900">{weaknesses.length}</p>
                            <p className="text-sm text-purple-700">Môn cần chú ý</p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-500 p-3 rounded-full">
                            <LightbulbIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-amber-900">{recommendations.length}</p>
                            <p className="text-sm text-amber-700">Gợi ý ôn tập</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recommendations */}
            <Card className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
                <div className="flex items-start gap-3 mb-3">
                    <LightbulbIcon className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-xl font-bold text-indigo-900 mb-2">Gợi Ý Từ AI</h3>
                        <ul className="space-y-2">
                            {recommendations.map((rec, index) => (
                                <li key={index} className="text-indigo-800 flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold">•</span>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card>

            {/* Weakness Analysis by Subject */}
            <div className="space-y-4">
                {weaknesses.length === 0 ? (
                    <Card className="text-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-green-100 p-6 rounded-full">
                                <BrainIcon className="h-16 w-16 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-700">Chưa có dữ liệu phân tích</h3>
                            <p className="text-gray-600">Hãy làm thêm một vài bài tập để AI có thể phân tích điểm yếu của bé!</p>
                        </div>
                    </Card>
                ) : (
                    weaknesses.map((weakness) => {
                        const subject = SUBJECTS.find(s => s.id === weakness.subjectId);
                        if (!subject) return null;

                        return (
                            <Card key={weakness.subjectId} className="bg-white">
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                                    <div className={`p-2 rounded-full ${subject.lightBgColor}`}>
                                        <subject.icon className={`h-6 w-6 ${subject.baseColor.replace('bg-', 'text-')}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-secondary-dark">{weakness.subjectName}</h3>
                                        <p className="text-sm text-secondary">{weakness.totalMistakes} câu cần ôn lại</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {weakness.topics.map((topic) => (
                                        <div
                                            key={topic.topicId}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-secondary-dark">{topic.topicName}</p>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-xs text-gray-600">
                                                        {topic.mistakeCount} câu sai
                                                    </span>
                                                    <span className={`text-xs font-semibold ${topic.accuracy >= 80 ? 'text-green-600' :
                                                            topic.accuracy >= 60 ? 'text-amber-600' : 'text-red-600'
                                                        }`}>
                                                        {topic.accuracy.toFixed(0)}% độ chính xác
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => handleStartReview(weakness.subjectId, topic.topicId)}
                                                variant="secondary"
                                                className="text-sm"
                                            >
                                                Ôn tập ngay
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SmartReviewView;
