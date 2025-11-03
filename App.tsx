
import React, { useState, useEffect } from 'react';
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
import Button from './components/Button';

const App: React.FC = () => {
  const { gameState } = useGame();
  const [isKeyReady, setIsKeyReady] = useState(false);
  const [isLoadingKey, setIsLoadingKey] = useState(true);

  useEffect(() => {
    const checkApiKey = async () => {
      // @ts-ignore - aistudio is globally available in the execution environment
      if (window.aistudio && (await window.aistudio.hasSelectedApiKey())) {
        setIsKeyReady(true);
      }
      setIsLoadingKey(false);
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore - aistudio is globally available in the execution environment
    if (window.aistudio) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        // Giả sử key đã sẵn sàng sau lệnh gọi này để tránh race condition
        setIsKeyReady(true);
    }
  };

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

  const renderApp = () => {
    if (isLoadingKey) {
      return <LoadingView message="Đang kiểm tra cấu hình..." />;
    }
  
    if (!isKeyReady) {
      return (
        <div className="w-full max-w-2xl mx-auto p-6 text-center bg-white rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold text-primary-dark mb-4">Chào mừng bé đến với Sân Chơi Trí Tuệ!</h1>
          <p className="text-lg text-secondary mb-6">Để AI có thể chấm bài và tạo câu hỏi, bé cần chọn một khóa API để sử dụng.</p>
          <p className="text-sm text-gray-500 mb-6">
            Việc này sẽ mở một hộp thoại để bé chọn khóa API của mình. Phí sử dụng có thể được tính vào tài khoản Google Cloud của bé. Vui lòng tham khảo thông tin chi tiết về giá cước tại <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-primary underline font-semibold">trang thanh toán của Gemini</a>.
          </p>
          <Button onClick={handleSelectKey} variant="primary">Chọn Khóa API</Button>
        </div>
      );
    }

    return (
        <main className="w-full max-w-4xl">
          {renderContent()}
        </main>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      {renderApp()}
    </div>
  );
};

export default App;