import { analyzeHandwriting } from '../services/geminiService';
import { WritingAnalysis } from '../types';

interface RequestPayload {
    passage: string;
    imageBase64: string;
}

/**
 * API Route để phân tích chữ viết tay của người dùng.
 * Đây là một lớp trung gian an toàn giữa client và Gemini API.
 * @param payload Dữ liệu từ client, bao gồm đoạn văn gốc và dữ liệu hình ảnh.
 * @returns Kết quả phân tích chữ viết tay từ AI.
 */
export async function POST(payload: RequestPayload): Promise<WritingAnalysis> {
    const { passage, imageBase64 } = payload;
    return await analyzeHandwriting(passage, imageBase64);
}
