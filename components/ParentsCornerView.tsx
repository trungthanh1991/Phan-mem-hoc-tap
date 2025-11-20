import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import { SUBJECTS, TOPICS, QUIZ_LENGTH } from '../constants';
import Button from './Button';
import Card from './Card';
import { CheckCircleIcon, MedalIcon, ChartBarIcon, ClockIcon, BoltIcon, XCircleIcon, ShieldCheckIcon } from './icons';
import ReadingFeedback from './ReadingFeedback';
import { POST as checkSystemApi } from '../api/check-system';
import { ApiStatus } from '../services/geminiService';

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
    const { stats, earnedBadges, readingHistory } = useUser();
    
    // State cho phần kiểm tra API
    const [isCheckingApi, setIsCheckingApi] = useState(false);
    const [apiStatuses, setApiStatuses] = useState<ApiStatus[] | null>(null);

    const handleCheckSystem = async () => {
        setIsCheckingApi(true);
        setApiStatuses(null);
        try {
            const results = await checkSystemApi();
            setApiStatuses(results);
        } catch (error) {
            console.error("Lỗi kiểm tra hệ thống:", error);
        } finally {
            setIsCheckingApi(false);
        }
    };

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
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 animate-fade-in-up relative pb-20">
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
                    const examStat = subjectStats['exam'];
                    
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
                                                        Làm {topicStat.timesCompleted} lần &bull; Điểm cao nhất: {topicStat.bestScore}/{topic.id === 'doc_doan_van' ? topicStat.totalQuestions / topicStat.timesCompleted : QUIZ_LENGTH}
                                                    </p>
                                                </div>
                                                <PerformanceIndicator accuracy={accuracy} />
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                            
                            {examStat && examStat.timesCompleted > 0 && (
                                <div className="mt-6 pt-4 border-t-2 border-dashed">
                                    <h4 className="text-xl font-bold text-secondary-dark mb-3 text-center flex items-center justify-center gap-2">
                                        <ClockIcon className="h-6 w-6" />
                                        <span>Thống kê Bài Thi Thử</span>
                                    </h4>
                                    <div className="p-4 rounded-lg bg-indigo-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <div>
                                            <p className="font-semibold text-secondary-dark">Tổng hợp các bài thi đã làm</p>
                                            <p className="text-sm text-secondary">
                                                Làm {examStat.timesCompleted} lần &bull; Điểm cao nhất: {examStat.bestScore} điểm
                                            </p>
                                        </div>
                                        <PerformanceIndicator accuracy={examStat.totalQuestions > 0 ? (examStat.totalCorrect / examStat.totalQuestions) * 100 : 0} />
                                    </div>
                                </div>
                            )}

                            {subject.id === 'tieng_viet' && readingHistory.length > 0 && (
                                <div className="mt-6 pt-4 border-t-2 border-dashed">
                                    <h4 className="text-xl font-bold text-secondary-dark mb-3 text-center">Lịch sử Luyện Đọc</h4>
                                    <div className="space-y-4">
                                        {readingHistory.slice(0, 5).map((record, index) => ( // Hiển thị 5 bài gần nhất
                                            <Card key={index} className="bg-white p-0 overflow-hidden shadow-sm">
                                                <details className="group">
                                                    <summary className="p-4 cursor-pointer flex justify-between items-center group-hover:bg-blue-50/70 transition-colors">
                                                        <div>
                                                            <p className="font-semibold text-secondary-dark">
                                                                "{record.passage.substring(0, 40)}..."
                                                            </p>
                                                            <p className="text-sm text-secondary">
                                                                Ngày: {new Date(record.timestamp).toLocaleDateString('vi-VN')}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-4 flex-shrink-0">
                                                            <PerformanceIndicator accuracy={record.analysis.accuracy} />
                                                            <span className="text-xl text-secondary transform transition-transform duration-300 group-open:rotate-90">&#9654;</span>
                                                        </div>
                                                    </summary>
                                                    <div className="p-4 border-t bg-gray-50">
                                                        <ReadingFeedback passage={record.passage} analysis={record.analysis} />
                                                    </div>
                                                </details>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>

            {/* Section Kiểm Tra Hệ Thống */}
            <div className="mt-12">
                <Card className="bg-gray-100 border-2 border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheckIcon className="h-10 w-10 text-secondary-dark" />
                            <div>
                                <h3 className="text-xl font-bold text-secondary-dark">Kiểm tra hệ thống</h3>
                                <p className="text-secondary text-sm">Kiểm tra trạng thái kết nối của các khóa API.</p>
                            </div>
                        </div>
                        <Button 
                            onClick={handleCheckSystem} 
                            variant="secondary" 
                            className="py-2 px-6 text-sm"
                            isLoading={isCheckingApi}
                            loadingText="Đang kiểm tra..."
                        >
                            Kiểm tra kết nối
                        </Button>
                    </div>

                    {apiStatuses && (
                        <div className="mt-6 space-y-3 bg-white rounded-xl p-4 shadow-inner">
                            {apiStatuses.map((status) => (
                                <div key={status.keyName} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono font-bold text-secondary-dark">{status.keyName}</span>
                                        {status.status === 'active' && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Active</span>}
                                        {status.status === 'error' && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Error</span>}
                                        {status.status === 'missing' && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Missing</span>}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        {status.status === 'active' && (
                                            <>
                                                <span className="text-success">{status.message} ({status.latency}ms)</span>
                                                <CheckCircleIcon className="h-5 w-5 text-success" />
                                            </>
                                        )}
                                        {status.status === 'error' && (
                                            <>
                                                <span className="text-danger">{status.message}</span>
                                                <XCircleIcon className="h-5 w-5 text-danger" />
                                            </>
                                        )}
                                        {status.status === 'missing' && (
                                            <>
                                                <span className="text-gray-400">{status.message}</span>
                                                <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ParentsCornerView;