import React, { useState, useMemo, useEffect } from 'react';
import { RearrangeWordsQuestion } from '../../types';
import SpeechButton from '../SpeechButton';

interface Props {
  question: RearrangeWordsQuestion;
  userAnswer: string[] | null;
  setUserAnswer: (answer: string[]) => void;
  isAnswered: boolean;
}

interface Word {
  id: number;
  text: string;
}

const RearrangeWords: React.FC<Props> = ({ question, userAnswer, setUserAnswer, isAnswered }) => {
  const initialWords = useMemo(() => 
    question.words.map((text, index) => ({ id: index, text }))
  , [question.words]);

  const [answer, setAnswer] = useState<Word[]>([]);
  const [wordBank, setWordBank] = useState<Word[]>([]);

  useEffect(() => {
    // Shuffle the word bank on first render
    setWordBank([...initialWords].sort(() => Math.random() - 0.5));
  }, [initialWords]);

  useEffect(() => {
    // Sync parent state
    setUserAnswer(answer.map(w => w.text));
  }, [answer, setUserAnswer]);
  
  const handleSelectWord = (word: Word) => {
    if (isAnswered) return;
    setAnswer(prev => [...prev, word]);
    setWordBank(prev => prev.filter(w => w.id !== word.id));
  };

  const handleDeselectWord = (word: Word) => {
    if (isAnswered) return;
    setAnswer(prev => prev.filter(w => w.id !== word.id));
    setWordBank(prev => [...prev, word].sort((a, b) => a.id - b.id));
  };
  
  const handleReset = () => {
      if (isAnswered) return;
      setAnswer([]);
      setWordBank([...initialWords].sort(() => Math.random() - 0.5));
  }

  return (
    <div>
      <div className="flex items-start gap-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-dark flex-grow">{question.question}</h2>
        <SpeechButton textToSpeak={question.question} />
      </div>
      
      {/* Answer Area */}
      <div className="bg-white p-4 rounded-xl border-2 border-dashed min-h-[80px] flex flex-wrap gap-3 items-center justify-center mb-6">
        {answer.length === 0 && <span className="text-secondary">Bấm vào các từ bên dưới để sắp xếp</span>}
        {answer.map((word) => (
          <button 
            key={word.id} 
            onClick={() => handleDeselectWord(word)} 
            className="px-4 py-2 bg-primary-light text-primary-dark font-semibold rounded-lg shadow-md"
            disabled={isAnswered}
          >
            {word.text}
          </button>
        ))}
      </div>

      {/* Word Bank */}
      <div className="flex flex-wrap gap-3 items-center justify-center mb-6">
        {wordBank.map((word) => (
          <button 
            key={word.id} 
            onClick={() => handleSelectWord(word)} 
            className="px-4 py-2 bg-gray-200 text-secondary-dark font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            disabled={isAnswered}
            >
            {word.text}
          </button>
        ))}
      </div>
      
      {!isAnswered && answer.length > 0 &&
          <div className="text-center">
              <button onClick={handleReset} className="text-sm text-secondary hover:underline">
                  Sắp xếp lại
              </button>
          </div>
      }
    </div>
  );
};

export default RearrangeWords;