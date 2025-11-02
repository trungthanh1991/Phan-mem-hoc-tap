import React from 'react';
import { FillInTheBlankQuestion } from '../../types';

interface Props {
  question: FillInTheBlankQuestion;
  userAnswer: string | null;
  setUserAnswer: (answer: string) => void;
  isAnswered: boolean;
}

const FillInTheBlank: React.FC<Props> = ({ question, userAnswer, setUserAnswer, isAnswered }) => {
  const [part1, part2] = question.questionParts;

  return (
    <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-4">
            <div className="text-2xl md:text-3xl font-bold text-secondary-dark leading-relaxed text-center">
                <span>{part1}</span>
                <input
                    type="text"
                    value={userAnswer || ''}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isAnswered}
                    className="inline-block w-48 mx-2 p-2 text-center text-2xl font-bold text-primary-dark bg-transparent border-b-2 border-primary-light focus:border-primary focus:outline-none transition"
                    autoFocus
                />
                <span>{part2}</span>
            </div>
        </div>
    </div>
  );
};

export default FillInTheBlank;