import React from 'react';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import { SUBJECTS, TOPICS, QUIZ_LENGTH } from '../constants';
import Button from './Button';
import Card from './Card';
import { CheckCircleIcon, MedalIcon, ChartBarIcon } from './icons';

const StatCard: React.FC<{ icon: React.ElementType, value: string | number, label: string, color: string }> = ({ icon: Icon, value, label, color }) => (
    <Card className="flex items-center space-x-4 bg-white">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-8 w-8 text-white" />
        </div>
        <div>
            <p className="text-3xl font-bold text-secondary-dark">{value}</p>
            <p className="text-secondary">{label}</p>
        </div>
    </Card>
);

const PerformanceIndicator: React.FC<{ accuracy: number }> = ({ accuracy }) => {
    const getPerformanceColor = () => {
        if (accuracy >= 80) return 'text-success-dark bg-success-light';
        if (accuracy >= 50) return 'text-amber-800 bg-amber-100';
        return 'text-danger-dark bg-danger-light';
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPerformanceColor()}`}>
            {accuracy.toFixed(0)}% chính xác
        </span>
    );
};

const ParentsCornerView: React.FC = () => {
    const { handleBackToSubjects } = useGame();
    const { stats, earnedBadges } = useUser();

    let totalQuizzes = 0;
    let totalCorrectAnswers = 0;
    let totalQuestionsAsked = 0;

    Object.values(stats).forEach(subject => {
        Object.values(subject).forEach(topic => {
            totalQuizzes += topic.timesCompleted;
            totalCorrectAnswers += topic.totalCorrect;
            totalQuestionsAsked += topic.totalQuestions;
        });
    });

    const overallAverage = totalQuestionsAsked > 0 ? (totalCorrectAnswers / totalQuestionsAsked) * 100 : 0;

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 animate-fade-in-up relative">
            <div className="absolute top-0 left-0 md:top-4 md:left-4">
                <button onClick={handleBackToSubjects} className="text-primary hover:underline">&larr; Quay lại</button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-2 text-center mt-8 md:mt-0">Góc Phụ Huynh</h1>
            <p className="text-xl text-secondary mb-8 text-center">Báo cáo tiến độ học tập của bé.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <StatCard icon={CheckCircleIcon} value={totalQuizzes} label="Bài đã làm" color="bg-primary" />
                <StatCard icon={ChartBarIcon} value={`${overallAverage.toFixed(0)}%`} label="Tỷ lệ đúng" color="bg-success" />
                <StatCard icon={MedalIcon} value={earnedBadges.length} label="Huy hiệu" color="bg-warning" />
            </div>

            <div className="space-y-8">
                {SUBJECTS.map(subject => {
                    const subjectStats = stats[subject.id] || {};
                    const subjectTopics = TOPICS[subject.id] || [];
                    
                    return (
                        <Card key={subject.id} className="bg-white/90 backdrop-blur-sm p-6">
                            <div className="flex items-center gap-4 mb-4 border-b pb-3">
                                <div className={`p-2 rounded-full ${subject.lightBgColor}`}>
                                    <subject.icon className={`h-8 w-8 ${subject.baseColor.replace('bg-', 'text-')}`} />
                                </div>
                                <h3 className="text-2xl font-bold text-secondary-dark">{subject.name}</h3>
                            </div>
                            
                            {Object.keys(subjectStats).length === 0 ? (
                                <p className="text-secondary text-center py-4">Bé chưa làm bài tập nào trong môn này.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {subjectTopics.map(topic => {
                                        const topicStat = subjectStats[topic.id];
                                        if (!topicStat || topicStat.timesCompleted === 0) {
                                            return null;
                                        }
                                        const accuracy = topicStat.totalQuestions > 0 ? (topicStat.totalCorrect / topicStat.totalQuestions) * 100 : 0;
                                        
                                        return (
                                            <li key={topic.id} className="p-4 rounded-lg bg-blue-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                <div>
                                                    <p className="font-semibold text-secondary-dark">{topic.name}</p>
                                                    <p className="text-sm text-secondary">
                                                        Làm {topicStat.timesCompleted} lần &bull; Điểm cao nhất: {topicStat.bestScore}/{QUIZ_LENGTH}
                                                    </p>
                                                </div>
                                                <PerformanceIndicator accuracy={accuracy} />
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default ParentsCornerView;