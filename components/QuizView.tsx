import React, { useState, useMemo, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon } from './icons';
import { useGame } from '../contexts/GameContext';
import Card from './Card';
import Button from './Button';
import MultipleChoice from './questions/MultipleChoice';
import FillInTheBlank from './questions/FillInTheBlank';
import RearrangeWords from './questions/RearrangeWords';
import Timer from './Timer';

const QuizView: React.FC = () => {
  const { questions, handleQuizComplete, selectedSubject, passage, selectedTopic, gameState, timeLimit, handleBackToTopicSelection, handleBackToExamOptions } = useGame();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | string[] | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const totalQuestions = useMemo(() => questions.length, [questions]);

  // FIX: Add useCallback import from react to resolve 'Cannot find name' error.
  const handleTimeUp = useCallback(() => {
    // Pass the current score when time is up
    handleQuizComplete(score);
  }, [score, handleQuizComplete]);

  if (!questions || totalQuestions === 0) {
    return <div>Đang tải câu hỏi...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const normalizeAnswer = (input: string | string[]): string => {
    const str = Array.isArray(input) ? input.join(' ') : String(input);
    // 1. Chuyển thành chữ thường
    // 2. Xóa khoảng trắng đầu/cuối
    // 3. Xóa các dấu câu phổ biến ở cuối (. , ! ?)
    return str.toLowerCase().trim().replace(/[.,!?;]$/, '');
  };

  const handleSubmitAnswer = () => {
    if (userAnswer === null || userAnswer.length === 0) {
      alert("Bé hãy trả lời câu hỏi nhé!");
      return;
    }

    const normalizedUserAnswer = normalizeAnswer(userAnswer);
    const normalizedCorrectAnswer = normalizeAnswer(currentQuestion.correctAnswer);

    const correct = normalizedUserAnswer === normalizedCorrectAnswer;
    
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setUserAnswer(null);
    setIsCorrect(null);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete(score);
    }
  };
  
  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'MULTIPLE_CHOICE':
        return <MultipleChoice 
          question={currentQuestion}
          userAnswer={userAnswer as string | null}
          setUserAnswer={setUserAnswer}
          isAnswered={isAnswered}
        />
      case 'FILL_IN_THE_BLANK':
        return <FillInTheBlank 
          question={currentQuestion}
          userAnswer={userAnswer as string | null}
          setUserAnswer={setUserAnswer}
          isAnswered={isAnswered}
        />
      case 'REARRANGE_WORDS':
        return <RearrangeWords
          question={currentQuestion}
          userAnswer={userAnswer as string[] | null}
          setUserAnswer={setUserAnswer}
          isAnswered={isAnswered}
        />
      {/* FIX: Add case for 'READ_ALOUD' to make the switch statement exhaustive.
          This view is not intended to handle this question type, but this handles the case gracefully
          to satisfy the type system and prevent crashes. */}
      case 'READ_ALOUD':
        return <div>Loại câu hỏi này không được hỗ trợ trong bài kiểm tra này.</div>;
      default:
        // TypeScript exhaustiveness check
        const _exhaustiveCheck: never = currentQuestion;
        return <div>Loại câu hỏi không xác định.</div>;
    }
  }

  const progressPercentage = useMemo(() => {
    return ((currentQuestionIndex + 1) / totalQuestions) * 100;
  }, [currentQuestionIndex, totalQuestions]);


  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 relative">
       <div className="absolute top-0 left-0 md:top-4 md:left-4">
            <button 
                onClick={gameState === 'in_exam' ? handleBackToExamOptions : handleBackToTopicSelection} 
                className="text-primary hover:underline"
            >
                &larr; Quay lại
            </button>
        </div>
       
       {gameState === 'in_exam' && timeLimit > 0 && (
          <Timer initialSeconds={timeLimit} onTimeUp={handleTimeUp} />
       )}

       {passage && selectedTopic?.id === 'doc_hieu_doan_van' && (
          <Card className="mb-6 bg-white/80 backdrop-blur-sm mt-8">
            <div className="flex items-start gap-2">
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-primary-dark mb-2">Đoạn văn</h3>
                <p className="text-lg text-secondary-dark leading-relaxed">{passage}</p>
              </div>
            </div>
          </Card>
        )}

      <div className="mb-6 mt-8">
        <div className="flex justify-between items-center mb-2 text-secondary">
          <span>Câu hỏi {currentQuestionIndex + 1} / {totalQuestions}</span>
          <span>Điểm: {score}</span>
        </div>
        <div className="w-full bg-secondary-light rounded-full h-4">
          <div className={`${selectedSubject?.baseColor || 'bg-primary'} h-4 rounded-full transition-all duration-500`} style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <Card className={`${selectedSubject?.lightBgColor || 'bg-white'}`}>
        {renderQuestion()}
      </Card>
      
      {isAnswered && (
        <Card className={`mt-6 flex items-start space-x-4 ${isCorrect ? 'bg-success-light text-success-dark' : 'bg-danger-light text-danger-dark'}`}>
          {isCorrect ? <CheckCircleIcon className="h-8 w-8 flex-shrink-0 text-success" /> : <XCircleIcon className="h-8 w-8 flex-shrink-0 text-danger" />}
          <div className="flex-grow">
            <h3 className="font-bold text-lg">{isCorrect ? "Chính xác! Hoan hô bé!" : "Tiếc quá, sai rồi!"}</h3>
            <div className="flex items-start">
              <p className="mt-1 flex-grow">{currentQuestion.explanation}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-8 text-center">
        {!isAnswered ? (
          <Button onClick={handleSubmitAnswer} variant="primary" disabled={!userAnswer || userAnswer.length === 0}>
            Kiểm tra
          </Button>
        ) : (
          <Button onClick={handleNextQuestion} variant="success" className="animate-pulse">
            {currentQuestionIndex < totalQuestions - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizView;