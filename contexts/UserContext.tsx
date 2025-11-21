import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { QuizStats, TopicStats, ReadingRecord, ReadingAnalysis, UserData, Badge } from '../types';
import { BADGES } from '../constants';

const STORAGE_KEY = 'sanChoiTriTue_userData_v2';

interface UserContextType {
    earnedBadges: string[];
    stats: QuizStats;
    readingHistory: ReadingRecord[];
    consecutivePlayDays: number;
    perfectScoreStreak: number;
    avatar: string;
    setAvatar: (avatar: string) => void;
    // Shop system
    stars: number;
    ownedAccessories: string[];
    equippedAccessories: { [key: string]: string | undefined };
    buyAccessory: (itemId: string, price: number) => boolean;
    equipAccessory: (itemId: string, type: string) => void;
    earnStars: (amount: number) => void;
    addBadge: (badgeId: string) => void;
    updatePostQuizData: (subjectId: string, topicId: string, score: number, totalQuestions: number) => UserData;
    addReadingRecord: (passage: string, analysis: ReadingAnalysis) => Badge[];
    getWeakestTopicId: (subjectId: string) => string | null;
    getUserData: () => UserData;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const getTodayString = () => new Date().toISOString().slice(0, 10);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData>({
        earnedBadges: [],
        stats: {},
        readingHistory: [],
        lastPlayDate: '',
        consecutivePlayDays: 0,
        perfectScoreStreak: 0,
        dailyHistory: { date: '', quizzes: 0, subjects: new Set(), topics: new Set() },
        avatar: '👶',
        currentThemeId: 'default',
        unlockedThemes: ['default'],
        mistakes: [],
        stars: 0,
        ownedAccessories: [],
        equippedAccessories: {}
    });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const data: Partial<UserData> = JSON.parse(storedData);
                const statsFromStorage = data.stats || {};

                // Migrate old data if necessary
                Object.values(statsFromStorage).forEach(subject => {
                    Object.values(subject).forEach((topic: any) => {
                        topic.totalCorrect = topic.totalCorrect ?? 0;
                        topic.totalQuestions = topic.totalQuestions ?? 0;
                        topic.perfectScoreCount = topic.perfectScoreCount ?? 0;
                    });
                });

                const today = getTodayString();
                let dailyHistory = data.dailyHistory || { date: '', quizzes: 0, subjects: new Set(), topics: new Set() };
                // Deserialize Set
                if (dailyHistory.subjects && !(dailyHistory.subjects instanceof Set)) {
                    dailyHistory.subjects = new Set(dailyHistory.subjects as any);
                }
                if (dailyHistory.topics && !(dailyHistory.topics instanceof Set)) {
                    dailyHistory.topics = new Set(dailyHistory.topics as any);
                }

                // Reset daily history if it's a new day
                if (dailyHistory.date !== today) {
                    dailyHistory = { date: today, quizzes: 0, subjects: new Set(), topics: new Set() };
                }


                setUserData({
                    earnedBadges: data.earnedBadges || [],
                    stats: statsFromStorage,
                    readingHistory: data.readingHistory || [],
                    lastPlayDate: data.lastPlayDate || '',
                    consecutivePlayDays: data.consecutivePlayDays || 0,
                    perfectScoreStreak: data.perfectScoreStreak || 0,
                    dailyHistory: dailyHistory,
                    avatar: data.avatar || '👶',
                    currentThemeId: data.currentThemeId || 'default',
                    unlockedThemes: data.unlockedThemes || ['default'],
                    mistakes: data.mistakes || [],
                    stars: data.stars || 0,
                    ownedAccessories: data.ownedAccessories || [],
                    equippedAccessories: data.equippedAccessories || {}
                });
            } else {
                setUserData(prev => ({
                    ...prev,
                    dailyHistory: { ...prev.dailyHistory, date: getTodayString() }
                }));
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
            // Serialize Set before saving
            const dataToStore = {
                ...userData,
                dailyHistory: {
                    ...userData.dailyHistory,
                    subjects: Array.from(userData.dailyHistory.subjects),
                    topics: Array.from(userData.dailyHistory.topics),
                }
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu người dùng:", error);
        }
    }, [userData, isLoaded]);

    const setAvatar = useCallback((avatar: string) => {
        setUserData(prev => ({ ...prev, avatar }));
    }, []);

    const addBadge = useCallback((badgeId: string) => {
        setUserData(prev => {
            if (!prev.earnedBadges.includes(badgeId)) {
                return { ...prev, earnedBadges: [...prev.earnedBadges, badgeId] };
            }
            return prev;
        });
    }, []);

    const updatePostQuizData = useCallback((subjectId: string, topicId: string, score: number, totalQuestions: number): UserData => {
        let updatedData: UserData | null = null;
        setUserData(prev => {
            const newStats = JSON.parse(JSON.stringify(prev.stats));
            if (!newStats[subjectId]) newStats[subjectId] = {};
            if (!newStats[subjectId][topicId]) {
                newStats[subjectId][topicId] = { bestScore: 0, timesCompleted: 0, totalCorrect: 0, totalQuestions: 0, perfectScoreCount: 0 };
            }

            const topicStats: TopicStats = newStats[subjectId][topicId];
            topicStats.bestScore = Math.max(topicStats.bestScore, score);
            topicStats.timesCompleted += 1;
            topicStats.totalCorrect += score;
            topicStats.totalQuestions += totalQuestions;

            const isPerfect = score === totalQuestions;
            if (isPerfect) {
                topicStats.perfectScoreCount += 1;
            }

            const today = getTodayString();
            let newConsecutiveDays = prev.consecutivePlayDays;
            if (prev.lastPlayDate !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (prev.lastPlayDate === yesterday.toISOString().slice(0, 10)) {
                    newConsecutiveDays += 1;
                } else {
                    newConsecutiveDays = 1;
                }
            }

            let newDailyHistory = prev.dailyHistory;
            if (newDailyHistory.date !== today) {
                newDailyHistory = { date: today, quizzes: 1, subjects: new Set([subjectId]), topics: new Set([topicId]) };
            } else {
                newDailyHistory.quizzes += 1;
                newDailyHistory.subjects.add(subjectId);
                newDailyHistory.topics.add(topicId);
            }

            updatedData = {
                ...prev,
                stats: newStats,
                perfectScoreStreak: isPerfect ? prev.perfectScoreStreak + 1 : 0,
                consecutivePlayDays: newConsecutiveDays,
                lastPlayDate: today,
                dailyHistory: newDailyHistory
            };
            return updatedData;
        });
        return updatedData!;
    }, []);

    const addReadingRecord = useCallback((passage: string, analysis: ReadingAnalysis): Badge[] => {
        const newRecord: ReadingRecord = { passage, analysis, timestamp: Date.now() };
        const newlyUnlockedBadges: Badge[] = [];

        setUserData(prev => {
            const currentBadges = new Set(prev.earnedBadges);

            // Helper to check for a new badge and add it
            const checkAndAddBadge = (badgeId: string) => {
                if (!currentBadges.has(badgeId)) {
                    const badge = BADGES.find(b => b.id === badgeId);
                    if (badge) {
                        newlyUnlockedBadges.push(badge);
                        currentBadges.add(badgeId);
                    }
                }
            };

            // Check accuracy badges
            if (analysis.accuracy === 100) checkAndAddBadge('reading_legend');
            if (analysis.accuracy >= 98) checkAndAddBadge('reading_virtuoso');
            if (analysis.accuracy >= 95) checkAndAddBadge('reading_rockstar');

            // Check reading count badge
            if (prev.readingHistory.length + 1 >= 10) checkAndAddBadge('reading_adept');

            return {
                ...prev,
                readingHistory: [newRecord, ...prev.readingHistory],
                earnedBadges: Array.from(currentBadges),
            };
        });

        return newlyUnlockedBadges;
    }, []);

    const getWeakestTopicId = (subjectId: string): string | null => {
        const subjectStats = userData.stats[subjectId];
        if (!subjectStats) return null;

        let weakestTopicId: string | null = null;
        let lowestPerformance = Infinity;

        const playedTopics = (Object.entries(subjectStats) as [string, TopicStats][])
            .filter(([, topicStats]) => topicStats.timesCompleted > 0 && topicStats.totalQuestions > 0);

        if (playedTopics.length < 2) return null;

        for (const [topicId, topicStats] of playedTopics) {
            const performance = topicStats.totalCorrect / topicStats.totalQuestions;
            if (performance < lowestPerformance && performance < 0.8) {
                lowestPerformance = performance;
                weakestTopicId = topicId;
            }
        }

        return weakestTopicId;
    };

    const getUserData = useCallback(() => userData, [userData]);

    // Shop system functions
    const buyAccessory = useCallback((itemId: string, price: number): boolean => {
        if (userData.stars < price || userData.ownedAccessories.includes(itemId)) {
            return false; // Không đủ sao hoặc đã mua rồi
        }
        setUserData(prev => ({
            ...prev,
            stars: prev.stars - price,
            ownedAccessories: [...prev.ownedAccessories, itemId]
        }));
        return true;
    }, [userData.stars, userData.ownedAccessories]);

    const equipAccessory = useCallback((itemId: string, type: string) => {
        if (!userData.ownedAccessories.includes(itemId)) return;
        setUserData(prev => ({
            ...prev,
            equippedAccessories: {
                ...prev.equippedAccessories,
                [type]: itemId
            }
        }));
    }, [userData.ownedAccessories]);

    const earnStars = useCallback((amount: number) => {
        setUserData(prev => ({
            ...prev,
            stars: prev.stars + amount
        }));
    }, []);

    const value = {
        ...userData,
        setAvatar,
        buyAccessory,
        equipAccessory,
        earnStars,
        addBadge,
        updatePostQuizData,
        getWeakestTopicId,
        addReadingRecord,
        getUserData
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
