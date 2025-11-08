import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { GameState, Question, Subject, Topic, Badge, QuizStats, TopicStats } from '../types';
import { POST as generateQuizOnServer } from '../api/generate-quiz';
import { POST as generateExamOnServer } from '../api/generate-exam';
import { useUser } from './UserContext';
import { BADGES, QUIZ_LENGTH, TOPICS, SUBJECTS } from '../constants';

interface GameContextType {
    gameState: GameState;
    selectedSubject: Subject | null;
    selectedTopic: Topic | null;
    questions: Question[];
    passage: string | null;
    score: number;
    timeLimit: number;
    error: string | null;
    newlyEarnedBadges: Badge[];
    examDuration: 'short' | 'medium' | 'long' | null;
    userAnswers: (string | string[] | null)[];
    handleSubjectSelect: (subject: Subject) => void;
    handleTopicSelect: (topic: Topic) => Promise<void>;
    handleFinishQuiz: () => void;
    handleRestart: () => void;
    handleBackToSubjects: () => void;
    showBadgeCollection: () => void;
    showParentsCorner: () => void;
    handleStartExam: () => void;
    handleSelectExamDuration: (duration: 'short' | 'medium' | 'long') => Promise<void>;
    handleBackToTopicSelection: () => void;
    handleBackToExamOptions: () => void;
    recordAnswer: (index: number, answer: string | string[] | null) => void;
    incrementScore: () => void;
    handleReviewQuiz: () => void;
    handleBackToResults: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [gameState, setGameState] = useState<GameState>('subject_selection');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [passage, setPassage] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [timeLimit, setTimeLimit] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [newlyEarnedBadges, setNewlyEarnedBadges] = useState<Badge[]>([]);
    const [examDuration, setExamDuration] = useState<'short' | 'medium' | 'long' | null>(null);
    const [userAnswers, setUserAnswers] = useState<(string | string[] | null)[]>([]);
    const user = useUser();

    const resetQuizState = () => {
        setQuestions([]);
        setPassage(null);
        setScore(0);
        setTimeLimit(0);
        setNewlyEarnedBadges([]);
        setError(null);
        setExamDuration(null);
        setUserAnswers([]);
    };

    const handleSubjectSelect = (subject: Subject) => {
        setSelectedSubject(subject);
        setGameState('topic_selection');
        setSelectedTopic(null);
        resetQuizState();
    };

    const handleBackToSubjects = () => {
        setGameState('subject_selection');
        setSelectedSubject(null);
        setSelectedTopic(null);
        resetQuizState();
    };

    const handleBackToTopicSelection = () => {
        setGameState('topic_selection');
        resetQuizState();
    };
    
    const handleBackToExamOptions = () => {
        setGameState('exam_options');
        resetQuizState();
    };
    
    const handleBackToResults = () => {
        setGameState('results');
    };

    const handleTopicSelect = useCallback(async (topic: Topic) => {
        if (!selectedSubject) return;
        setSelectedTopic(topic);
        setGameState('loading_quiz');
        resetQuizState();
        try {
            const { passage: generatedPassage, questions: quizQuestions } = await generateQuizOnServer({
                subjectName: selectedSubject.name,
                topicName: topic.name
            });
            setQuestions(quizQuestions);
            setUserAnswers(Array(quizQuestions.length).fill(null));
            setPassage(generatedPassage);

            const readingTopics = ['doc_doan_van', 'doc_doan_van_en', 'nghe_doc', 'nghe_doc_en'];
            const writingTopics = ['luyen_viet'];

            if (readingTopics.includes(topic.id)) {
                setGameState('reading_activity');
            } else if (writingTopics.includes(topic.id)) {
                setGameState('writing_activity');
            } else {
                setGameState('in_quiz');
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Đã xảy ra lỗi không xác định.");
            }
            setGameState('topic_selection');
        }
    }, [selectedSubject]);

    const handleStartExam = () => {
        setGameState('exam_options');
        setSelectedTopic(null);
        resetQuizState();
    };

    const handleSelectExamDuration = useCallback(async (duration: 'short' | 'medium' | 'long') => {
        if (!selectedSubject) return;
        setGameState('loading_exam');
        setError(null);
        setExamDuration(duration);
        try {
            const { timeLimitInSeconds, questions: examQuestions } = await generateExamOnServer({
                subjectName: selectedSubject.name,
                durationPreference: duration
            });
            setQuestions(examQuestions);
            setUserAnswers(Array(examQuestions.length).fill(null));
            setTimeLimit(timeLimitInSeconds);
            setPassage(null);
            setGameState('in_exam');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Đã xảy ra lỗi không xác định.");
            }
            setGameState('topic_selection');
        }
    }, [selectedSubject]);

    const incrementScore = () => {
        setScore(prev => prev + 1);
    };

    const recordAnswer = (index: number, answer: string | string[] | null) => {
        setUserAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[index] = answer;
            return newAnswers;
        });
    };

    const handleFinishQuiz = () => {
        if (!selectedSubject) {
            setGameState('results');
            return;
        }

        const statsBefore = user.getUserData();
        const statsAfter = user.updatePostQuizData(
            selectedSubject.id, 
            selectedTopic?.id || 'exam', 
            score, 
            questions.length || QUIZ_LENGTH
        );

        let currentNewBadges: Badge[] = [];
        const tryAddBadge = (badgeId: string) => {
            if (!statsAfter.earnedBadges.includes(badgeId)) {
                const badge = BADGES.find(b => b.id === badgeId);
                if (badge && !currentNewBadges.some(b => b.id === badgeId)) {
                    currentNewBadges.push(badge);
                }
            }
        };
        
        const questionCount = questions.length;
        const isPerfectScore = score === questionCount;

        const getStatCount = (s: QuizStats, getter: (topic: TopicStats) => number) => 
            Object.values(s)
                  .flatMap(subject => Object.values(subject))
                  .reduce((total, topic) => total + getter(topic), 0);
        
        const totalQuizzesBefore = getStatCount(statsBefore.stats, topic => topic.timesCompleted);
        const totalQuizzesAfter = getStatCount(statsAfter.stats, topic => topic.timesCompleted);
        const totalPerfectScoresBefore = getStatCount(statsBefore.stats, topic => topic.perfectScoreCount);
        const totalPerfectScoresAfter = getStatCount(statsAfter.stats, topic => topic.perfectScoreCount);
        const totalCorrectBefore = getStatCount(statsBefore.stats, topic => topic.totalCorrect);
        const totalCorrectAfter = getStatCount(statsAfter.stats, topic => topic.totalCorrect);

        if (totalQuizzesBefore < 1 && totalQuizzesAfter >= 1) tryAddBadge('first_quiz');
        if (totalQuizzesBefore < 10 && totalQuizzesAfter >= 10) tryAddBadge('marathon_runner');
        if (totalQuizzesBefore < 25 && totalQuizzesAfter >= 25) tryAddBadge('quiz_pro_25');
        if (totalQuizzesBefore < 50 && totalQuizzesAfter >= 50) tryAddBadge('quiz_master_50');
        if (totalQuizzesBefore < 75 && totalQuizzesAfter >= 75) tryAddBadge('quiz_pro_75');
        if (totalQuizzesBefore < 100 && totalQuizzesAfter >= 100) tryAddBadge('quiz_legend_100');
        if (totalQuizzesBefore < 150 && totalQuizzesAfter >= 150) tryAddBadge('quiz_master_150');
        if (totalQuizzesBefore < 200 && totalQuizzesAfter >= 200) tryAddBadge('quiz_legend_200');
        if (totalQuizzesBefore < 300 && totalQuizzesAfter >= 300) tryAddBadge('quiz_titan_300');
        if (totalQuizzesBefore < 500 && totalQuizzesAfter >= 500) tryAddBadge('quiz_demigod_500');

        if (totalCorrectBefore < 100 && totalCorrectAfter >= 100) tryAddBadge('correct_100');
        if (totalCorrectBefore < 500 && totalCorrectAfter >= 500) tryAddBadge('correct_500');
        if (totalCorrectBefore < 1000 && totalCorrectAfter >= 1000) tryAddBadge('correct_1000');
        if (totalCorrectBefore < 2500 && totalCorrectAfter >= 2500) tryAddBadge('correct_2500');
        if (totalCorrectBefore < 5000 && totalCorrectAfter >= 5000) tryAddBadge('correct_5000');
        
        if (isPerfectScore) {
            tryAddBadge('perfect_score');
            if (statsAfter.perfectScoreStreak >= 3) tryAddBadge('perfect_streak_3');
            if (statsAfter.perfectScoreStreak >= 5) tryAddBadge('perfect_streak_5');
        }
        if (totalPerfectScoresBefore < 3 && totalPerfectScoresAfter >= 3) tryAddBadge('perfectionist');
        if (totalPerfectScoresBefore < 5 && totalPerfectScoresAfter >= 5) tryAddBadge('perfect_score_5');
        if (totalPerfectScoresBefore < 10 && totalPerfectScoresAfter >= 10) tryAddBadge('perfect_score_10');
        if (totalPerfectScoresBefore < 15 && totalPerfectScoresAfter >= 15) tryAddBadge('perfect_score_15');
        if (totalPerfectScoresBefore < 25 && totalPerfectScoresAfter >= 25) tryAddBadge('perfect_score_25');
        if (totalPerfectScoresBefore < 50 && totalPerfectScoresAfter >= 50) tryAddBadge('perfect_score_50');
        
        if (examDuration) {
            if(examDuration === 'long') tryAddBadge('brave_challenger');
            const examPercentage = (score / questionCount) * 100;
            if (examPercentage >= 80) {
                if (examDuration === 'short') tryAddBadge('exam_ace_short');
                if (examDuration === 'medium') tryAddBadge('exam_ace_medium');
                if (examDuration === 'long') tryAddBadge('exam_ace_long');
            }
            if (isPerfectScore) {
                if (examDuration === 'short') tryAddBadge('exam_perfect_short');
                if (examDuration === 'medium') tryAddBadge('exam_perfect_medium');
                if (examDuration === 'long') tryAddBadge('exam_perfect_long');
            }
        }

        if (statsAfter.consecutivePlayDays >= 3) tryAddBadge('daily_streak_3');
        if (statsAfter.consecutivePlayDays >= 7) tryAddBadge('daily_streak_7');
        if (statsAfter.consecutivePlayDays >= 14) tryAddBadge('daily_streak_14');
        if (statsAfter.consecutivePlayDays >= 30) tryAddBadge('daily_streak_30');
        
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        if (hour < 7) tryAddBadge('early_bird');
        if (hour >= 21) tryAddBadge('night_owl');
        if (day > 0 && day < 6 && statsAfter.dailyHistory.quizzes >= 5) tryAddBadge('weekday_warrior');
        if ((day === 0 || day === 6) && statsAfter.dailyHistory.quizzes >= 5) tryAddBadge('weekend_wonder');

        if (statsAfter.dailyHistory.quizzes >= 10) tryAddBadge('unstoppable_force');
        if (statsAfter.dailyHistory.subjects.size === 3) tryAddBadge('subject_cycler');
        if (statsAfter.dailyHistory.topics.size >= 5) tryAddBadge('topic_hopper');

        if (isPerfectScore && selectedTopic) {
            if (selectedSubject.id === 'toan_hoc') tryAddBadge('math_whiz');
            if (selectedSubject.id === 'tieng_viet') tryAddBadge('language_lover');
            if (selectedSubject.id === 'tu_nhien_xa_hoi') tryAddBadge('science_sleuth');
            if (selectedSubject.id === 'tieng_anh') tryAddBadge('english_explorer');

            const topicBadgeMap: { [key: string]: string } = {
                'phep_cong_tru_1000': 'addition_ace', 'phep_nhan_chia_bang_2_10': 'multiplication_master',
                'hinh_hoc_co_ban': 'geometry_genius', 'xem_dong_ho': 'time_teller',
                'giai_toan_loi_van': 'word_problem_whiz', 'do_dai_do_luong': 'measurement_maven',
                'so_sanh': 'comparison_champ', 'tu_chi_su_vat': 'word_wizard',
                'cau_ai_la_gi': 'sentence_superstar', 'doc_hieu_doan_van': 'reading_champion',
                'cay_xanh': 'botanist_buddy', 'dong_vat': 'animal_expert',
                'an_toan_giao_thong': 'safety_squad',
            };
            if (topicBadgeMap[selectedTopic.id]) tryAddBadge(topicBadgeMap[selectedTopic.id]);
        }
        
        for (const subject of SUBJECTS) {
            const subjectTopics = TOPICS[subject.id].filter(t => !['doc_doan_van', 'luyen_viet', 'doc_doan_van_en', 'nghe_doc_en', 'nghe_doc'].includes(t.id));
            const subjectStats = statsAfter.stats[subject.id] || {};
            if (subjectTopics.every(t => (subjectStats[t.id]?.timesCompleted || 0) > 0)) {
                tryAddBadge('subject_master');
            }

            let totalCorrect = 0, totalQuestions = 0;
            Object.values(subjectStats).forEach(topic => {
                totalCorrect += topic.totalCorrect;
                totalQuestions += topic.totalQuestions;
            });
            if (totalQuestions > 20 && (totalCorrect / totalQuestions) >= 0.9) {
                tryAddBadge(`${subject.id}_prodigy`);
            }
        }
        
        const subjectsPlayed = Object.keys(statsAfter.stats);
        if (subjectsPlayed.length === SUBJECTS.length) {
             tryAddBadge('curious_mind');
        }

        const hasPerfectInAll = SUBJECTS.every(sub => 
            Object.values(statsAfter.stats[sub.id] || {}).some(t => t.perfectScoreCount > 0)
        );
        if (hasPerfectInAll) {
            tryAddBadge('all_rounder');
        }

        if (selectedTopic) {
            const topicStatsAfter = statsAfter.stats[selectedSubject.id]?.[selectedTopic.id];
            if(topicStatsAfter){
                if (topicStatsAfter.timesCompleted >= 5) tryAddBadge('persistent_player_5');
                if (topicStatsAfter.timesCompleted >= 10) tryAddBadge(`topic_veteran_${selectedTopic.id}`);
                if (topicStatsAfter.perfectScoreCount >= 5) tryAddBadge(`topic_superstar_${selectedTopic.id}`);
                if (topicStatsAfter.perfectScoreCount >= 10) tryAddBadge(`topic_legend_${selectedTopic.id}`);
            }
        }
        
        const totalBadgesBefore = statsBefore.earnedBadges.length;
        const totalBadgesAfter = statsAfter.earnedBadges.length + currentNewBadges.length;
        
        if (totalBadgesBefore < 20 && totalBadgesAfter >= 20) tryAddBadge('grand_master_20');
        if (totalBadgesBefore < 40 && totalBadgesAfter >= 40) tryAddBadge('collector_40');
        if (totalBadgesBefore < 60 && totalBadgesAfter >= 60) tryAddBadge('collector_60');
        if (totalBadgesBefore < 80 && totalBadgesAfter >= 80) tryAddBadge('collector_80');
        if (totalBadgesBefore < 100 && totalBadgesAfter >= 100) tryAddBadge('collector_100');
        if (totalBadgesBefore < 120 && totalBadgesAfter >= 120) tryAddBadge('collector_120');
        if (totalBadgesAfter === BADGES.length) tryAddBadge('ultimate_achiever');
        
        currentNewBadges.forEach(badge => user.addBadge(badge.id));

        setNewlyEarnedBadges(currentNewBadges);
        setGameState('results');
    };

    const handleRestart = () => {
        const inExamMode = (gameState === 'results' || gameState === 'review') && timeLimit > 0;
        resetQuizState();
        if (inExamMode) {
            setGameState('exam_options');
        } else if (selectedTopic) {
            handleTopicSelect(selectedTopic);
        } else {
            setGameState('topic_selection');
        }
    };

    const handleReviewQuiz = () => {
        setGameState('review');
    };

    const showBadgeCollection = () => {
        setGameState('badge_collection');
    };

    const showParentsCorner = () => {
        setGameState('parents_corner');
    };

    const value = {
        gameState,
        selectedSubject,
        selectedTopic,
        questions,
        passage,
        score,
        timeLimit,
        error,
        newlyEarnedBadges,
        examDuration,
        userAnswers,
        handleSubjectSelect,
        handleTopicSelect,
        handleFinishQuiz,
        handleRestart,
        handleBackToSubjects,
        showBadgeCollection,
        showParentsCorner,
        handleStartExam,
        handleSelectExamDuration,
        handleBackToTopicSelection,
        handleBackToExamOptions,
        recordAnswer,
        incrementScore,
        handleReviewQuiz,
        handleBackToResults,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};