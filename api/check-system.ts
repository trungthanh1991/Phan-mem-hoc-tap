import { checkSystemHealth, ApiStatus } from '../services/geminiService';

/**
 * API Route để kiểm tra trạng thái sức khỏe của hệ thống và các API Key.
 * @returns Mảng các đối tượng chứa thông tin trạng thái của từng API Key.
 */
export async function POST(): Promise<ApiStatus[]> {
    return await checkSystemHealth();
}