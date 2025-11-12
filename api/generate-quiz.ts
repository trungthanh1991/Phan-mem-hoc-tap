import { generateQuiz } from '../services/geminiService';
import { Question } from '../types';

interface RequestPayload {
    subjectName: string;
    topicName: string;
    subTopicName?: string;
}

/**
 * API Route để tạo một bộ câu hỏi (quiz).
 * Đây là một lớp trung gian an toàn giữa client và Gemini API.
 * @param payload Dữ liệu từ client, bao gồm tên môn học và chủ đề.
 * @returns Một đối tượng chứa đoạn văn (nếu có) và mảng các câu hỏi.
 */
export async function POST(payload: RequestPayload): Promise<{ passage: string | null; questions: Question[] }> {
    const { subjectName, topicName, subTopicName } = payload;
    return await generateQuiz(subjectName, topicName, subTopicName);
}