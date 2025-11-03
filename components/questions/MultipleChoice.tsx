import React from 'react';
import { MultipleChoiceQuestion } from '../../types';
import SpeechButton from '../SpeechButton';

interface Props {
  question: MultipleChoiceQuestion;
  userAnswer: string | null;
  setUserAnswer: (answer: string) => void;
  isAnswered: boolean;
}

const MultipleChoice: React.FC<Props> = ({ question, userAnswer, setUserAnswer, isAnswered }) => {
  const getOptionClasses = (option: string) => {
    const baseClasses = 'w-full text-left p-4 rounded-xl border-2 transition-all duration-300 text-lg md:text-xl font-medium';
    
    if (isAnswered) {
        const isCorrect = option === question.correctAnswer;
        const isSelected = option === userAnswer;

        if (isCorrect) {
            return `${baseClasses} bg-success-light border-success ring-2 ring-success text-success-dark`;
        }
        if (isSelected && !isCorrect) {
            return `${baseClasses} bg-danger-light border-danger ring-2 ring-danger text-danger-dark`;
        }
        return `${baseClasses} bg-white border-secondary-light opacity-70 cursor-not-allowed`;
    }
    
    if (userAnswer === option) {
        return `${baseClasses} bg-blue-100 border-primary ring-2 ring-primary`;
    }
    return `${baseClasses} bg-white hover:bg-blue-50 border-secondary-light`;
  };
  
  return (
    <div>
      <div className="flex items-start gap-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-dark flex-grow">{question.question}</h2>
        <SpeechButton textToSpeak={question.question} />
      </div>
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setUserAnswer(option)}
            className={getOptionClasses(option)}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoice;