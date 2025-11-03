import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { QUIZ_LENGTH } from '../constants';
import { Question, ReadingAnalysis, WritingAnalysis } from '../types';

export const generateQuiz = async (subjectName: string, topicName: string): Promise<{ passage: string | null; questions: Question[] }> => {
    try {
        const apiKey = import.meta.env.VITE_API_KEY;
        if (!apiKey) {
            throw new Error("Chưa cấu hình khóa API cho Gemini. Vui lòng đảm bảo biến môi trường API_KEY đã được thiết lập.");
        }
        const ai = new GoogleGenAI({ apiKey });

        let prompt = '';
        let responseSchema: any;
        let isReadingComprehension = topicName === 'Đọc hiểu đoạn văn ngắn';

        if (topicName === 'Luyện đọc' || topicName === 'Luyện viết') {
             const activityType = topicName === 'Luyện đọc' ? 'READ_ALOUD' : 'WRITE_PASSAGE';
             const passageLength = topicName === 'Luyện đọc' ? '30-50' : '10';

             prompt = `
                Bạn là một giáo viên tiểu học vui tính. Hãy tạo ra MỘT câu hỏi dạng ${activityType} cho học sinh lớp 3 (8 tuổi).
                - Tạo một đoạn văn Tiếng Việt ngắn (khoảng ${passageLength} chữ), nội dung trong sáng, vui vẻ, phù hợp với trẻ em.
                - Đoạn văn phải là đáp án đúng ('correctAnswer').
                - Lời giải thích ('explanation') có thể để trống.
                - Trả về kết quả dưới dạng một mảng JSON chứa một đối tượng duy nhất.
                - Đối tượng phải có 'type' là '${activityType}' và 'passage' chứa đoạn văn đã tạo.
            `;
            responseSchema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: [activityType] },
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
                3.  **REARRANGE_WORDS**: 'question', 'words' (mảng từ), 'correctAnswer'. Câu được tạo ra phải là một câu đơn giản, có ý nghĩa, dài từ 5 đến 8 từ. Mảng 'words' chỉ chứa các từ của câu đó và đã được xáo trộn. KHÔNG bao gồm dấu câu (như '.', '?', '!') dưới dạng các từ riêng lẻ trong mảng 'words'. Đáp án đúng 'correctAnswer' phải bao gồm dấu câu ở cuối. ĐẶC BIỆT: Nếu câu là một phép tính toán học (ví dụ: "15 + 5 = 20"), thì các toán tử (+, -, x, :) và dấu bằng (=) PHẢI được coi là các "từ" riêng biệt trong mảng 'words'.

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

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                thinkingConfig: { thinkingBudget: 0 },
            },
        });

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

export const generateExam = async (subjectName: string, durationPreference: 'short' | 'medium' | 'long'): Promise<{ timeLimitInSeconds: number; questions: Question[] }> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("Chưa cấu hình khóa API cho Gemini. Vui lòng đảm bảo biến môi trường API_KEY đã được thiết lập.");
        }
        const ai = new GoogleGenAI({ apiKey });

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
            1. Tạo một bài thi gồm CHÍNH XÁC ${numberOfQuestions} câu hỏi. Số lượng câu hỏi phải là ${numberOfQuestions}, KHÔNG được ít hơn hay nhiều hơn.
            2. Nội dung thi phải bao quát TOÀN BỘ các chủ đề ôn tập của môn học.
            3. Quyết định một thời gian làm bài hợp lý (tính bằng giây) cho bài thi ${numberOfQuestions} câu hỏi này.

            Hướng dẫn thêm:
            - Tạo ra một bộ câu hỏi đa dạng (trắc nghiệm, điền vào chỗ trống, sắp xếp từ), phân bổ đều qua các chủ đề của môn học.
            - Toàn bộ nội dung BẮT BUỘC phải là Tiếng Việt.
            - Trả về kết quả dưới dạng một đối tượng JSON duy nhất có hai khóa: "timeLimitInSeconds" (một số nguyên) và "questions" (một mảng chứa CHÍNH XÁC ${numberOfQuestions} đối tượng câu hỏi).
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

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                thinkingConfig: { thinkingBudget: 0 },
            },
        });

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
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("Chưa cấu hình khóa API cho Gemini. Vui lòng đảm bảo biến môi trường API_KEY đã được thiết lập.");
        }
        const ai = new GoogleGenAI({ apiKey });

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

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [{ text: prompt }, audioPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ReadingAnalysis;

    } catch (error) {
        console.error("Lỗi khi phân tích giọng đọc từ Gemini:", error);
        throw new Error("AI không thể phân tích bài đọc vào lúc này. Vui lòng thử lại sau.");
    }
};


export const analyzeHandwriting = async (passage: string, imageBase64: string): Promise<WritingAnalysis> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("Chưa cấu hình khóa API cho Gemini. Vui lòng đảm bảo biến môi trường API_KEY đã được thiết lập.");
        }
        const ai = new GoogleGenAI({ apiKey });

        const imagePart = {
            inlineData: {
                mimeType: 'image/png',
                data: imageBase64,
            },
        };

        const prompt = `
            Bạn là một giáo viên tiểu học kinh nghiệm, chuyên chấm bài tập viết cho học sinh lớp 3 (8 tuổi).
            Nhiệm vụ của bạn là phân tích hình ảnh chữ viết tay của một học sinh so với văn bản gốc.

            VĂN BẢN GỐC: "${passage}"

            Phân tích hình ảnh chữ viết tay được cung cấp. Hãy thực hiện các bước sau:
            1.  **Nhận dạng ký tự (OCR):** Đọc và chuyển đổi chữ viết tay trong ảnh thành văn bản.
            2.  **Kiểm tra độ đầy đủ:** So sánh văn bản nhận dạng được với VĂN BẢN GỐC để xem bé đã viết đủ tất cả các chữ chưa. Cho điểm **completenessScore** (thang 100) dựa trên tỷ lệ phần trăm số chữ viết đúng và đủ so với câu gốc.
            3.  **Đánh giá chất lượng chữ viết:** Đánh giá dựa trên các tiêu chí sau và cho điểm trên thang 100:
                *   **Độ dễ đọc (legibilityScore):** Chữ viết có rõ ràng, dễ nhận biết không?
                *   **Độ ngay ngắn (neatnessScore):** Các con chữ có gọn gàng, thẳng hàng, đúng dòng kẻ không?
                *   **Độ đúng chuẩn (correctnessScore):** Nét chữ có đúng chuẩn (chiều cao, độ rộng), dấu câu, dấu thanh có đặt đúng vị trí không?
            4.  **Đưa ra nhận xét:**
                *   **Lời khen (positiveFeedback):** Viết MỘT câu khen ngợi ngắn gọn, cụ thể và chân thành về điểm tốt nhất trong bài viết của bé (khoảng 10-15 từ).
                *   **Góp ý (constructiveSuggestion):** Đưa ra MỘT lời khuyên nhẹ nhàng, cụ thể để bé có thể cải thiện ở lần viết sau (khoảng 10-15 từ). Nếu bé viết thiếu chữ, hãy nhẹ nhàng nhắc nhở trong phần này.

            Yêu cầu:
            - Lời lẽ phải tích cực, động viên, phù hợp với tâm lý trẻ nhỏ.
            - Trả về kết quả dưới dạng một đối tượng JSON duy nhất. KHÔNG trả về bất kỳ văn bản nào khác ngoài JSON.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                legibilityScore: { type: Type.NUMBER },
                neatnessScore: { type: Type.NUMBER },
                correctnessScore: { type: Type.NUMBER },
                completenessScore: { type: Type.NUMBER },
                positiveFeedback: { type: Type.STRING },
                constructiveSuggestion: { type: Type.STRING },
            },
            required: ["legibilityScore", "neatnessScore", "correctnessScore", "completenessScore", "positiveFeedback", "constructiveSuggestion"]
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [{ text: prompt }, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as WritingAnalysis;

    } catch (error) {
        console.error("Lỗi khi phân tích chữ viết tay từ Gemini:", error);
        throw new Error("AI không thể phân tích bài viết vào lúc này. Vui lòng thử lại sau.");
    }
};