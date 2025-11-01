import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { QuizStats, TopicStats } from '../types';

const STORAGE_KEY = 'sanChoiTriTue_userData';

interface UserContextType {
    earnedBadges: string[];
    stats: QuizStats;
    addBadge: (badgeId: string) => void;
    updateStats: (subjectId: string, topicId: string, score: number, totalQuestions: number) => void;
    getWeakestTopicId: (subjectId: string) => string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface StoredData {
    earnedBadges: string[];
    stats: QuizStats;
}

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
    const [stats, setStats] = useState<QuizStats>({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const data: StoredData = JSON.parse(storedData);
                const statsFromStorage = data.stats || {};

                // Di chuyển dữ liệu cũ: đảm bảo các trường mới tồn tại
                Object.values(statsFromStorage).forEach(subject => {
                    Object.values(subject).forEach((topic: any) => {
                        if (topic.totalCorrect === undefined) {
                            topic.totalCorrect = 0;
                        }
                        if (topic.totalQuestions === undefined) {
                            topic.totalQuestions = 0;
                        }
                        if (topic.perfectScoreCount === undefined) {
                            topic.perfectScoreCount = 0;
                        }
                    });
                });

                setEarnedBadges(data.earnedBadges || []);
                setStats(statsFromStorage);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu người dùng:", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        try {
            const data: StoredData = { earnedBadges, stats };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu người dùng:", error);
        }
    }, [earnedBadges, stats, isLoaded]);

    const addBadge = (badgeId: string) => {
        if (!earnedBadges.includes(badgeId)) {
            setEarnedBadges(prev => [...prev, badgeId]);
        }
    };

    const updateStats = (subjectId: string, topicId: string, score: number, totalQuestions: number) => {
        setStats(prevStats => {
            const newStats = JSON.parse(JSON.stringify(prevStats));
            if (!newStats[subjectId]) {
                newStats[subjectId] = {};
            }
            if (!newStats[subjectId][topicId]) {
                newStats[subjectId][topicId] = { bestScore: 0, timesCompleted: 0, totalCorrect: 0, totalQuestions: 0, perfectScoreCount: 0 };
            }

            const topicStats: TopicStats = newStats[subjectId][topicId];
            topicStats.bestScore = Math.max(topicStats.bestScore, score);
            topicStats.timesCompleted += 1;
            topicStats.totalCorrect += score;
            topicStats.totalQuestions += totalQuestions;
            if (score === totalQuestions) {
                topicStats.perfectScoreCount += 1;
            }

            return newStats;
        });
    };
    
    const getWeakestTopicId = (subjectId: string): string | null => {
        const subjectStats = stats[subjectId];
        if (!subjectStats) return null;

        let weakestTopicId: string | null = null;
        let lowestPerformance = Infinity;

// FIX: Cast Object.entries result to explicitly type `topicStats` and resolve property access errors.
        const playedTopics = (Object.entries(subjectStats) as [string, TopicStats][])
            .filter(([, topicStats]) => topicStats.timesCompleted > 0 && topicStats.totalQuestions > 0);

        if (playedTopics.length < 2) return null;

        for (const [topicId, topicStats] of playedTopics) {
            const performance = topicStats.totalCorrect / topicStats.totalQuestions;
            // Gợi ý nếu hiệu suất dưới 80%
            if (performance < lowestPerformance && performance < 0.8) {
                lowestPerformance = performance;
                weakestTopicId = topicId;
            }
        }
        
        return weakestTopicId;
    };


    const value = { earnedBadges, stats, addBadge, updateStats, getWeakestTopicId };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};