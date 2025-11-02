// FIX: Import GenerateContentResponse to correctly type API responses.
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { QUIZ_LENGTH } from '../constants';
import { Question, ReadingAnalysis, QuizStats } from '../types';

// Lấy tất cả các khóa API từ biến môi trường và lọc ra những khóa hợp lệ.
// Trong môi trường này, các biến "Secrets" được truy cập qua process.env
const API_KEYS = [
  process.env.API_KEY,
  process.env.API_KEY_2,
  process.env.API_KEY_3

].filter((key) => typeof key === "string" && !!key.trim());

console.log("✅ Gemini API keys loaded:", API_KEYS.length);


if (API_KEYS.length === 0) {
    throw new Error("Chưa cấu hình khóa API cho Gemini. Vui lòng thêm ít nhất một khóa API (API_KEY, API_KEY_2, API_KEY_3) vào mục 'Secrets'.");
}

let currentKeyIndex = 0;

/**
 * Một hàm bao bọc (wrapper) để thực hiện các lệnh gọi đến Gemini API với logic thử lại và luân chuyển khóa.
 * @param request Một hàm nhận vào một instance của GoogleGenAI và trả về một promise chứa kết quả gọi API.
 * @returns Kết quả từ lệnh gọi API thành công.
 * @throws Ném ra lỗi nếu tất cả các khóa API đều thất bại.
 */
const callGeminiWithRetry = async <T>(
    request: (ai: GoogleGenAI) => Promise<T>
): Promise<T> => {
    const maxRetries = API_KEYS.length;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const apiKey = API_KEYS[currentKeyIndex];
        const ai = new GoogleGenAI({ apiKey });

        try {
            console.log(`Đang thử yêu cầu với khóa API #${currentKeyIndex + 1}`);
            const response = await request(ai);
            // Yêu cầu thành công, trả về kết quả.
            return response;
        } catch (error) {
            console.warn(`Khóa API #${currentKeyIndex + 1} thất bại.`, error);
            // Chuyển sang khóa tiếp theo để thử lại.
            currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;

            // Nếu đây là lần thử cuối cùng, ném ra lỗi.
            if (attempt === maxRetries - 1) {
                console.error("Tất cả các khóa API đều thất bại.");
                // Ném lại lỗi cuối cùng để hàm gọi có thể xử lý.
                throw error;
            }
        }
    }
    // Dòng này không nên đạt được nếu có ít nhất một khóa API, nhưng để đảm bảo an toàn.
    throw new Error("Tất cả các khóa API đều không hợp lệ hoặc đã xảy ra lỗi không xác định.");
};


export const generateQuiz = async (subjectName: string, topicName: string): Promise<{ passage: string | null; questions: Question[] }> => {
    try {
        let prompt = '';
        let responseSchema: any;
        let isReadingComprehension = topicName === 'Đọc hiểu đoạn văn ngắn';

        if (topicName === 'Luyện đọc') {
            prompt = `
                Bạn là một giáo viên tiểu học vui tính. Hãy tạo ra MỘT câu hỏi dạng ĐỌC THÀNH TIẾNG cho học sinh lớp 3 (8 tuổi).
                - Tạo một đoạn văn Tiếng Việt ngắn (khoảng 30-50 từ), nội dung trong sáng, vui vẻ, phù hợp với trẻ em.
                - Đoạn văn phải là đáp án đúng ('correctAnswer').
                - Lời giải thích ('explanation') có thể để trống.
                - Trả về kết quả dưới dạng một mảng JSON chứa một đối tượng duy nhất.
                - Đối tượng phải có 'type' là 'READ_ALOUD' và 'passage' chứa đoạn văn đã tạo.
            `;
            responseSchema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ['READ_ALOUD'] },
                        passage: { type: Type.STRING },
                        correctAnswer: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                    },
                    required: ["type", "passage", "correctAnswer", "explanation"],
                },
            };
        } else if (isReadingComprehension) {
             prompt = `
                Bạn là một giáo viên tiểu học. Hãy tạo một bài tập đọc hiểu cho học sinh lớp 3 (8 tuổi).
                Bài tập bao gồm:
                1.  Một đoạn văn Tiếng Việt ngắn (khoảng 50-70 từ) phù hợp với lứa tuổi, nội dung trong sáng, giáo dục.
                2.  ${QUIZ_LENGTH} câu hỏi trắc nghiệm (MULTIPLE_CHOICE) dựa trên nội dung của đoạn văn đó.
                
                Yêu cầu:
                - Mỗi câu hỏi phải có 'question', 'options' (mảng 4 chuỗi), 'correctAnswer', và 'explanation' (giải thích ngắn gọn, chỉ ra tại sao đáp án đó đúng dựa vào đoạn văn).
                - Toàn bộ nội dung BẮT BUỘC phải là Tiếng Việt.
                - Trả về kết quả dưới dạng một đối tượng JSON duy nhất có hai khóa: "passage" (chứa đoạn văn) và "questions" (chứa mảng ${QUIZ_LENGTH} câu hỏi).
            `;
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    passage: { type: Type.STRING },
                    questions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING, enum: ['MULTIPLE_CHOICE'] },
                                question: { type: Type.STRING },
                                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                correctAnswer: { type: Type.STRING },
                                explanation: { type: Type.STRING },
                            },
                             required: ["type", "question", "options", "correctAnswer", "explanation"],
                        },
                    },
                },
                required: ["passage", "questions"],
            };
        } else {
            prompt = `
                Bạn là một giáo viên tiểu học vui tính chuyên tạo ra các câu hỏi cho học sinh lớp 3 (8 tuổi). 
                Hãy tạo ra một bài kiểm tra gồm ${QUIZ_LENGTH} câu hỏi về chủ đề "${topicName}" thuộc môn học "${subjectName}".

                Bài kiểm tra phải bao gồm sự đa dạng các loại câu hỏi:
                - 4 câu hỏi trắc nghiệm (MULTIPLE_CHOICE).
                - 4 câu hỏi điền vào chỗ trống (FILL_IN_THE_BLANK).
                - 2 câu hỏi sắp xếp từ (REARRANGE_WORDS).

                Yêu cầu cho từng loại câu hỏi:
                1.  **MULTIPLE_CHOICE**: 'question', 'options' (mảng 4 chuỗi), 'correctAnswer'.
                2.  **FILL_IN_THE_BLANK**: 'questionParts' (mảng 2 chuỗi), 'correctAnswer'.
                3.  **REARRANGE_WORDS**: 'question', 'words' (mảng từ), 'correctAnswer'.

                Yêu cầu chung:
                - Ngôn ngữ đơn giản, phù hợp với trẻ 8 tuổi.
                - Cung cấp một lời giải thích ('explanation') ngắn gọn, dễ hiểu cho TẤT CẢ các câu hỏi. Lời giải thích phải chỉ ra cách đi đến đáp án đúng một cách logic, không chỉ lặp lại đáp án. Ví dụ, cho câu hỏi "600 - __ = 250", lời giải thích nên là "Để tìm số trừ, ta lấy số bị trừ (600) trừ đi hiệu (250), kết quả là 350."
                - Toàn bộ nội dung BẮT BUỘC phải là Tiếng Việt.
                - Trả về kết quả dưới dạng một mảng JSON. Mỗi đối tượng phải có 'type' là một trong ba giá trị: 'MULTIPLE_CHOICE', 'FILL_IN_THE_BLANK', hoặc 'REARRANGE_WORDS'.
            `;
            responseSchema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ['MULTIPLE_CHOICE', 'FILL_IN_THE_BLANK', 'REARRANGE_WORDS'] },
                        question: { type: Type.STRING, nullable: true },
                        options: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                        questionParts: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                        words: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                        correctAnswer: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                    },
                    required: ["type", "correctAnswer", "explanation"],
                },
            };
        }

// FIX: Explicitly type the API response to resolve 'Property 'text' does not exist on type 'unknown''.
        const response = await callGeminiWithRetry<GenerateContentResponse>((ai) => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                thinkingConfig: { thinkingBudget: 0 },
            },
        }));

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        if (isReadingComprehension) {
            if (data.passage && Array.isArray(data.questions)) {
                return { passage: data.passage, questions: data.questions as Question[] };
            }
        } else {
            if (Array.isArray(data) && data.length > 0) {
                 return { passage: null, questions: data as Question[] };
            }
        }

        throw new Error("Dữ liệu câu hỏi nhận được không hợp lệ.");

    } catch (error) {
        console.error("Lỗi khi tạo câu hỏi từ Gemini:", error);
        throw new Error("Không thể tạo câu hỏi vào lúc này. Vui lòng thử lại sau.");
    }
};

export const generateExam = async (subjectName: string, durationPreference: 'short' | 'medium' | 'long', userStats: QuizStats): Promise<{ timeLimitInSeconds: number; questions: Question[] }> => {
    try {
        const questionCountMapping = {
            short: 10,
            medium: 20,
            long: 40,
        };
        const numberOfQuestions = questionCountMapping[durationPreference];
        
        const prompt = `
            Bạn là một AI gia sư thông minh, đang tạo một bài thi thử cho học sinh lớp 3 (8 tuổi).
            Môn học: "${subjectName}".

            Yêu cầu chính:
            1. Tạo một bài thi gồm CHÍNH XÁC ${numberOfQuestions} câu hỏi.
            2. Nội dung thi phải bao quát TOÀN BỘ các chủ đề ôn tập của môn học.
            3. Quyết định một thời gian làm bài hợp lý (tính bằng giây) cho bài thi ${numberOfQuestions} câu hỏi này.

            Hướng dẫn thêm:
            - Đây là lịch sử học tập của học sinh: ${JSON.stringify(userStats)}. Hãy phân tích dữ liệu này để cá nhân hóa bài thi. Những chủ đề có tỷ lệ chính xác thấp hơn nên được ưu tiên trong các câu hỏi.
            - Tạo ra một bộ câu hỏi đa dạng (trắc nghiệm, điền vào chỗ trống, sắp xếp từ).
            - Toàn bộ nội dung BẮT BUỘC phải là Tiếng Việt.
            - Trả về kết quả dưới dạng một đối tượng JSON duy nhất có hai khóa: "timeLimitInSeconds" (một số nguyên) và "questions" (một mảng CHÍNH XÁC ${numberOfQuestions} đối tượng câu hỏi).
            - Mỗi đối tượng câu hỏi phải có 'type', 'correctAnswer', 'explanation' và các trường cần thiết khác. Lời giải thích phải chỉ ra cách đi đến đáp án đúng một cách logic, không chỉ lặp lại đáp án.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                timeLimitInSeconds: { type: Type.NUMBER },
                questions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ['MULTIPLE_CHOICE', 'FILL_IN_THE_BLANK', 'REARRANGE_WORDS'] },
                            question: { type: Type.STRING, nullable: true },
                            options: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                            questionParts: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                            words: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                            correctAnswer: { type: Type.STRING },
                            explanation: { type: Type.STRING },
                        },
                        required: ["type", "correctAnswer", "explanation"],
                    }
                }
            },
            required: ["timeLimitInSeconds", "questions"]
        };

// FIX: Explicitly type the API response to resolve 'Property 'text' does not exist on type 'unknown''.
        const response = await callGeminiWithRetry<GenerateContentResponse>((ai) => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                thinkingConfig: { thinkingBudget: 0 },
            },
        }));

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        if (data.timeLimitInSeconds && Array.isArray(data.questions)) {
            return data as { timeLimitInSeconds: number; questions: Question[] };
        }
        throw new Error("Dữ liệu bài thi nhận được không hợp lệ.");

    } catch (error) {
        console.error("Lỗi khi tạo bài thi từ Gemini:", error);
        throw new Error("Không thể tạo bài thi vào lúc này. Vui lòng thử lại sau.");
    }
};

export const analyzeReading = async (passage: string, audioBase64: string, mimeType: string): Promise<ReadingAnalysis> => {
    try {
        const audioPart = {
            inlineData: {
                mimeType: mimeType,
                data: audioBase64,
            },
        };

        const prompt = `
            Bạn là một giáo viên Tiếng Việt và chuyên gia trị liệu ngôn ngữ. Nhiệm vụ của bạn là phân tích bản ghi âm giọng đọc của một học sinh lớp 3 (8 tuổi) so với văn bản gốc.

            VĂN BẢN GỐC: "${passage}"

            Hãy phân tích file âm thanh được cung cấp và thực hiện các yêu cầu sau:
            1. Chuyển giọng nói trong âm thanh thành văn bản.
            2. So sánh văn bản được chuyển đổi với VĂN BẢN GỐC.
            3. Xác định các từ bị phát âm sai (ví dụ: "con sâu" thành "con xâu").
            4. Xác định các từ bị đọc không rõ ràng, lí nhí hoặc khó nghe.
            5. Tính toán tỷ lệ phần trăm chính xác dựa trên số từ đọc đúng so với tổng số từ trong văn bản gốc.
            6. Viết một lời nhận xét ngắn gọn (dưới 20 từ), mang tính xây dựng và động viên cho bé.

            QUAN TRỌNG: Trả về kết quả dưới dạng một đối tượng JSON duy nhất. KHÔNG trả về bất kỳ văn bản nào khác ngoài JSON.
        `;
        
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                accuracy: { type: Type.NUMBER },
                incorrectWords: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            expected: { type: Type.STRING },
                            actual: { type: Type.STRING }
                        },
                        required: ["expected", "actual"]
                    }
                },
                unclearWords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
                feedback: { type: Type.STRING }
            },
            required: ["accuracy", "incorrectWords", "unclearWords", "feedback"]
        };

// FIX: Explicitly type the API response to resolve 'Property 'text' does not exist on type 'unknown''.
        const response = await callGeminiWithRetry<GenerateContentResponse>((ai) => ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [{ text: prompt }, audioPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        }));

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ReadingAnalysis;

    } catch (error) {
        console.error("Lỗi khi phân tích giọng đọc từ Gemini:", error);
        throw new Error("AI không thể phân tích bài đọc vào lúc này. Vui lòng thử lại sau.");
    }
};