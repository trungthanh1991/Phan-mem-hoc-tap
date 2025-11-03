import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import Card from './Card';
import Button from './Button';
import MultipleChoice from './questions/MultipleChoice';
import FillInTheBlank from './questions/FillInTheBlank';
import RearrangeWords from './questions/RearrangeWords';
import Timer from './Timer';
import SpeechButton from './SpeechButton';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface QuizViewProps {
  mode: 'quiz' | 'review';
}

const QuizView: React.FC<QuizViewProps> = ({ mode }) => {
    const { 
        questions, selectedSubject, passage, selectedTopic, gameState, timeLimit, 
        handleBackToTopicSelection, handleBackToExamOptions, userAnswers, 
        incrementScore, recordAnswer, handleFinishQuiz, handleBackToResults
    } = useGame();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentUserAnswer, setCurrentUserAnswer] = useState<(string | string[] | null)>(null);
    
    const isQuizMode = mode === 'quiz';
    const isReviewMode = mode === 'review';
    
    const totalQuestions = questions.length;
    if (!questions || totalQuestions === 0) {
        return <div>Đang tải câu hỏi...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

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
        }
    }, [currentQuestionIndex, isQuizMode, isCurrentQuestionAnswered]);

    const handleTimeUp = useCallback(() => {
        handleFinishQuiz();
    }, [handleFinishQuiz]);

    const normalizeAnswer = (input: string | string[] | null): string => {
      if (input === null) return '';
      const str = Array.isArray(input) ? input.join(' ') : String(input);
      return str.toLowerCase().trim().replace(/[.,!?;]$/, '');
    };
    
    // FIX: Replaced undefined 'normalize' function with the defined 'normalizeAnswer' function.
    const isCorrect = normalizeAnswer(userAnswers[currentQuestionIndex]) === normalizeAnswer(currentQuestion.correctAnswer);

    const handleAnswerChange = (answer: string | string[]) => {
        if (!isCurrentQuestionAnswered && isQuizMode) {
            setCurrentUserAnswer(answer);
        }
    };

    const handleCheckAnswer = () => {
        if (currentUserAnswer === null || (Array.isArray(currentUserAnswer) && currentUserAnswer.length === 0)) return;

        // FIX: Replaced undefined 'normalize' function with the defined 'normalizeAnswer' function.
        const answerIsCorrect = normalizeAnswer(currentUserAnswer) === normalizeAnswer(currentQuestion.correctAnswer);
        if (answerIsCorrect) {
            incrementScore();
        }
        recordAnswer(currentQuestionIndex, currentUserAnswer);
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else if (isQuizMode) {
            handleFinishQuiz();
        }
    };
    
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

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
            <div className="absolute top-0 left-0 md:top-4 md:left-4">
                <button 
                    onClick={
                        isReviewMode ? handleBackToResults : 
                        (gameState === 'in_exam' ? handleBackToExamOptions : handleBackToTopicSelection)
                    } 
                    className="text-primary hover:underline"
                >
                    &larr; {isReviewMode ? 'Về trang kết quả' : 'Quay lại'}
                </button>
            </div>
            
            {isQuizMode && gameState === 'in_exam' && timeLimit > 0 && (
                <Timer initialSeconds={timeLimit} onTimeUp={handleTimeUp} />
            )}

            {passage && selectedTopic?.id === 'doc_hieu_doan_van' && (
                <Card className="mb-6 bg-white/80 backdrop-blur-sm mt-8">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-primary-dark">Đoạn văn</h3>
                        <SpeechButton textToSpeak={passage} />
                    </div>
                    <p className="text-lg text-secondary-dark leading-relaxed">{passage}</p>
                </Card>
            )}

            <div className="mb-6 mt-8">
                <div className="flex justify-between items-center mb-2 text-secondary">
                    <span>Câu hỏi {currentQuestionIndex + 1} / {totalQuestions}</span>
                    {isCurrentQuestionAnswered && (
                        isCorrect ? 
                        <span className="flex items-center gap-1 font-bold text-success"><CheckCircleIcon className="h-5 w-5" /> Đúng</span> :
                        <span className="flex items-center gap-1 font-bold text-danger"><XCircleIcon className="h-5 w-5" /> Sai</span>
                    )}
                </div>
                <div className="w-full bg-secondary-light rounded-full h-4">
                    <div className={`${selectedSubject?.baseColor || 'bg-primary'} h-4 rounded-full transition-all duration-500`} style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>

            <Card className={`${selectedSubject?.lightBgColor || 'bg-white'}`}>
                {renderQuestion()}
            </Card>

            {isCurrentQuestionAnswered && (
                <Card className={`mt-6 ${isCorrect ? 'bg-success-light' : 'bg-danger-light'}`}>
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                        {isCorrect ? 
                            <CheckCircleIcon className="h-7 w-7 text-success-dark"/> : 
                            <XCircleIcon className="h-7 w-7 text-danger-dark"/>
                        }
                        <span className={isCorrect ? 'text-success-dark' : 'text-danger-dark'}>
                            {isCorrect ? 'Chính xác! Làm tốt lắm!' : 'Chưa đúng rồi, bé ơi!'}
                        </span>
                    </h4>
                    <p className="text-secondary-dark">{currentQuestion.explanation}</p>
                </Card>
            )}

            <div className="mt-8 grid grid-cols-3 gap-4 items-center">
                <div className="text-left">
                     <Button
                        onClick={handlePrevious}
                        variant="secondary"
                        className={`py-3 px-6 text-lg ${currentQuestionIndex === 0 ? 'invisible' : ''}`}
                    >
                        &larr; Câu trước
                    </Button>
                </div>

                <div className="text-center">
                    {isQuizMode && !isCurrentQuestionAnswered && (
                        <Button 
                            onClick={handleCheckAnswer} 
                            variant="primary" 
                            disabled={currentUserAnswer === null || (Array.isArray(currentUserAnswer) && currentUserAnswer.length === 0)}
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
                            className={`py-3 px-6 text-lg ${isLastQuestion && isReviewMode ? 'invisible' : ''}`}
                        >
                            {isLastQuestion ? 'Hoàn thành' : 'Câu tiếp theo →'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizView;