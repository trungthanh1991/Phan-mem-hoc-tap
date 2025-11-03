import { generateExam } from '../services/geminiService';
import { Question } from '../types';

interface RequestPayload {
    subjectName: string;
    durationPreference: 'short' | 'medium' | 'long';
}

/**
 * API Route để tạo một bài thi thử.
 * Đây là một lớp trung gian an toàn giữa client và Gemini API.
 * @param payload Dữ liệu từ client, bao gồm tên môn học và độ dài bài thi.
 * @returns Một đối tượng chứa thời gian giới hạn và mảng các câu hỏi.
 */
export async function POST(payload: RequestPayload): Promise<{ timeLimitInSeconds: number; questions: Question[] }> {
    const { subjectName, durationPreference } = payload;
    return await generateExam(subjectName, durationPreference);
}
