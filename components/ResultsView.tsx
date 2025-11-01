
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { QUIZ_LENGTH } from '../constants';
import Card from './Card';
import Button from './Button';
import Sparkles from './Sparkles';
import BadgeUnlockCard from './BadgeUnlockCard';
import SpeechButton from './SpeechButton';

const ResultsView: React.FC = () => {
  const { score, handleRestart, handleBackToSubjects, selectedSubject, newlyEarnedBadges } = useGame();
  const totalQuestions = QUIZ_LENGTH;

  const percentage = (score / totalQuestions) * 100;
  let message = "";
  let emoji = "";

  if (percentage === 100) {
    message = "Xuất sắc! Bé đã trả lời đúng tất cả các câu hỏi!";
    emoji = "🏆";
  } else if (percentage >= 70) {
    message = "Làm tốt lắm! Bé có tiến bộ vượt bậc!";
    emoji = "🎉";
  } else if (percentage >= 50) {
    message = "Khá lắm! Cố gắng thêm một chút nữa nhé!";
    emoji = "👍";
  } else {
    message = "Đừng nản lòng, hãy thử lại nào!";
    emoji = "💪";
  }

  const showSparkles = percentage >= 70;

  const scoreCircleClasses = selectedSubject
    ? `${selectedSubject.lightBgColor} text-secondary-dark border-4 ${selectedSubject.borderColor}`
    : 'bg-primary-light/20 text-primary-dark border-4 border-primary-light';
  
  const renderContent = () => (
    <>
      <div className="text-6xl mb-4 animate-bounce">{emoji}</div>
      <h2 className="text-3xl font-bold text-secondary-dark mb-2">Kết quả của bé</h2>
      <div className="flex justify-center items-center gap-2 mb-4">
        <p className="text-xl text-secondary">{message}</p>
        <SpeechButton textToSpeak={message} />
      </div>
      <div className={`text-4xl font-bold rounded-full w-40 h-40 flex items-center justify-center mx-auto my-6 transition-colors duration-300 ${scoreCircleClasses}`}>
        {score} / {totalQuestions}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleRestart} variant="success">
          Chơi lại
        </Button>
         <Button onClick={handleBackToSubjects} variant="secondary">
          Chọn môn khác
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 w-full max-w-md mx-auto">
      <Card className={`${selectedSubject?.lightBgColor || 'bg-white'} w-full text-center transform hover:scale-105 overflow-hidden`}>
        {showSparkles ? <Sparkles>{renderContent()}</Sparkles> : renderContent()}
      </Card>

      {newlyEarnedBadges.length > 0 && (
        <div className="w-full space-y-4">
          {newlyEarnedBadges.map((badge) => (
            <BadgeUnlockCard key={badge.id} badge={badge} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsView;