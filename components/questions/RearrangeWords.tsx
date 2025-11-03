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
    // Only set initial state when question changes or in review mode
    if (isAnswered && userAnswer) {
      const userAnswerWords: Word[] = userAnswer.map(text => {
          const originalWord = initialWords.find(iw => iw.text === text);
          return { id: originalWord ? originalWord.id : Math.random(), text };
      });
      setAnswer(userAnswerWords);
      setWordBank(initialWords.filter(iw => !userAnswer.includes(iw.text)));
    } else {
      setAnswer([]);
      setWordBank([...initialWords].sort(() => Math.random() - 0.5));
    }
  }, [question.words, isAnswered]);

  useEffect(() => {
    // Sync parent state only in quiz mode
    if (!isAnswered) {
        setUserAnswer(answer.map(w => w.text));
    }
  }, [answer, setUserAnswer, isAnswered]);
  
  const handleSelectWord = (word: Word) => {
    setAnswer(prev => [...prev, word]);
    setWordBank(prev => prev.filter(w => w.id !== word.id));
  };

  const handleDeselectWord = (word: Word) => {
    setAnswer(prev => prev.filter(w => w.id !== word.id));
    setWordBank(prev => [...prev, word].sort((a, b) => a.id - b.id));
  };
  
  const handleReset = () => {
      setAnswer([]);
      setWordBank([...initialWords].sort(() => Math.random() - 0.5));
  }
  
  const normalize = (str: string) => str.toLowerCase().trim().replace(/[.,!?;]$/, '');
  const isCorrect = isAnswered && normalize(userAnswer?.join(' ') || '') === normalize(question.correctAnswer);

  return (
    <div>
      <div className="flex items-start gap-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-dark flex-grow">{question.question}</h2>
        <SpeechButton textToSpeak={question.question} />
      </div>
      
      <div className={`bg-white p-4 rounded-xl border-2 border-dashed min-h-[80px] flex flex-wrap gap-3 items-center justify-center mb-6 transition-colors ${
          isAnswered ? (isCorrect ? 'border-success' : 'border-danger') : 'border-secondary-light'
      }`}>
        {answer.length === 0 && <span className="text-secondary">Bấm vào các từ bên dưới để sắp xếp</span>}
        {answer.map((word) => (
          <button 
            key={word.id} 
            onClick={() => !isAnswered && handleDeselectWord(word)} 
            className={`px-4 py-2 font-semibold rounded-lg shadow-md transition-transform ${isAnswered ? 'bg-gray-200 text-gray-500' : 'bg-primary-light text-primary-dark transform hover:scale-105'}`}
            disabled={isAnswered}
          >
            {word.text}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-center min-h-[50px] mb-6">
        {wordBank.map((word) => (
          <button 
            key={word.id} 
            onClick={() => !isAnswered && handleSelectWord(word)} 
            className={`px-4 py-2 font-semibold rounded-lg transition-all ${isAnswered ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-secondary-dark hover:bg-gray-300 transform hover:scale-105'}`}
            disabled={isAnswered}
            >
            {word.text}
          </button>
        ))}
      </div>
      
      {answer.length > 0 && !isAnswered &&
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