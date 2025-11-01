import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { GameState, Question, Subject, Topic, Badge } from '../types';
import { generateQuiz, generateExam } from '../services/geminiService';
import { useUser } from './UserContext';
import { BADGES, QUIZ_LENGTH } from '../constants';

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
    handleSubjectSelect: (subject: Subject) => void;
    handleTopicSelect: (topic: Topic) => Promise<void>;
    handleQuizComplete: (finalScore: number) => void;
    handleRestart: () => void;
    handleBackToSubjects: () => void;
    showBadgeCollection: () => void;
    showParentsCorner: () => void;
    handleStartExam: () => void;
    handleSelectExamDuration: (duration: 'short' | 'medium' | 'long') => Promise<void>;
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
    const user = useUser();

    const resetQuizState = () => {
        setQuestions([]);
        setPassage(null);
        setScore(0);
        setTimeLimit(0);
        setNewlyEarnedBadges([]);
        setError(null);
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

    const handleTopicSelect = useCallback(async (topic: Topic) => {
        if (!selectedSubject) return;
        setSelectedTopic(topic);
        setGameState('loading_quiz');
        resetQuizState();
        try {
            const { passage: generatedPassage, questions: quizQuestions } = await generateQuiz(selectedSubject.name, topic.name);
            setQuestions(quizQuestions);
            setPassage(generatedPassage);

            if (topic.id === 'doc_doan_van') {
                setGameState('reading_activity');
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
        try {
            const { timeLimitInSeconds, questions: examQuestions } = await generateExam(selectedSubject.name, duration, user.stats);
            setQuestions(examQuestions);
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
    }, [selectedSubject, user.stats]);


    const handleQuizComplete = (finalScore: number) => {
        // For regular quizzes, update stats. For exams, don't update stats for now to keep it as a 'practice test'.
        if (selectedSubject && selectedTopic) {
            const totalPlaysBeforeThis = Object.values(user.stats)
                .flatMap(subject => Object.values(subject))
                .reduce((total, topic) => total + topic.timesCompleted, 0);
            const isFirstQuiz = totalPlaysBeforeThis === 0;

            user.updateStats(selectedSubject.id, selectedTopic.id, finalScore, QUIZ_LENGTH);
            
            const newBadges: Badge[] = [];
            const isPerfectScore = finalScore === QUIZ_LENGTH;

            for (const badge of BADGES) {
                if (user.earnedBadges.includes(badge.id)) continue;

                let earned = false;
                switch (badge.id) {
                    case 'first_quiz':
                        if (isFirstQuiz) earned = true;
                        break;
                    case 'perfect_score':
                        if (isPerfectScore) earned = true;
                        break;
                    case 'math_whiz':
                        if (isPerfectScore && selectedSubject.id === 'toan_hoc') earned = true;
                        break;
                    case 'language_lover':
                        if (isPerfectScore && selectedSubject.id === 'tieng_viet') earned = true;
                        break;
                    case 'science_sleuth':
                        if (isPerfectScore && selectedSubject.id === 'tu_nhien_xa_hoi') earned = true;
                        break;
                }

                if (earned) {
                    newBadges.push(badge);
                    user.addBadge(badge.id);
                }
            }
            setNewlyEarnedBadges(newBadges);
        }
        
        setScore(finalScore);
        setGameState('results');
    };

    const handleRestart = () => {
        const inExamMode = gameState === 'results' && timeLimit > 0;
        resetQuizState();
        if (inExamMode) {
            setGameState('exam_options');
        } else if (selectedTopic) {
            handleTopicSelect(selectedTopic);
        } else {
            setGameState('topic_selection');
        }
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
        handleSubjectSelect,
        handleTopicSelect,
        handleQuizComplete,
        handleRestart,
        handleBackToSubjects,
        showBadgeCollection,
        showParentsCorner,
        handleStartExam,
        handleSelectExamDuration,
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