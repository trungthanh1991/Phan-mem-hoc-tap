
import React from 'react';
import { useGame } from './contexts/GameContext';
import SubjectSelection from './components/SubjectSelection';
import TopicSelection from './components/TopicSelection';
import LoadingView from './components/LoadingView';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import BadgeCollectionView from './components/BadgeCollectionView';
import ParentsCornerView from './components/ParentsCornerView';
import ReadingView from './components/ReadingView';
import ExamOptionsView from './components/ExamOptionsView';
import WritingView from './components/WritingView';

const App: React.FC = () => {
  const { gameState } = useGame();

  const renderContent = () => {
    switch (gameState) {
      case 'subject_selection':
        return <SubjectSelection />;
      case 'topic_selection':
        return <TopicSelection />;
      case 'exam_options':
        return <ExamOptionsView />;
      case 'loading_quiz':
        return <LoadingView />;
      case 'loading_exam':
        return <LoadingView message="Đang tạo đề thi..." subMessage="AI đang chuẩn bị một thử thách đặc biệt cho bé!" />;
      case 'in_quiz':
      case 'in_exam':
        return <QuizView />;
      case 'reading_activity':
        return <ReadingView />;
      case 'writing_activity':
        return <WritingView />;
      case 'results':
        return <ResultsView />;
      case 'badge_collection':
        return <BadgeCollectionView />;
      case 'parents_corner':
        return <ParentsCornerView />;
      default:
        return <div>Trạng thái không xác định</div>;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      <main className="w-full max-w-4xl">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
