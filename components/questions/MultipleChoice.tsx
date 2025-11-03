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
    let baseClasses = 'w-full text-left p-4 rounded-xl border-2 transition-all duration-300 text-lg md:text-xl';
    if (!isAnswered) {
      return `${baseClasses} ${userAnswer === option ? 'bg-warning-light border-warning' : 'bg-white hover:bg-warning-light border-secondary-light'}`;
    }
    if (option === question.correctAnswer) {
      return `${baseClasses} bg-success-light border-success cursor-not-allowed`;
    }
    if (option === userAnswer && option !== question.correctAnswer) {
      return `${baseClasses} bg-danger-light border-danger cursor-not-allowed`;
    }
    return `${baseClasses} bg-gray-100 border-secondary-light text-secondary cursor-not-allowed`;
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
            disabled={isAnswered}
            className={getOptionClasses(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoice;