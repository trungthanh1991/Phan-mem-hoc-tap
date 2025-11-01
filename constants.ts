

import { Subject, Topic, Badge } from './types';
import { MathIcon, VietnameseIcon, ScienceIcon, TrophyIcon, CheckCircleIcon, MedalIcon, MicrophoneIcon, ClockIcon } from './components/icons';

export const SUBJECTS: Subject[] = [
  {
    id: 'toan_hoc',
    name: 'Toán học',
    icon: MathIcon,
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600',
    textColor: 'text-white',
    lightBgColor: 'bg-blue-100',
    borderColor: 'border-blue-500',
    baseColor: 'bg-blue-500',
  },
  {
    id: 'tieng_viet',
    name: 'Tiếng Việt',
    icon: VietnameseIcon,
    gradientFrom: 'from-red-500',
    gradientTo: 'to-red-600',
    textColor: 'text-white',
    lightBgColor: 'bg-red-100',
    borderColor: 'border-red-500',
    baseColor: 'bg-red-500',
  },
  {
    id: 'tu_nhien_xa_hoi',
    name: 'Tự nhiên & Xã hội',
    icon: ScienceIcon,
    gradientFrom: 'from-green-500',
    gradientTo: 'to-green-600',
    textColor: 'text-white',
    lightBgColor: 'bg-green-100',
    borderColor: 'border-green-500',
    baseColor: 'bg-green-500',
  },
];


export const TOPICS: Record<string, Topic[]> = {
  toan_hoc: [
    { id: 'phep_cong_tru_1000', name: 'Cộng trừ trong phạm vi 1000' },
    { id: 'phep_nhan_chia_bang_2_5', name: 'Nhân chia trong bảng 2-5' },
    { id: 'hinh_hoc_co_ban', name: 'Hình học cơ bản' },
    { id: 'xem_dong_ho', name: 'Xem đồng hồ' },
    { id: 'giai_toan_loi_van', name: 'Giải toán có lời văn' },
    { id: 'do_dai_do_luong', name: 'Đo lường (mét, gam)' },
    { id: 'so_sanh', name: 'So sánh (lớn hơn, nhỏ hơn, bằng)' },
  ],
  tieng_viet: [
    { id: 'tu_chi_su_vat', name: 'Từ chỉ sự vật' },
    { id: 'cau_ai_la_gi', name: 'Câu "Ai là gì?"' },
    { id: 'doc_hieu_doan_van', name: 'Đọc hiểu đoạn văn ngắn' },
    { id: 'doc_doan_van', name: 'Luyện Đọc Cùng AI' },
  ],
  tu_nhien_xa_hoi: [
    { id: 'cay_xanh', name: 'Cây xanh quanh em' },
    { id: 'dong_vat', name: 'Các loài động vật' },
    { id: 'an_toan_giao_thong', name: 'An toàn giao thông' },
  ],
};

export const QUIZ_LENGTH = 5;

export const BADGES: Badge[] = [
  {
    id: 'first_quiz',
    name: 'Khởi Đầu Vững Chắc',
    description: 'Hoàn thành bài kiểm tra đầu tiên.',
    icon: TrophyIcon,
  },
  {
    id: 'perfect_score',
    name: 'Chuyên Gia Hoàn Hảo',
    description: 'Đạt điểm tuyệt đối trong một bài kiểm tra.',
    icon: CheckCircleIcon,
  },
  {
    id: 'perfectionist',
    name: 'Người Cầu Toàn',
    description: 'Đạt điểm tuyệt đối 3 lần.',
    icon: CheckCircleIcon,
  },
  {
    id: 'math_whiz',
    name: 'Thiên Tài Toán Học',
    description: 'Đạt điểm tuyệt đối trong môn Toán.',
    icon: MathIcon,
  },
  {
    id: 'language_lover',
    name: 'Trạng Nguyên Tiếng Việt',
    description: 'Đạt điểm tuyệt đối trong môn Tiếng Việt.',
    icon: VietnameseIcon,
  },
  {
    id: 'science_sleuth',
    name: 'Nhà Khoa Học Nhí',
    description: 'Đạt điểm tuyệt đối trong môn Tự nhiên & Xã hội.',
    icon: ScienceIcon,
  },
  {
    id: 'marathon_runner',
    name: 'Người Chạy Marathon',
    description: 'Hoàn thành 10 bài kiểm tra.',
    icon: MedalIcon,
  },
  {
    id: 'subject_master',
    name: 'Bậc Thầy Môn Học',
    description: 'Hoàn thành tất cả chủ đề trong một môn học.',
    icon: TrophyIcon,
  },
  {
    id: 'reading_rockstar',
    name: 'Ngôi Sao Đọc Sách',
    description: 'Đạt 95% chính xác trong phần Luyện Đọc.',
    icon: MicrophoneIcon,
  },
  {
    id: 'brave_challenger',
    name: 'Thử Thách Dũng Cảm',
    description: 'Tham gia một bài thi thử Dài.',
    icon: ClockIcon,
  },
];