import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../contexts/GameContext';
import { WritePassageQuestion, WritingAnalysis } from '../types';
import { POST as analyzeHandwritingOnServer } from '../api/analyze-writing';
import Card from './Card';
import Button from './Button';
import { XCircleIcon, UndoIcon } from './icons';
import WritingFeedback from './WritingFeedback';
import SpeechButton from './SpeechButton';

type Status = 'idle' | 'writing' | 'analyzing' | 'feedback' | 'error';

// Custom hook để quản lý logic vẽ trên canvas, được tối ưu hóa cho di động
const useCanvas = (
    clearColor = 'white', 
    lineColor = '#4b5563', // gray-600
    lineWidth = 4,
    gridColor = '#e5e7eb', // gray-200
    gridStep = 20
) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const historyRef = useRef<ImageData[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [canUndo, setCanUndo] = useState(false);

    const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;

        // Vẽ các đường dọc
        for (let x = 0; x < ctx.canvas.width; x += gridStep) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ctx.canvas.height);
            ctx.stroke();
        }

        // Vẽ các đường ngang
        for (let y = 0; y < ctx.canvas.height; y += gridStep) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.width, y);
            ctx.stroke();
        }
    }, [gridColor, gridStep]);

    const clearCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = clearColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawGrid(ctx);
            }
        }
        setHasDrawn(false);
        historyRef.current = [];
        setCanUndo(false);
    }, [clearColor, drawGrid]);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            // Thiết lập kích thước canvas dựa trên container để tương thích với responsive
            const { width } = canvas.getBoundingClientRect();
            canvas.width = width;
            canvas.height = width * 0.5; // Tỷ lệ 2:1
            clearCanvas();
        }
    }, [clearCanvas]);
    

    const getCoords = (e: PointerEvent): { x: number; y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const startDrawing = (e: React.PointerEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const coords = getCoords(e.nativeEvent as PointerEvent);
        if (coords) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
                setCanUndo(true);

                (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);

                ctx.beginPath();
                ctx.moveTo(coords.x, coords.y);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = lineWidth;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                setIsDrawing(true);
                setHasDrawn(true);
            }
        }
    };

    const draw = (e: React.PointerEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;
        
        // Sử dụng coalesced events để vẽ mượt mà và phản hồi nhanh hơn
        const pointerEvents = (e.nativeEvent as PointerEvent).getCoalescedEvents();
        let lastCoords = null;
        
        for (const event of pointerEvents) {
            const coords = getCoords(event);
            if (coords) {
                ctx.lineTo(coords.x, coords.y);
                lastCoords = coords;
            }
        }
        
        ctx.stroke();

        if (lastCoords) {
             ctx.beginPath();
             ctx.moveTo(lastCoords.x, lastCoords.y);
        }
    };

    const stopDrawing = (e: React.PointerEvent) => {
        if (isDrawing) {
            (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId);
            setIsDrawing(false);
        }
    };

    const undo = useCallback(() => {
        if (historyRef.current.length > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx) {
                const lastState = historyRef.current.pop();
                if (lastState) {
                    ctx.putImageData(lastState, 0, 0);
                }
            }
        }
        if (historyRef.current.length === 0) {
            setCanUndo(false);
            setHasDrawn(false);
        }
    }, []);

    return { canvasRef, clearCanvas, hasDrawn, startDrawing, draw, stopDrawing, undo, canUndo };
};

const WritingView: React.FC = () => {
    const { questions, handleBackToTopicSelection, handleRestart } = useGame();
    const question = questions[0] as WritePassageQuestion;

    const [status, setStatus] = useState<Status>('idle');
    const [analysisResult, setAnalysisResult] = useState<WritingAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [handwritingImage, setHandwritingImage] = useState<string>('');
    const { canvasRef, clearCanvas, hasDrawn, startDrawing, draw, stopDrawing, undo, canUndo } = useCanvas();

    if (!question || question.type !== 'WRITE_PASSAGE') {
        return <p>Đang tải đoạn văn...</p>;
    }

    const handleAnalyze = async () => {
        if (!canvasRef.current || !hasDrawn) return;

        setStatus('analyzing');
        setError(null);
        
        try {
            const image = canvasRef.current.toDataURL('image/png');
            setHandwritingImage(image);
            const base64Image = image.split(',')[1];
            
            const result = await analyzeHandwritingOnServer({ passage: question.passage, imageBase64: base64Image });
            setAnalysisResult(result);
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
        setStatus('idle');
        setAnalysisResult(null);
        setError(null);
        setHandwritingImage('');
        clearCanvas();
    }
    
    const isAnalyzing = status === 'analyzing';

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-6 text-center relative">
             <div className="absolute top-0 left-0 md:top-4 md:left-4">
                <button onClick={handleBackToTopicSelection} className="text-primary hover:underline">&larr; Quay lại</button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2 mt-8 md:mt-0">Luyện Viết</h1>
            <p className="text-lg text-secondary mb-8">Bé hãy viết lại thật đẹp đoạn văn dưới đây vào khung nhé!</p>

            {status !== 'feedback' && (
                <Card className="bg-white p-6 md:p-8 text-center mb-6">
                    <div className="flex justify-center items-start gap-4">
                        <p className="text-2xl leading-relaxed text-secondary-dark font-semibold">{question.passage}</p>
                        <SpeechButton textToSpeak={question.passage} />
                    </div>
                </Card>
            )}

            {status === 'feedback' && analysisResult && (
                <WritingFeedback 
                    passage={question.passage} 
                    analysis={analysisResult}
                    handwritingImage={handwritingImage}
                />
            )}
            
             {status !== 'feedback' && (
                 <>
                    <canvas
                        ref={canvasRef}
                        onPointerDown={startDrawing}
                        onPointerMove={draw}
                        onPointerUp={stopDrawing}
                        onPointerLeave={stopDrawing}
                        onPointerCancel={stopDrawing}
                        className="w-full bg-white rounded-lg shadow-inner cursor-crosshair border-2 border-gray-200 touch-none"
                    />
                    <div className="flex justify-end items-center gap-4 mt-4">
                        <button
                            onClick={undo}
                            className="flex items-center gap-2 py-2 px-4 bg-gray-200 text-secondary-dark font-semibold rounded-full hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Hoàn tác"
                            disabled={isAnalyzing || !canUndo}
                        >
                            <UndoIcon className="h-5 w-5" />
                            <span>Hoàn tác</span>
                        </button>
                        <button
                            onClick={clearCanvas}
                            className="flex items-center gap-2 py-2 px-4 bg-gray-200 text-secondary-dark font-semibold rounded-full hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Xóa hết"
                            disabled={isAnalyzing || !hasDrawn}
                        >
                            <XCircleIcon className="h-5 w-5" />
                            <span>Xóa hết</span>
                        </button>
                     </div>
                </>
             )}
            
            <div className="mt-6 flex flex-col items-center gap-4">
                {status === 'idle' && (
                    <Button onClick={handleAnalyze} variant="primary" disabled={!hasDrawn}>
                        Gửi đi phân tích
                    </Button>
                )}
                {status === 'analyzing' && (
                    <Button isLoading loadingText="AI đang chấm bài..." variant="primary" disabled>
                        Gửi đi phân tích
                    </Button>
                )}
                 {status === 'feedback' && (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Button onClick={handleTryAgain} variant="success">Luyện viết lại</Button>
                        <Button onClick={handleRestart} variant="primary">Viết đoạn văn khác</Button>
                    </div>
                )}
                 {status === 'error' && (
                    <div className="w-full max-w-md space-y-4">
                        <Card className="bg-danger-light text-danger-dark p-4">{error}</Card>
                        <Button onClick={handleTryAgain} variant="primary">Thử lại</Button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default WritingView;