
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../contexts/GameContext';
import { ReadAloudQuestion, ReadingAnalysis, Badge } from '../types';
import { useUser } from '../contexts/UserContext';
import Card from './Card';
import Button from './Button';
import Spinner from './Spinner';
import { MicrophoneIcon, StopCircleIcon, PlayCircleIcon, ArrowPathIcon } from './icons';
import SpeechButton from './SpeechButton';
import { POST as analyzeReadingApi } from '../api/analyze-reading';
import ReadingFeedback from './ReadingFeedback';
import BadgeUnlockCard from './BadgeUnlockCard';

type Status =
  | 'idle'
  | 'requesting_permission'
  | 'recording'
  | 'recorded'
  | 'uploading' // "uploading" now means "analyzing"
  | 'uploaded'  // "uploaded" now means "analysis complete"
  | 'error';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      // remove the prefix e.g. 'data:audio/webm;codecs=opus;base64,'
      resolve(base64data.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const ReadingView: React.FC = () => {
  const { questions, handleRestart, handleBackToSubjects, handleBackToTopicSelection, selectedTopic, selectedSubject } = useGame();
  const { addReadingRecord } = useUser();
  const question = questions[0] as ReadAloudQuestion;

  const [status, setStatus] = useState<Status>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analysis, setAnalysis] = useState<ReadingAnalysis | null>(null);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<Badge[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const isListeningMode = selectedTopic?.id === 'nghe_doc' || selectedTopic?.id === 'nghe_doc_en';
  const isEnglishListeningHideText = selectedTopic?.id === 'nghe_doc_en';
  const lang = selectedSubject?.id === 'tieng_anh' ? 'en-US' : 'vi-VN';

  const cleanup = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    setIsPlaying(false);
  }, [audioUrl]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audioEl.addEventListener('ended', handleEnded);
    audioEl.addEventListener('play', handlePlay);
    audioEl.addEventListener('pause', handlePause);

    return () => {
      audioEl.removeEventListener('ended', handleEnded);
      audioEl.removeEventListener('play', handlePlay);
      audioEl.removeEventListener('pause', handlePause);
    };
  }, [audioUrl]);

  const handleStartRecording = async () => {
    cleanup();
    setStatus('requesting_permission');
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType });

        if (blob.size < 100) {
          setError('Bản ghi quá ngắn. Hãy đọc to rõ ràng hơn nhé!');
          setStatus('error');
          return;
        }

        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setStatus('recorded');
      };

      mediaRecorder.start();
      setStatus('recording');

    } catch (err) {
      console.error('Lỗi truy cập micro:', err);
      setError('Không thể truy cập micro. Hãy bật quyền micro nhé.');
      setStatus('error');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleTogglePlayback = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    if (isPlaying) {
      audioEl.pause();
      audioEl.currentTime = 0;
    } else {
      audioEl.play();
    }
  };

  const handleUpload = async () => {
    if (!audioBlob) {
      setError('Không có bản ghi âm để phân tích. Vui lòng ghi âm lại.');
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setError(null);
    setAnalysis(null);
    setNewlyUnlockedBadges([]);

    try {
      const audioBase64 = await blobToBase64(audioBlob);
      const mimeType = audioBlob.type;
      
      const result = await analyzeReadingApi({
        passage: question.passage,
        audioBase64: audioBase64,
        mimeType: mimeType,
      });

      setAnalysis(result);
      const newBadges = addReadingRecord(question.passage, result);
      setNewlyUnlockedBadges(newBadges);
      setStatus('uploaded');
    } catch (err) {
      console.error('Lỗi khi phân tích giọng đọc:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
      setStatus('error');
    }
  };

  const handleTryAgain = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setError(null);
    setStatus('idle');
    setAnalysis(null);
    setNewlyUnlockedBadges([]);
  };

  if (!question || question.type !== 'READ_ALOUD') return <p>Đang tải đoạn văn...</p>;
  const isUploading = status === 'uploading';

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 text-center relative">
      <div className="absolute top-0 left-0 md:top-4 md:left-4">
        <button onClick={handleBackToTopicSelection} className="text-primary hover:underline">
          &larr; Quay lại
        </button>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2 mt-8 md:mt-0">
        {isListeningMode ? 'Nghe Đọc' : 'Luyện Đọc'}
      </h1>
      
      {status !== 'uploaded' && (
         <p className="text-lg text-secondary mb-8">
            {isListeningMode 
                ? (isEnglishListeningHideText ? 'Bé hãy bấm nút loa để nghe câu Tiếng Anh, sau đó ghi âm lại thật giống nhé!' : 'Bé hãy bấm nút loa để nghe, sau đó ghi âm lại bài đọc của mình nhé!') 
                : 'Bé hãy đọc to và rõ ràng đoạn văn dưới đây nhé!'}
        </p>
      )}

      {status !== 'uploaded' && (
        <>
            {isEnglishListeningHideText ? (
                <Card className="bg-white p-6 md:p-8 text-center mb-6 min-h-[148px] flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <SpeechButton textToSpeak={question.passage} lang={lang} className="p-4 rounded-full bg-primary-light text-primary" iconSize="h-10 w-10"/>
                    </div>
                </Card>
            ) : (
                <Card className="bg-white p-6 md:p-8 text-left mb-6">
                    <div className="relative">
                        <div className="absolute top-0 right-0">
                            <SpeechButton textToSpeak={question.passage} lang={lang} />
                        </div>
                        <p className="text-2xl leading-relaxed text-secondary-dark pr-10">{question.passage}</p>
                    </div>
                </Card>
            )}
        </>
      )}

      <div className="flex flex-col items-center gap-4">
        {status === 'idle' && (
          <button
            onClick={handleStartRecording}
            className="flex items-center justify-center gap-3 text-2xl font-bold bg-danger text-white rounded-full h-24 w-24 shadow-lg transform hover:scale-110 transition-transform"
          >
            <MicrophoneIcon className="h-10 w-10" />
          </button>
        )}

        {status === 'recording' && (
          <button
            onClick={handleStopRecording}
            className="flex items-center justify-center gap-3 text-2xl font-bold bg-danger text-white rounded-full h-24 w-24 shadow-lg animate-pulse"
          >
            <StopCircleIcon className="h-10 w-10" />
          </button>
        )}

        {(status === 'recorded' || isUploading) && !analysis && (
          <div className="flex flex-col items-center gap-4 w-full max-w-md animate-fade-in-up">
            {status === 'recorded'
              ? <p className="text-secondary-dark mb-2">Ghi âm thành công! Bấm 'Nộp bài' để AI chấm điểm nhé.</p>
              : <p className="text-secondary-dark font-semibold">AI đang phân tích bài đọc của bé...</p>}

            <audio ref={audioRef} src={audioUrl || ''} className="hidden"></audio>

            <Button onClick={handleUpload} variant="primary" className="w-full"
              isLoading={isUploading} loadingText="Đang phân tích...">
              Nộp bài
            </Button>

            <div className="flex items-center gap-4">
              <button onClick={handleTogglePlayback}
                className="flex items-center gap-2 py-2 px-4 bg-secondary-light text-secondary-dark font-semibold rounded-full transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUploading}>
                {isPlaying ? (
                  <>
                    <StopCircleIcon className="h-6 w-6" /><span>Dừng nghe</span>
                  </>
                ) : (
                  <>
                    <PlayCircleIcon className="h-6 w-6" /><span>Nghe lại</span>
                  </>
                )}
              </button>
              <button onClick={handleTryAgain}
                className="flex items-center gap-2 py-2 px-4 bg-secondary-light text-secondary-dark font-semibold rounded-full transform hover:scale-105 transition-transform"
                disabled={isUploading}>
                <ArrowPathIcon className="h-6 w-6" /><span>Ghi âm lại</span>
              </button>
            </div>
          </div>
        )}

        {status === 'requesting_permission' && (
          <div className="flex flex-col items-center gap-4">
            <Spinner />
            <p className="text-secondary-dark font-semibold">
              Bé hãy cho phép dùng micro nhé...
            </p>
          </div>
        )}

        {status === 'uploaded' && analysis && (
          <div className="w-full max-w-3xl space-y-4 animate-fade-in-up">
            <ReadingFeedback passage={question.passage} analysis={analysis} />
            
            {newlyUnlockedBadges.length > 0 && (
              <div className="w-full max-w-md mx-auto space-y-4 pt-4">
                {newlyUnlockedBadges.map((badge) => (
                  <BadgeUnlockCard key={badge.id} badge={badge} />
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={handleRestart} variant="primary" className="w-full sm:w-auto">
                {isListeningMode ? 'Nghe câu khác' : 'Đọc đoạn khác'}
              </Button>
              <Button onClick={handleBackToSubjects} variant="secondary" className="w-full sm:w-auto">
                Về trang chủ
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="w-full max-w-md space-y-4 animate-fade-in-up">
            <Card className="bg-danger-light text-danger-dark p-4">{error}</Card>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button onClick={handleTryAgain} variant="primary" className="w-full sm:w-auto">
                Thử lại
              </Button>
              <Button onClick={handleBackToSubjects} variant="secondary" className="w-full sm:w-auto">
                Về trang chủ
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingView;