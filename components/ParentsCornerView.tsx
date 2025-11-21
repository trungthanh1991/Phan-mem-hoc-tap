import React, { useState, useMemo } from 'react';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import { SUBJECTS, TOPICS, QUIZ_LENGTH } from '../constants';
import Button from './Button';
import Card from './Card';
import { CheckCircleIcon, MedalIcon, ChartBarIcon, ClockIcon, BoltIcon, XCircleIcon, ShieldCheckIcon, FireIcon, StarIcon } from './icons';
import ReadingFeedback from './ReadingFeedback';
import { POST as checkSystemApi } from '../api/check-system';
import { ApiStatus } from '../services/geminiService';

const StatCard: React.FC<{ icon: React.ElementType, value: string | number, label: string, gradient: string, emoji?: string }> = ({ icon: Icon, value, label, gradient, emoji }) => (
    <Card className={`bg-gradient-to-br ${gradient} text-white shadow-cartoon transform hover:scale-105 transition-all`}>
        <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Icon className="h-10 w-10" />
            </div>
            <div className="flex-1">
                <p className="text-4xl font-black">{emoji} {value}</p>
                <p className="text-white/90 font-semibold">{label}</p>
            </div>
        </div>
    </Card>
);

const PerformanceIndicator: React.FC<{ accuracy: number }> = ({ accuracy }) => {
    const getPerformanceData = () => {
        if (accuracy >= 90) return { text: 'Xuất sắc', color: 'text-green-700 bg-green-100', emoji: '🌟' };
        if (accuracy >= 80) return { text: 'Giỏi', color: 'text-blue-700 bg-blue-100', emoji: '⭐' };
        if (accuracy >= 70) return { text: 'Khá', color: 'text-yellow-700 bg-yellow-100', emoji: '👍' };
        if (accuracy >= 50) return { text: 'Trung bình', color: 'text-orange-700 bg-orange-100', emoji: '📝' };
        return { text: 'Cần cố gắng', color: 'text-red-700 bg-red-100', emoji: '💪' };
    };

    const perf = getPerformanceData();
    return (
        <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-cartoon ${perf.color}`}>
            {perf.emoji} {accuracy.toFixed(0)}% - {perf.text}
        </span>
    );
};

const ProgressBar: React.FC<{ value: number, max: number, color?: string }> = ({ value, max, color = 'from-green-400 to-blue-500' }) => {
    const percentage = (value / max) * 100;
    return (
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div
                className={`h-4 bg-gradient-to-r ${color} transition-all duration-500 rounded-full relative`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
            >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
        </div>
    );
};

const ParentsCornerView: React.FC = () => {
    const { handleBackToSubjects } = useGame();
    const { stats, earnedBadges, readingHistory, consecutivePlayDays } = useUser();

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

    const analytics = useMemo(() => {
        let totalQuizzes = 0;
        let totalCorrectAnswers = 0;
        let totalQuestionsAsked = 0;
        let strongestSubject = { name: '', accuracy: 0 };
        let weakestSubject = { name: '', accuracy: 100 };
        const subjectPerformance: { [key: string]: { correct: number, total: number } } = {};

        // Calculate overall stats and subject performance
        SUBJECTS.forEach(subject => {
            const subjectStats = stats[subject.id] || {};
            let subjectCorrect = 0;
            let subjectTotal = 0;

            Object.values(subjectStats).forEach((topic: any) => {
                totalQuizzes += topic.timesCompleted;
                totalCorrectAnswers += topic.totalCorrect;
                totalQuestionsAsked += topic.totalQuestions;
                subjectCorrect += topic.totalCorrect;
                subjectTotal += topic.totalQuestions;
            });

            if (subjectTotal > 0) {
                const accuracy = (subjectCorrect / subjectTotal) * 100;
                subjectPerformance[subject.name] = { correct: subjectCorrect, total: subjectTotal };

                if (accuracy > strongestSubject.accuracy) {
                    strongestSubject = { name: subject.name, accuracy };
                }
                if (accuracy < weakestSubject.accuracy && subjectCorrect > 0) {
                    weakestSubject = { name: subject.name, accuracy };
                }
            }
        });

        const overallAverage = totalQuestionsAsked > 0 ? (totalCorrectAnswers / totalQuestionsAsked) * 100 : 0;

        return {
            totalQuizzes,
            totalCorrectAnswers,
            totalQuestionsAsked,
            overallAverage,
            strongestSubject: strongestSubject.name || 'Chưa có dữ liệu',
            weakestSubject: weakestSubject.name || 'Chưa có dữ liệu',
            subjectPerformance
        };
    }, [stats]);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-fade-in-up relative pb-20">
            {/* Header */}
            <div className="mb-8">
                <button onClick={handleBackToSubjects} className="mb-4 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-bold px-6 py-3 rounded-full shadow-cartoon hover:shadow-cartoon-hover transform hover:scale-105 transition-all">
                    ⬅️ Quay lại
                </button>

                <div className="text-center mb-6">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-3 animate-rainbow-pulse">
                        📊 Góc Phụ Huynh
                    </h1>
                    <p className="text-2xl text-gray-700 font-semibold">
                        💝 Theo dõi tiến độ học tập của bé yêu
                    </p>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={CheckCircleIcon}
                    value={analytics.totalQuizzes}
                    label="Bài đã hoàn thành"
                    gradient="from-blue-500 to-cyan-500"
                    emoji="📝"
                />
                <StatCard
                    icon={ChartBarIcon}
                    value={`${analytics.overallAverage.toFixed(0)}%`}
                    label="Tỷ lệ chính xác"
                    gradient="from-green-500 to-emerald-500"
                    emoji="✅"
                />
                <StatCard
                    icon={MedalIcon}
                    value={earnedBadges.length}
                    label="Huy hiệu đạt được"
                    gradient="from-yellow-500 to-orange-500"
                    emoji="🏆"
                />
                <StatCard
                    icon={FireIcon}
                    value={consecutivePlayDays}
                    label="Ngày liên tiếp"
                    gradient="from-red-500 to-pink-500"
                    emoji="🔥"
                />
            </div>

            {/* Performance Summary */}
            <Card className="mb-8 bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-purple-300">
                <h2 className="text-3xl font-bold text-purple-800 mb-6 flex items-center gap-2">
                    🎯 Phân tích năng lực
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-cartoon">
                        <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center gap-2">
                            <StarIcon className="h-6 w-6 fill-current text-yellow-500" />
                            Môn học mạnh nhất
                        </h3>
                        <p className="text-3xl font-black text-green-600">{analytics.strongestSubject}</p>
                        <p className="text-gray-600 mt-2">🌟 Bé học xuất sắc môn này!</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-cartoon">
                        <h3 className="text-xl font-bold text-orange-700 mb-3 flex items-center gap-2">
                            💪 Môn cần cố gắng thêm
                        </h3>
                        <p className="text-3xl font-black text-orange-600">{analytics.weakestSubject}</p>
                        <p className="text-gray-600 mt-2">📚 Hãy luyện tập thêm nhé!</p>
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="mt-6 bg-white p-6 rounded-2xl shadow-cartoon">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-bold text-gray-800">Tiến độ tổng thể</h3>
                        <span className="text-2xl font-black text-blue-600">{analytics.totalCorrectAnswers}/{analytics.totalQuestionsAsked}</span>
                    </div>
                    <ProgressBar value={analytics.totalCorrectAnswers} max={analytics.totalQuestionsAsked} />
                    <p className="text-sm text-gray-600 mt-2">Tổng số câu đúng trên tổng số câu hỏi</p>
                </div>
            </Card>

            {/* Subject Details */}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    📚 Chi tiết theo môn học
                </h2>

                {SUBJECTS.map(subject => {
                    const subjectStats = stats[subject.id] || {};
                    const subjectTopics = TOPICS[subject.id] || [];
                    const examStat = subjectStats['exam'];

                    // Calculate subject totals
                    let subjectCorrect = 0;
                    let subjectTotal = 0;
                    Object.values(subjectStats).forEach((topic: any) => {
                        subjectCorrect += topic.totalCorrect;
                        subjectTotal += topic.totalQuestions;
                    });
                    const subjectAccuracy = subjectTotal > 0 ? (subjectCorrect / subjectTotal) * 100 : 0;

                    return (
                        <Card key={subject.id} className="bg-white shadow-cartoon">
                            {/* Subject Header */}
                            <div className={`flex items-center justify-between gap-4 mb-6 pb-4 border-b-4 ${subject.borderColor}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${subject.gradientFrom} ${subject.gradientTo} shadow-lg`}>
                                        <subject.icon className="h-12 w-12 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-800">{subject.name}</h3>
                                        {subjectTotal > 0 && (
                                            <PerformanceIndicator accuracy={subjectAccuracy} />
                                        )}
                                    </div>
                                </div>
                                {subjectTotal > 0 && (
                                    <div className="text-right">
                                        <p className="text-4xl font-black text-gray-800">{subjectCorrect}</p>
                                        <p className="text-gray-600">/ {subjectTotal} câu</p>
                                    </div>
                                )}
                            </div>

                            {Object.keys(subjectStats).length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                    <p className="text-2xl text-gray-400 font-semibold">📖 Bé chưa học môn này</p>
                                    <p className="text-gray-500 mt-2">Hãy bắt đầu thử nhé!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {subjectTopics.map(topic => {
                                        const topicStat = subjectStats[topic.id];
                                        if (!topicStat || topicStat.timesCompleted === 0) {
                                            return null;
                                        }
                                        const accuracy = topicStat.totalQuestions > 0 ? (topicStat.totalCorrect / topicStat.totalQuestions) * 100 : 0;
                                        const masteryLevel = Math.min((topicStat.totalCorrect / 50) * 100, 100);

                                        return (
                                            <div key={topic.id} className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 hover:shadow-lg transition-all">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                                                    <div className="flex-1">
                                                        <p className="text-xl font-bold text-gray-800 mb-2">{topic.name}</p>
                                                        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                                                            <span className="bg-white px-3 py-1 rounded-full font-semibold">
                                                                📊 Làm {topicStat.timesCompleted} lần
                                                            </span>
                                                            <span className="bg-white px-3 py-1 rounded-full font-semibold">
                                                                ⭐ Cao nhất: {topicStat.bestScore} điểm
                                                            </span>
                                                            <span className="bg-white px-3 py-1 rounded-full font-semibold">
                                                                ✅ {topicStat.totalCorrect}/{topicStat.totalQuestions} câu
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <PerformanceIndicator accuracy={accuracy} />
                                                </div>

                                                {/* Mastery Level */}
                                                <div className="mt-4">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-sm font-bold text-gray-700">Mức độ thành thạo:</span>
                                                        <span className="text-sm font-bold text-purple-700">{masteryLevel.toFixed(0)}%</span>
                                                    </div>
                                                    <ProgressBar value={masteryLevel} max={100} color="from-purple-400 to-pink-500" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Exam Stats */}
                            {examStat && examStat.timesCompleted > 0 && (
                                <div className="mt-6 pt-6 border-t-4 border-dashed border-purple-300">
                                    <h4 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                                        <ClockIcon className="h-7 w-7" />
                                        🎯 Bài Thi Thử
                                    </h4>
                                    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-300">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="flex-1">
                                                <p className="text-xl font-bold text-gray-800 mb-2">Tổng hợp kiến thức</p>
                                                <div className="flex flex-wrap gap-3 text-sm">
                                                    <span className="bg-white px-3 py-1 rounded-full font-semibold">
                                                        📊 {examStat.timesCompleted} bài thi
                                                    </span>
                                                    <span className="bg-white px-3 py-1 rounded-full font-semibold">
                                                        ⭐ Điểm cao nhất: {examStat.bestScore}
                                                    </span>
                                                </div>
                                            </div>
                                            <PerformanceIndicator accuracy={examStat.totalQuestions > 0 ? (examStat.totalCorrect / examStat.totalQuestions) * 100 : 0} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reading History */}
                            {subject.id === 'tieng_viet' && readingHistory.length > 0 && (
                                <div className="mt-6 pt-6 border-t-4 border-dashed border-green-300">
                                    <h4 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
                                        🗣️ Lịch sử Luyện Đọc
                                    </h4>
                                    <div className="space-y-3">
                                        {readingHistory.slice(0, 5).map((record, index) => (
                                            <Card key={index} className="bg-white p-0 overflow-hidden shadow-cartoon border-2 border-green-200">
                                                <details className="group">
                                                    <summary className="p-5 cursor-pointer flex justify-between items-center group-hover:bg-green-50 transition-colors">
                                                        <div className="flex-1">
                                                            <p className="font-bold text-gray-800 text-lg mb-1">
                                                                "{record.passage.substring(0, 50)}..."
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                📅 {new Date(record.timestamp).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                                                            <PerformanceIndicator accuracy={record.analysis.accuracy} />
                                                            <span className="text-2xl transform transition-transform duration-300 group-open:rotate-90">▶</span>
                                                        </div>
                                                    </summary>
                                                    <div className="p-6 border-t-2 bg-gradient-to-br from-green-50 to-blue-50">
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

            {/* System Check */}
            <div className="mt-12">
                <Card className="bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-gray-300">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <ShieldCheckIcon className="h-12 w-12 text-gray-700" />
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">🔧 Kiểm tra hệ thống</h3>
                                <p className="text-gray-600">Kiểm tra trạng thái kết nối API</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleCheckSystem}
                            variant="secondary"
                            className="py-3 px-8 text-lg font-bold shadow-cartoon"
                            isLoading={isCheckingApi}
                            loadingText="Đang kiểm tra..."
                        >
                            🔍 Kiểm tra ngay
                        </Button>
                    </div>

                    {apiStatuses && (
                        <div className="mt-6 space-y-3 bg-white rounded-2xl p-6 shadow-inner">
                            {apiStatuses.map((status) => (
                                <div key={status.keyName} className="flex items-center justify-between border-b-2 last:border-0 pb-3 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono font-bold text-gray-800 text-lg">{status.keyName}</span>
                                        {status.status === 'active' && <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">✅ Hoạt động</span>}
                                        {status.status === 'error' && <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">❌ Lỗi</span>}
                                        {status.status === 'missing' && <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-bold">⚠️ Thiếu</span>}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        {status.status === 'active' && (
                                            <span className="text-green-700 font-semibold">{status.message} ({status.latency}ms)</span>
                                        )}
                                        {status.status === 'error' && (
                                            <span className="text-red-700 font-semibold">{status.message}</span>
                                        )}
                                        {status.status === 'missing' && (
                                            <span className="text-gray-600 font-semibold">{status.message}</span>
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