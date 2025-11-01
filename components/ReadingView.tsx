import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import { ReadAloudQuestion, ReadingAnalysis, Badge } from '../types';
import { analyzeReading } from '../services/geminiService';
import { BADGES } from '../constants';
import Card from './Card';
import Button from './Button';
import ReadingFeedback from './ReadingFeedback';
import Spinner from './Spinner';
import BadgeUnlockCard from './BadgeUnlockCard';
import { MicrophoneIcon, StopCircleIcon, PlayCircleIcon, ArrowPathIcon } from './icons';

type Status = 'idle' | 'requesting_permission' | 'ready_to_record' | 'recording' | 'recorded' | 'analyzing' | 'feedback' | 'error';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const ReadingView: React.FC = () => {
    const { questions, handleRestart, handleBackToSubjects, handleBackToTopicSelection } = useGame();
    const user = useUser();
    const question = questions[0] as ReadAloudQuestion;

    const [status, setStatus] = useState<Status>('idle');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<ReadingAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [newlyEarnedBadge, setNewlyEarnedBadge] = useState<Badge | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement>(null);

    const cleanup = useCallback(() => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
        setAudioBlob(null);
        setAudioUrl(null);
    }, [audioUrl]);

    const requestMicrophone = useCallback(async () => {
        setStatus('requesting_permission');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const options = { mimeType: 'audio/webm;codecs=opus' };
            const mediaRecorder = new MediaRecorder(stream, options);

            mediaRecorder.onstart = () => {
                audioChunksRef.current = [];
                setStatus('recording');
            };
            
            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: options.mimeType });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioUrl(url);
                setStatus('recorded');
                // Dừng các track để tắt icon ghi âm trên tab trình duyệt
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current = mediaRecorder;
            setStatus('ready_to_record');
        } catch (err) {
            console.error("Lỗi truy cập micro:", err);
            setError("Không thể truy cập micro. Bé hãy kiểm tra lại và cho phép ứng dụng dùng micro nhé.");
            setStatus('error');
        }
    }, []);
    
    useEffect(() => {
        requestMicrophone();
        return cleanup;
    }, [requestMicrophone, cleanup]);

    const startRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.start();
        } else {
             // Nếu người dùng từ chối và muốn thử lại
            requestMicrophone();
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };

    const handleAnalyze = async () => {
        if (!audioBlob) return;
        setStatus('analyzing');
        setError(null);
        try {
            const mimeType = audioBlob.type;
            const base64Audio = await blobToBase64(audioBlob);
            const result = await analyzeReading(question.passage, base64Audio, mimeType);
            setAnalysisResult(result);

            if (result.accuracy >= 95 && !user.earnedBadges.includes('reading_rockstar')) {
                const badge = BADGES.find(b => b.id === 'reading_rockstar');
                if (badge) {
                    user.addBadge('reading_rockstar');
                    setNewlyEarnedBadge(badge);
                }
            }

            setStatus('feedback');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Đã xảy ra lỗi không xác định.");
            }
            setStatus('error');
        }
    };
    
    const handleTryAgain = () => {
        cleanup();
        setAnalysisResult(null);
        setError(null);
        setNewlyEarnedBadge(null);
        requestMicrophone();
    }

    if (!question || question.type !== 'READ_ALOUD') {
        return <p>Đang tải đoạn văn...</p>;
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-6 text-center relative">
            <div className="absolute top-0 left-0 md:top-4 md:left-4">
                <button onClick={handleBackToTopicSelection} className="text-primary hover:underline">&larr; Quay lại</button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2 mt-8 md:mt-0">Luyện Đọc Cùng AI</h1>
            <p className="text-lg text-secondary mb-8">Bé hãy đọc to và rõ ràng đoạn văn dưới đây nhé!</p>

            <Card className="bg-white p-6 md:p-8 text-left mb-6">
                {status !== 'feedback' ? (
                    <p className="text-2xl leading-relaxed text-secondary-dark">{question.passage}</p>
                ) : (
                    analysisResult && <ReadingFeedback passage={question.passage} analysis={analysisResult} />
                )}
            </Card>

            {error && <Card className="bg-danger-light text-danger-dark p-4 mb-4">{error}</Card>}

            <div className="flex flex-col items-center gap-4">
                {status === 'ready_to_record' && (
                    <button onClick={startRecording} className="flex items-center justify-center gap-3 text-2xl font-bold bg-danger text-white rounded-full h-24 w-24 shadow-lg transform hover:scale-110 transition-transform">
                        <MicrophoneIcon className="h-10 w-10"/>
                    </button>
                )}
                {status === 'recording' && (
                     <button onClick={stopRecording} className="flex items-center justify-center gap-3 text-2xl font-bold bg-danger text-white rounded-full h-24 w-24 shadow-lg animate-pulse">
                        <StopCircleIcon className="h-10 w-10"/>
                    </button>
                )}
                 {status === 'recorded' && (
                    <div className="flex flex-col items-center gap-4 w-full max-w-md animate-fade-in-up">
                        <p className="text-secondary-dark mb-2">Bé đã ghi âm xong! Bấm 'Gửi đi phân tích' để AI chấm điểm, hoặc nghe lại/ghi âm lại nhé.</p>
                        <audio ref={audioRef} src={audioUrl || ''} className="hidden"></audio>
                        <Button onClick={handleAnalyze} variant="primary" className="w-full">Gửi đi phân tích</Button>
                        <div className="flex items-center gap-4">
                            <button onClick={() => audioRef.current?.play()} className="flex items-center gap-2 py-2 px-4 bg-secondary-light text-secondary-dark font-semibold rounded-full transform hover:scale-105 transition-transform" aria-label="Nghe lại">
                               <PlayCircleIcon className="h-6 w-6"/>
                               <span>Nghe lại</span>
                            </button>
                            <button onClick={handleTryAgain} className="flex items-center gap-2 py-2 px-4 bg-secondary-light text-secondary-dark font-semibold rounded-full transform hover:scale-105 transition-transform" aria-label="Ghi âm lại">
                               <ArrowPathIcon className="h-6 w-6"/>
                               <span>Ghi âm lại</span>
                            </button>
                        </div>
                    </div>
                )}
                 {status === 'analyzing' && (
                    <div className="flex flex-col items-center gap-4">
                        <Spinner />
                        <p className="text-secondary-dark font-semibold">AI đang lắng nghe và phân tích, bé chờ chút nhé...</p>
                    </div>
                )}
                {status === 'feedback' && (
                    <div className="w-full max-w-md space-y-4">
                        {newlyEarnedBadge && (
                           <BadgeUnlockCard badge={newlyEarnedBadge} />
                        )}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button onClick={handleTryAgain} variant="success" className="w-full sm:w-auto">
                                Thử lại
                            </Button>
                            <Button onClick={handleRestart} variant="primary" className="w-full sm:w-auto">
                                Đọc đoạn văn khác
                            </Button>
                        </div>
                     </div>
                )}
                { (status === 'feedback' || status === 'error' && error !== 'Không thể truy cập micro. Bé hãy kiểm tra lại và cho phép ứng dụng dùng micro nhé.') &&
                     <Button onClick={handleBackToSubjects} variant="secondary">
                        Về trang chủ
                    </Button>
                }
            </div>
        </div>
    );
};

export default ReadingView;