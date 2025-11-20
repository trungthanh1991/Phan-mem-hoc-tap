
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { RearrangeWordsQuestion } from '../../types';
import SpeechButton from '../SpeechButton';
import { useGame } from '../../contexts/GameContext';

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
  const { selectedSubject } = useGame();
  const lang = selectedSubject?.id === 'tieng_anh' ? 'en-US' : 'vi-VN';

  const initialWords = useMemo(() => 
    question.words.map((text, index) => ({ id: index, text }))
  , [question.words]);

  const [answer, setAnswer] = useState<Word[]>([]);
  const [wordBank, setWordBank] = useState<Word[]>([]);
  const prevQuestionWordsRef = useRef<string[] | null>(null);

  useEffect(() => {
    const questionHasChanged = JSON.stringify(prevQuestionWordsRef.current) !== JSON.stringify(question.words);

    if (isAnswered && userAnswer) {
      // Chế độ xem lại: Hiển thị câu trả lời đã nộp của người dùng.
      const userAnswerWords: Word[] = userAnswer.map(text => {
          const originalWord = initialWords.find(iw => iw.text === text);
          return { id: originalWord ? originalWord.id : Math.random(), text };
      });
      setAnswer(userAnswerWords);
      setWordBank(initialWords.filter(iw => !userAnswer.includes(iw.text)));
    } else if (questionHasChanged) {
      // Chế độ làm bài (câu hỏi mới): Reset trạng thái và xáo trộn các từ.
      setAnswer([]);
      setWordBank([...initialWords].sort(() => Math.random() - 0.5));
    }
    
    // Cập nhật ref nếu câu hỏi đã thay đổi.
    if (questionHasChanged) {
        prevQuestionWordsRef.current = question.words;
    }
  }, [question.words, isAnswered, userAnswer, initialWords]);

  useEffect(() => {
    // Đồng bộ trạng thái 'answer' cục bộ lên component cha ở chế độ làm bài.
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
  
  // Logic kiểm tra toán học (được đồng bộ từ QuizView để hiển thị màu đúng)
  const isCorrect = useMemo(() => {
      if (!isAnswered) return false;
      const normalize = (str: string) => str.toLowerCase().trim().replace(/[.,!?;]$/, '');
      const userString = userAnswer?.join(' ') || '';
      const correctString = question.correctAnswer;

      if (normalize(userString) === normalize(correctString)) return true;

      if (correctString.includes('=')) {
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
  }, [isAnswered, userAnswer, question.correctAnswer]);

  return (
    <div>
      <div className="flex items-start gap-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-dark flex-grow">{question.question}</h2>
        <SpeechButton textToSpeak={question.question} lang={lang} />
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
            className={`px-4 py-2 font-semibold rounded-lg transition-colors transition-transform duration-200 ${isAnswered ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-secondary-dark hover:bg-gray-300 transform hover:scale-105'}`}
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
