import React, { useState, useMemo, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../contexts/GameContext';
import { useSound } from '../contexts/SoundContext';
import { useUser } from '../contexts/UserContext';
import Card from './Card';
import Button from './Button';
import MultipleChoice from './questions/MultipleChoice';
import FillInTheBlank from './questions/FillInTheBlank';
import RearrangeWords from './questions/RearrangeWords';
import Timer from './Timer';
import SpeechButton from './SpeechButton';
import { CheckCircleIcon, XCircleIcon } from './icons';
import { Question } from '../types';
import Mascot, { MascotEmotion } from './Mascot';
import LoadingView from './LoadingView';

interface QuizViewProps {
    mode: 'quiz' | 'review';
}

const QuizView: React.FC<QuizViewProps> = ({ mode }) => {
    const {
        questions, selectedSubject, passage, selectedTopic, gameState, timeLimit,
        handleBackToTopicSelection, handleBackToExamOptions, userAnswers,
        incrementScore, recordAnswer, handleFinishQuiz, handleBackToResults
    } = useGame();

    const { playSound } = useSound();
    const { earnStars } = useUser();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentUserAnswer, setCurrentUserAnswer] = useState<(string | string[] | null)>(null);
    const [mascotEmotion, setMascotEmotion] = useState<MascotEmotion>('idle');

    const isQuizMode = mode === 'quiz';
    const isReviewMode = mode === 'review';

    const totalQuestions = questions.length;
    if (!questions || totalQuestions === 0) {
        return <LoadingView message="Đang tải câu hỏi..." subMessage="Bé chờ một chút xíu nhé!" />;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const lang = selectedSubject?.id === 'tieng_anh' ? 'en-US' : 'vi-VN';

    const isCurrentQuestionAnswered = useMemo(() => {
        if (isReviewMode) return true;
        return userAnswers[currentQuestionIndex] !== null;
    }, [userAnswers, currentQuestionIndex, isReviewMode]);

    const displayedAnswer = isCurrentQuestionAnswered
        ? userAnswers[currentQuestionIndex]
        : currentUserAnswer;

    useEffect(() => {
        if (isQuizMode && !isCurrentQuestionAnswered) {
            setCurrentUserAnswer(null);
            setMascotEmotion('idle');
        }
    }, [currentQuestionIndex, isQuizMode, isCurrentQuestionAnswered]);

    const handleTimeUp = useCallback(() => {
        handleFinishQuiz();
    }, [handleFinishQuiz]);

    // Hàm kiểm tra đáp án thông minh
    const checkIsCorrect = (question: Question, answer: string | string[] | null): boolean => {
        if (answer === null) return false;

        const normalize = (str: string) => String(str).toLowerCase().trim().replace(/[.,!?;]$/, '');
        const userString = Array.isArray(answer) ? answer.join(' ') : String(answer);
        const correctString = question.correctAnswer;

        // 1. So sánh chuỗi cơ bản
        if (normalize(userString) === normalize(correctString)) return true;

        // 2. Kiểm tra toán học (cho phép giao hoán 2x5 = 5x2)
        if ((question.type === 'REARRANGE_WORDS' || question.type === 'FILL_IN_THE_BLANK') && correctString.includes('=')) {
            try {
                if (!/^[0-9+\-*/().\s=x:]+$/.test(userString)) return false;
                const toJS = (s: string) => s.replace(/x/g, '*').replace(/:/g, '/').replace(/=/g, '===');
                // eslint-disable-next-line no-new-func
                const fn = new Function(`return ${toJS(userString)}`);
                return fn() === true;
            } catch (e) {
                return false;
            }
        }

        return false;
    };

    const isCorrect = checkIsCorrect(currentQuestion, userAnswers[currentQuestionIndex]);

    const handleAnswerChange = (answer: string | string[]) => {
        if (!isCurrentQuestionAnswered && isQuizMode) {
            setCurrentUserAnswer(answer);
        }
    };

    const handleCheckAnswer = () => {
        if (currentUserAnswer === null || (Array.isArray(currentUserAnswer) && currentUserAnswer.length === 0)) return;

        const answerIsCorrect = checkIsCorrect(currentQuestion, currentUserAnswer);

        if (answerIsCorrect) {
            playSound('correct');
            incrementScore();
            setMascotEmotion('happy');
            earnStars(1); // Award 1 star for correct answer!

            // Confetti effect for correct answer
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#10B981', '#3B82F6', '#F59E0B'] // Green, Blue, Amber
            });
        } else {
            playSound('wrong');
            setMascotEmotion('sad');
        }
        recordAnswer(currentQuestionIndex, currentUserAnswer);
    };

    const handleNext = () => {
        playSound('click');
        setMascotEmotion('idle');
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else if (isQuizMode) {
            // Big confetti for finishing quiz
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#EC4899', '#8B5CF6', '#F472B6']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#EC4899', '#8B5CF6', '#F472B6']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();

            handleFinishQuiz();
        }
    };

    const handlePrevious = () => {
        playSound('click');
        setMascotEmotion('idle');
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleBack = () => {
        playSound('click');
        if (isReviewMode) {
            handleBackToResults();
        } else if (gameState === 'in_exam') {
            handleBackToExamOptions();
        } else {
            handleBackToTopicSelection();
        }
    }

    const renderQuestion = () => {
        switch (currentQuestion.type) {
            case 'MULTIPLE_CHOICE':
                return <MultipleChoice
                    question={currentQuestion}
                    userAnswer={displayedAnswer as string | null}
                    setUserAnswer={handleAnswerChange as (answer: string) => void}
                    isAnswered={isCurrentQuestionAnswered}
                />
            case 'FILL_IN_THE_BLANK':
                return <FillInTheBlank
                    question={currentQuestion}
                    userAnswer={displayedAnswer as string | null}
                    setUserAnswer={handleAnswerChange as (answer: string) => void}
                    isAnswered={isCurrentQuestionAnswered}
                />
            case 'REARRANGE_WORDS':
                return <RearrangeWords
                    question={currentQuestion}
                    userAnswer={displayedAnswer as string[] | null}
                    setUserAnswer={handleAnswerChange as (answer: string[]) => void}
                    isAnswered={isCurrentQuestionAnswered}
                />
            default: return <div>Loại câu hỏi không xác định.</div>;
        }
    };

    const progressPercentage = useMemo(() => {
        const answeredCount = userAnswers.filter(ans => ans !== null).length;
        return (answeredCount / totalQuestions) * 100;
    }, [userAnswers, totalQuestions]);

    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-6 relative">
            {/* Mascot floating in the corner */}
            <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 pointer-events-none hidden md:block">
                <Mascot emotion={mascotEmotion} size={140} />
            </div>

            {/* Mascot for mobile (smaller, inline) */}
            <div className="md:hidden absolute top-14 right-0 z-10 opacity-80 pointer-events-none">
                <Mascot emotion={mascotEmotion} size={80} />
            </div>

            <div className="absolute top-0 left-0 md:top-4 md:left-4 z-10">
                <button
                    onClick={handleBack}
                    className="text-primary hover:underline bg-white/50 rounded-full px-3 py-1 backdrop-blur-sm"
                >
                    &larr; {isReviewMode ? 'Về kết quả' : 'Quay lại'}
                </button>
            </div>

            {isQuizMode && gameState === 'in_exam' && timeLimit > 0 && (
                <Timer initialSeconds={timeLimit} onTimeUp={handleTimeUp} />
            )}

            {passage && selectedTopic?.id === 'doc_hieu_doan_van' && (
                <Card className="mb-6 bg-white/80 backdrop-blur-sm mt-12">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-primary-dark">Đoạn văn</h3>
                        <SpeechButton textToSpeak={passage} lang={lang} />
                    </div>
                    <p className="text-lg text-secondary-dark leading-relaxed">{passage}</p>
                </Card>
            )}

            <div className="mb-6 mt-12">
                <div className="flex justify-between items-center mb-2 text-secondary font-semibold">
                    <span className="bg-white/50 px-2 rounded-md">Câu {currentQuestionIndex + 1} / {totalQuestions}</span>
                    {isCurrentQuestionAnswered && (
                        isCorrect ?
                            <span className="flex items-center gap-1 font-bold text-success bg-white/80 px-2 rounded-full shadow-sm"><CheckCircleIcon className="h-5 w-5" /> Đúng</span> :
                            <span className="flex items-center gap-1 font-bold text-danger bg-white/80 px-2 rounded-full shadow-sm"><XCircleIcon className="h-5 w-5" /> Sai</span>
                    )}
                </div>
                <div className="w-full bg-secondary-light rounded-full h-4 shadow-inner overflow-hidden">
                    <div className={`${selectedSubject?.baseColor || 'bg-primary'} h-4 rounded-full transition-all duration-500 ease-out`} style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>

            <Card className={`${selectedSubject?.lightBgColor || 'bg-white'} shadow-xl transition-all duration-300`}>
                {renderQuestion()}
            </Card>

            {isCurrentQuestionAnswered && (
                <Card className={`mt-6 ${isCorrect ? 'bg-success-light border-2 border-success' : 'bg-danger-light border-2 border-danger'} animate-fade-in-up`}>
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                        {isCorrect ?
                            <CheckCircleIcon className="h-7 w-7 text-success-dark" /> :
                            <XCircleIcon className="h-7 w-7 text-danger-dark" />
                        }
                        <span className={isCorrect ? 'text-success-dark' : 'text-danger-dark'}>
                            {isCorrect ? 'Chính xác! Bé giỏi quá! +1 ⭐' : 'Chưa đúng rồi, cố lên nhé!'}
                        </span>
                    </h4>
                    <p className="text-secondary-dark">{currentQuestion.explanation}</p>
                </Card>
            )}

            <div className="mt-8 grid grid-cols-3 gap-4 items-center mb-20 md:mb-0">
                <div className="text-left">
                    <Button
                        onClick={handlePrevious}
                        variant="secondary"
                        className={`py-3 px-4 md:px-6 text-lg ${currentQuestionIndex === 0 ? 'invisible' : ''}`}
                        disableSound={true}
                    >
                        &larr; Trước
                    </Button>
                </div>

                <div className="text-center">
                    {isQuizMode && !isCurrentQuestionAnswered && (
                        <Button
                            onClick={handleCheckAnswer}
                            variant="primary"
                            disabled={currentUserAnswer === null || (Array.isArray(currentUserAnswer) && currentUserAnswer.length === 0)}
                            disableSound={true}
                            className="shadow-xl transform hover:scale-110 transition-all"
                        >
                            Kiểm tra
                        </Button>
                    )}
                </div>

                <div className="text-right">
                    {(isReviewMode || (isQuizMode && isCurrentQuestionAnswered)) && (
                        <Button
                            onClick={handleNext}
                            variant={isLastQuestion ? "success" : "primary"}
                            className={`py-3 px-4 md:px-6 text-lg ${isLastQuestion && isReviewMode ? 'invisible' : ''}`}
                            disableSound={true}
                        >
                            {isLastQuestion ? 'Xong' : 'Tiếp →'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizView;
