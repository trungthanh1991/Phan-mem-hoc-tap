import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../contexts/GameContext';
import { ReadAloudQuestion } from '../types';
import Card from './Card';
import Button from './Button';
import Spinner from './Spinner';
import { MicrophoneIcon, StopCircleIcon, PlayCircleIcon, ArrowPathIcon } from './icons';
import SpeechButton from './SpeechButton';

type Status = 'idle' | 'requesting_permission' | 'recording' | 'recorded' | 'uploading' | 'uploaded' | 'error';


const ReadingView: React.FC = () => {
    const { questions, handleRestart, handleBackToSubjects, handleBackToTopicSelection } = useGame();
    const question = questions[0] as ReadAloudQuestion;

    const [status, setStatus] = useState<Status>('idle');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const cleanup = useCallback(() => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        mediaRecorderRef.current = null;
        setAudioBlob(null);
        setAudioUrl(null);
        setIsPlaying(false);
    }, [audioUrl]);

    // Effect để cleanup khi component unmount
    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    // Effect để quản lý trạng thái phát của audio
    useEffect(() => {
        const audioEl = audioRef.current;
        if (audioEl) {
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
        }
    }, [audioUrl]);

    const handleStartRecording = async () => {
        cleanup(); // Dọn dẹp các bản ghi cũ trước khi bắt đầu
        setStatus('requesting_permission');
        setError(null);
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream); // Để trình duyệt tự chọn định dạng tốt nhất
            mediaRecorderRef.current = mediaRecorder;
            const audioChunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                stream.getTracks().forEach(track => track.stop());
                
                // Tạo blob với đúng mimeType mà trình duyệt đã sử dụng
                const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
                
                if (blob.size < 100) {
                    console.warn(`Bản ghi âm quá nhỏ (${blob.size} bytes), có thể do ghi âm quá ngắn.`);
                    setError("Bản ghi âm quá ngắn. Bé hãy thử lại và đọc to, rõ ràng hơn nhé!");
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
            console.error("Lỗi truy cập micro:", err);
            setError("Không thể truy cập micro. Bé hãy kiểm tra lại và cho phép ứng dụng dùng micro nhé.");
            setStatus('error');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
    };

    const handleTogglePlayback = () => {
        const audioEl = audioRef.current;
        if (!audioEl) return;
        if (isPlaying) {
            audioEl.pause();
            audioEl.currentTime = 0; // Reset về đầu để thành nút "stop"
        } else {
            audioEl.play();
        }
    };

   const handleUpload = async () => {
    if (!audioBlob) return;
    setStatus('uploading');
    setError(null);

    const formData = new FormData();
    formData.append('passage', question.passage);
    const fileExtension = audioBlob.type.split('/')[1]?.split(';')[0] || 'webm';
    formData.append('audio', audioBlob, `recording.${fileExtension}`);
    
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyPxYOw_eRQ5QXtw67IeC8GQc38J3XpwpaWRtw5-IA8SUGCmkJkASf7Xs0qG2AqBsZQ/exec', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
           const errorText = await response.text().catch(() => "Không thể đọc phản hồi từ máy chủ.");
           throw new Error(`Lỗi khi gửi bài. Máy chủ phản hồi: ${errorText}`);
        }
        
        setStatus('uploaded');

    } catch (err) {
        // Xử lý trường hợp phổ biến khi Google Apps Script trả về lỗi CORS do chuyển hướng sau khi thành công
        if (err instanceof TypeError && err.message === 'Failed to fetch') {
            console.log("Yêu cầu đã được gửi. Giả định thành công do chuyển hướng CORS từ Google Apps Script.");
            setStatus('uploaded');
        } else {
             if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Đã xảy ra lỗi không xác định khi gửi bài.");
            }
            setStatus('error');
        }
    }
};
    
    const handleTryAgain = () => {
        cleanup();
        setError(null);
        setStatus('idle');
    }

    if (!question || question.type !== 'READ_ALOUD') {
        return <p>Đang tải đoạn văn...</p>;
    }
    
    const isUploading = status === 'uploading';

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-6 text-center relative">
            <div className="absolute top-0 left-0 md:top-4 md:left-4">
                <button onClick={handleBackToTopicSelection} className="text-primary hover:underline">&larr; Quay lại</button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2 mt-8 md:mt-0">Luyện Đọc</h1>
            <p className="text-lg text-secondary mb-8">Bé hãy đọc to và rõ ràng đoạn văn dưới đây nhé!</p>

            <Card className="bg-white p-6 md:p-8 text-left mb-6">
                <div className="relative">
                    <div className="absolute top-0 right-0">
                        <SpeechButton textToSpeak={question.passage} />
                    </div>
                    <p className="text-2xl leading-relaxed text-secondary-dark pr-10">{question.passage}</p>
                </div>
            </Card>

            <div className="flex flex-col items-center gap-4">
                 {status === 'idle' && (
                    <button onClick={handleStartRecording} className="flex items-center justify-center gap-3 text-2xl font-bold bg-danger text-white rounded-full h-24 w-24 shadow-lg transform hover:scale-110 transition-transform">
                        <MicrophoneIcon className="h-10 w-10"/>
                    </button>
                )}
                {status === 'recording' && (
                     <button onClick={handleStopRecording} className="flex items-center justify-center gap-3 text-2xl font-bold bg-danger text-white rounded-full h-24 w-24 shadow-lg animate-pulse">
                        <StopCircleIcon className="h-10 w-10"/>
                    </button>
                )}
                 { (status === 'recorded' || isUploading) && (
                    <div className="flex flex-col items-center gap-4 w-full max-w-md animate-fade-in-up">
                        {status === 'recorded' 
                            ? <p className="text-secondary-dark mb-2">Ghi âm thành công! Bấm 'Nộp bài' để gửi đi nhé.</p>
                            : <p className="text-secondary-dark font-semibold">Đang gửi bài đọc của bé...</p>
                        }
                        <audio ref={audioRef} src={audioUrl || ''} className="hidden"></audio>
                        <Button 
                            onClick={handleUpload} 
                            variant="primary" 
                            className="w-full"
                            isLoading={isUploading}
                            loadingText="Đang gửi..."
                        >
                            Nộp bài
                        </Button>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleTogglePlayback} 
                                className="flex items-center gap-2 py-2 px-4 bg-secondary-light text-secondary-dark font-semibold rounded-full transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed" 
                                aria-label={isPlaying ? "Dừng nghe" : "Nghe lại"}
                                disabled={isUploading}
                            >
                               {isPlaying ? (
                                    <>
                                        <StopCircleIcon className="h-6 w-6"/>
                                        <span>Dừng nghe</span>
                                    </>
                               ) : (
                                    <>
                                        <PlayCircleIcon className="h-6 w-6"/>
                                        <span>Nghe lại</span>
                                    </>
                               )}
                            </button>
                            <button 
                                onClick={handleTryAgain} 
                                className="flex items-center gap-2 py-2 px-4 bg-secondary-light text-secondary-dark font-semibold rounded-full transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed" 
                                aria-label="Ghi âm lại"
                                disabled={isUploading}
                            >
                               <ArrowPathIcon className="h-6 w-6"/>
                               <span>Ghi âm lại</span>
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
                {status === 'uploaded' && (
                    <div className="w-full max-w-md space-y-4 animate-fade-in-up">
                         <Card className="bg-success-light text-success-dark p-4">
                            <h3 className="font-bold text-lg">Thành công!</h3>
                            <p>Bài đọc của bé đã được gửi đi. Cô giáo sẽ lắng nghe và nhận xét sau nhé!</p>
                        </Card>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button onClick={handleRestart} variant="primary" className="w-full sm:w-auto">
                                Đọc đoạn khác
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
