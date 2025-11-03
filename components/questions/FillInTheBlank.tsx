import React from 'react';
import { FillInTheBlankQuestion } from '../../types';
import SpeechButton from '../SpeechButton';
import { CheckCircleIcon, XCircleIcon } from '../icons';

interface Props {
  question: FillInTheBlankQuestion;
  userAnswer: string | null;
  setUserAnswer: (answer: string) => void;
  isAnswered: boolean;
}

const FillInTheBlank: React.FC<Props> = ({ question, userAnswer, setUserAnswer, isAnswered }) => {
  const [part1, part2] = question.questionParts;
  const textToSpeak = `${part1} chỗ trống ${part2}`;
  
  const normalize = (str: string | null) => (str || '').trim().toLowerCase();
  const isCorrect = isAnswered && normalize(userAnswer) === normalize(question.correctAnswer);

  return (
    <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-2xl md:text-3xl font-bold text-secondary-dark leading-relaxed text-center flex items-center flex-wrap justify-center">
                <span>{part1}</span>
                <input
                    type="text"
                    value={userAnswer || ''}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className={`inline-block w-48 mx-2 p-2 text-center text-2xl font-bold bg-transparent border-b-2 focus:outline-none transition ${
                        isAnswered 
                            ? (isCorrect ? 'border-success' : 'border-danger')
                            : 'border-primary-light focus:border-primary text-primary-dark'
                    }`}
                    disabled={isAnswered}
                    autoFocus
                />
                <span>{part2}</span>
            </div>
             <SpeechButton textToSpeak={textToSpeak} />
        </div>
        {isAnswered && !isCorrect && (
            <p className="mt-2 text-lg text-secondary-dark">
                Đáp án đúng là: <strong className="text-success font-bold">{question.correctAnswer}</strong>
            </p>
        )}
    </div>
  );
};

export default FillInTheBlank;