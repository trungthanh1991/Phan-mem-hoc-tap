import { analyzeReading } from '../services/geminiService';
import { ReadingAnalysis } from '../types';

interface RequestPayload {
    passage: string;
    audioBase64: string;
    mimeType: string;
}

/**
 * API Route để phân tích giọng đọc của người dùng.
 * Đây là một lớp trung gian an toàn giữa client và Gemini API.
 * @param payload Dữ liệu từ client, bao gồm đoạn văn gốc và dữ liệu audio.
 * @returns Kết quả phân tích giọng đọc từ AI.
 */
export async function POST(payload: RequestPayload): Promise<ReadingAnalysis> {
    const { passage, audioBase64, mimeType } = payload;
    return await analyzeReading(passage, audioBase64, mimeType);
}
