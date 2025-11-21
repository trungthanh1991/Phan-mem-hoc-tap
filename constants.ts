
import { Subject, Topic, Badge, SubTopic, ShopItem } from './types';
import {
  MathIcon, VietnameseIcon, ScienceIcon, TrophyIcon, CheckCircleIcon, MedalIcon, MicrophoneIcon, ClockIcon, StarIcon, BrainIcon, GraduationCapIcon, CrownIcon, TargetIcon, GlobeIcon, ShapesIcon, BookOpenIcon, LeafIcon, PawIcon, RepeatIcon, DocumentCheckIcon, LightbulbIcon, RulerIcon, ScaleIcon, MultiplyIcon, PlusIcon, TrophyStarIcon, DiamondIcon, RocketLaunchIcon, ShieldCheckIcon, PuzzlePieceIcon, FireIcon, BoltIcon, CalendarDaysIcon, SunIcon, MoonIcon, ArrowUpCircleIcon, HeartIcon, PencilIcon, EnglishIcon
} from './components/icons';

export const SUBJECTS: Subject[] = [
  {
    id: 'toan_hoc',
    name: 'Toán học',
    icon: MathIcon,
    backgroundImage: '/bg_math.png',
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
  {
    id: 'tieng_anh',
    name: 'Tiếng Anh',
    icon: EnglishIcon,
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600',
    textColor: 'text-white',
    lightBgColor: 'bg-purple-100',
    borderColor: 'border-purple-500',
    baseColor: 'bg-purple-500',
  },
];


export const TOPICS: Record<string, Topic[]> = {
  toan_hoc: [
    { id: 'phep_cong_tru_1000', name: 'Cộng trừ trong phạm vi 1000' },
    { id: 'phep_nhan_chia_bang_2_10', name: 'Nhân chia trong bảng 2-10' },
    { id: 'hinh_hoc_co_ban', name: 'Hình học cơ bản' },
    { id: 'xem_dong_ho', name: 'Xem đồng hồ' },
    { id: 'giai_toan_loi_van', name: 'Giải toán có lời văn' },
    { id: 'do_dai_do_luong', name: 'Đo lường (mét, gam)' },
    { id: 'so_sanh', name: 'So sánh (lớn hơn, nhỏ hơn, bằng)' },
  ],
  tieng_viet: [
    { id: 'tu_vung', name: 'Từ vựng' },
    { id: 'dien_tu', name: 'Điền từ' },
    { id: 'sap_xep_cau', name: 'Sắp xếp câu' },
    { id: 'doc_hieu_doan_van', name: 'Đọc hiểu đoạn văn ngắn' },
    { id: 'doc_doan_van', name: 'Luyện đọc' },
    { id: 'nghe_doc', name: 'Nghe đọc' },
    { id: 'luyen_viet', name: 'Luyện viết' },
  ],
  tu_nhien_xa_hoi: [
    { id: 'cay_xanh', name: 'Cây xanh quanh em' },
    { id: 'dong_vat', name: 'Các loài động vật' },
    { id: 'an_toan_giao_thong', name: 'An toàn giao thông' },
  ],
  tieng_anh: [
    { id: 'tu_vung_en', name: 'Từ vựng' },
    { id: 'dien_tu_en', name: 'Điền từ' },
    { id: 'sap_xep_cau_en', name: 'Sắp xếp câu' },
    { id: 'doc_doan_van_en', name: 'Luyện đọc' },
    { id: 'tap_doc_en', name: 'Tập đọc' },
    { id: 'nghe_doc_en', name: 'Nghe đọc' },
  ],
};

export const ENGLISH_READING_SUBTOPICS: SubTopic[] = [
  { id: 'school_objects', name: 'School Objects — Đồ dùng học tập' },
  { id: 'classroom_items', name: 'Classroom Items — Vật dụng trong lớp học' },
  { id: 'household_items', name: 'Household Items — Đồ vật trong gia đình' },
  { id: 'personal_items', name: 'Personal Items — Đồ dùng cá nhân' },
  { id: 'toys', name: 'Toys — Đồ chơi' },
  { id: 'animals', name: 'Animals — Động vật' },
  { id: 'colors', name: 'Colors — Màu sắc' },
  { id: 'numbers', name: 'Numbers — Các con số' },
  { id: 'shapes', name: 'Shapes — Hình dạng' },
  { id: 'food_drinks', name: 'Food & Drinks — Thức ăn và đồ uống' },
  { id: 'fruits', name: 'Fruits — Trái cây' },
  { id: 'vegetables', name: 'Vegetables — Rau củ' },
  { id: 'clothes', name: 'Clothes — Quần áo' },
  { id: 'weather', name: 'Weather — Thời tiết' },
  { id: 'family_members', name: 'Family Members — Các thành viên trong gia đình' },
  { id: 'body_parts', name: 'Body Parts — Các bộ phận cơ thể' },
  { id: 'actions_verbs', name: 'Actions (Verbs) — Hành động' },
  { id: 'places', name: 'Places — Địa điểm' },
  { id: 'transportation', name: 'Transportation — Phương tiện giao thông' },
  { id: 'daily_activities', name: 'Daily Activities — Hoạt động hằng ngày' },
  { id: 'nature', name: 'Nature — Thiên nhiên' },
  { id: 'festivals_holidays', name: 'Festivals & Holidays — Lễ hội & ngày lễ' },
  { id: 'opposites', name: 'Opposites — Từ trái nghĩa' },
  { id: 'adjectives_basic', name: 'Adjectives (Basic) — Tính từ cơ bản' },
  { id: 'community_helpers', name: 'Community Helpers — Nghề nghiệp' },
];

export const QUIZ_LENGTH = 10;

export const BADGES: Badge[] = [
  // Cột 1: Huy hiệu cơ bản & Cột mốc
  { id: 'first_quiz', name: 'Khởi Đầu Vững Chắc', description: 'Hoàn thành bài kiểm tra đầu tiên.', icon: TrophyIcon },
  { id: 'perfect_score', name: 'Chuyên Gia Hoàn Hảo', description: 'Đạt điểm tuyệt đối trong một bài kiểm tra.', icon: CheckCircleIcon },
  { id: 'marathon_runner', name: 'Người Chạy Marathon', description: 'Hoàn thành 10 bài kiểm tra.', icon: MedalIcon },
  { id: 'quiz_pro_25', name: 'Chuyên Gia Câu Đố', description: 'Hoàn thành 25 bài kiểm tra.', icon: MedalIcon },
  { id: 'quiz_master_50', name: 'Bậc Thầy Câu Đố', description: 'Hoàn thành 50 bài kiểm tra.', icon: GraduationCapIcon },
  { id: 'quiz_legend_100', name: 'Huyền Thoại Câu Đố', description: 'Hoàn thành 100 bài kiểm tra.', icon: CrownIcon },
  { id: 'brave_challenger', name: 'Thử Thách Dũng Cảm', description: 'Tham gia một bài thi thử Dài.', icon: ClockIcon },
  { id: 'grand_master_20', name: 'Đại Kiện Tướng', description: 'Thu thập 20 huy hiệu.', icon: TrophyStarIcon },
  { id: 'ultimate_achiever', name: 'Nhà Vô Địch', description: 'Thu thập tất cả 140 huy hiệu.', icon: DiamondIcon },

  // Cột 2: Huy hiệu về sự hoàn hảo
  { id: 'perfectionist', name: 'Người Cầu Toàn', description: 'Đạt điểm tuyệt đối 3 lần.', icon: StarIcon },
  { id: 'perfect_score_5', name: 'Ngôi Sao Sáng', description: 'Đạt điểm tuyệt đối 5 lần.', icon: StarIcon },
  { id: 'perfect_score_10', name: 'Siêu Sao Hoàn Hảo', description: 'Đạt điểm tuyệt đối 10 lần.', icon: StarIcon },
  { id: 'correct_100', name: 'Trí Tuệ Siêu Việt', description: 'Trả lời đúng 100 câu hỏi.', icon: TargetIcon },
  { id: 'correct_500', name: 'Trí Tuệ Thông Thái', description: 'Trả lời đúng 500 câu hỏi.', icon: TargetIcon },

  // Cột 3: Huy hiệu Chuyên môn & Khám phá
  { id: 'math_whiz', name: 'Thiên Tài Toán Học', description: 'Đạt điểm tuyệt đối trong môn Toán.', icon: MathIcon },
  { id: 'language_lover', name: 'Trạng Nguyên Tiếng Việt', description: 'Đạt điểm tuyệt đối trong môn Tiếng Việt.', icon: VietnameseIcon },
  { id: 'science_sleuth', name: 'Nhà Khoa Học Nhí', description: 'Đạt điểm tuyệt đối trong môn Tự nhiên & Xã hội.', icon: ScienceIcon },
  { id: 'english_explorer', name: 'Nhà Thám Hiểm Anh Ngữ', description: 'Đạt điểm tuyệt đối trong môn Tiếng Anh.', icon: EnglishIcon },
  { id: 'subject_master', name: 'Bậc Thầy Môn Học', description: 'Hoàn thành tất cả chủ đề trong một môn học.', icon: TrophyIcon },
  { id: 'curious_mind', name: 'Trí Tuệ Tò Mò', description: 'Thử ít nhất một chủ đề trong mỗi môn học.', icon: GlobeIcon },
  { id: 'all_rounder', name: 'Học Giả Toàn Năng', description: 'Đạt điểm tuyệt đối trong tất cả các môn học.', icon: BrainIcon },
  { id: 'reading_rockstar', name: 'Ngôi Sao Đọc Sách', description: 'Đạt 95% chính xác trong phần Luyện Đọc.', icon: MicrophoneIcon },
  { id: 'persistent_player_5', name: 'Chuyên Gia Bền Bỉ', description: 'Hoàn thành một chủ đề 5 lần.', icon: RepeatIcon },
  { id: 'exam_ace_medium', name: 'Chiến Binh Thi Cử', description: 'Đạt trên 80% trong bài thi thử Trung bình.', icon: DocumentCheckIcon },
  { id: 'exam_ace_long', name: 'Đại Cao Thủ Thi Cử', description: 'Đạt trên 80% trong bài thi thử Dài.', icon: DocumentCheckIcon },

  // Cột 4: Huy hiệu theo chủ đề
  // Toán
  { id: 'addition_ace', name: 'Cao Thủ Phép Cộng', description: 'Đạt điểm tuyệt đối chủ đề Cộng trừ.', icon: PlusIcon },
  { id: 'multiplication_master', name: 'Vua Bảng Cửu Chương', description: 'Đạt điểm tuyệt đối chủ đề Nhân chia.', icon: MultiplyIcon },
  { id: 'geometry_genius', name: 'Thiên Tài Hình Học', description: 'Đạt điểm tuyệt đối chủ đề Hình học.', icon: ShapesIcon },
  { id: 'time_teller', name: 'Người Giữ Thời Gian', description: 'Đạt điểm tuyệt đối chủ đề Xem đồng hồ.', icon: ClockIcon },
  { id: 'word_problem_whiz', name: 'Chuyên Gia Toán Đố', description: 'Đạt điểm tuyệt đối chủ đề Giải toán có lời văn.', icon: LightbulbIcon },
  { id: 'measurement_maven', name: 'Tinh Thông Đo Lường', description: 'Đạt điểm tuyệt đối chủ đề Đo lường.', icon: RulerIcon },
  { id: 'comparison_champ', name: 'Vua So Sánh', description: 'Đạt điểm tuyệt đối chủ đề So sánh.', icon: ScaleIcon },

  // Tiếng Việt
  { id: 'word_wizard', name: 'Phù Thủy Từ Ngữ', description: 'Đạt điểm tuyệt đối chủ đề Từ vựng.', icon: VietnameseIcon },
  { id: 'sentence_superstar', name: 'Siêu Sao Đặt Câu', description: 'Đạt điểm tuyệt đối chủ đề Điền từ.', icon: StarIcon },
  { id: 'reading_champion', name: 'Vô Địch Đọc Hiểu', description: 'Đạt điểm tuyệt đối chủ đề Đọc hiểu.', icon: BookOpenIcon },

  // Tự nhiên & Xã hội
  { id: 'botanist_buddy', name: 'Bạn Của Thực Vật', description: 'Đạt điểm tuyệt đối chủ đề Cây xanh.', icon: LeafIcon },
  { id: 'animal_expert', name: 'Chuyên Gia Động Vật', description: 'Đạt điểm tuyệt đối chủ đề Động vật.', icon: PawIcon },
  { id: 'safety_squad', name: 'Biệt Đội An Toàn', description: 'Đạt điểm tuyệt đối chủ đề An toàn giao thông.', icon: ScienceIcon },

  // ===================================================================================
  // == HUY HIỆU MỞ RỘNG (100+) ==
  // ===================================================================================

  // I. Cột Mốc Vĩ Đại (20 huy hiệu)
  { id: 'quiz_pro_75', name: 'Nhà Thám Hiểm', description: 'Hoàn thành 75 bài kiểm tra.', icon: MedalIcon },
  { id: 'quiz_master_150', name: 'Bậc Thầy Toàn Năng', description: 'Hoàn thành 150 bài kiểm tra.', icon: GraduationCapIcon },
  { id: 'quiz_legend_200', name: 'Huyền Thoại Sống', description: 'Hoàn thành 200 bài kiểm tra.', icon: CrownIcon },
  { id: 'quiz_titan_300', name: 'Titan Tri Thức', description: 'Hoàn thành 300 bài kiểm tra.', icon: RocketLaunchIcon },
  { id: 'quiz_demigod_500', name: 'Á Thần Học Tập', description: 'Hoàn thành 500 bài kiểm tra.', icon: DiamondIcon },

  { id: 'correct_1000', name: 'Bộ Óc Vĩ Đại', description: 'Trả lời đúng 1,000 câu hỏi.', icon: TargetIcon },
  { id: 'correct_2500', name: 'Kho Tàng Tri Thức', description: 'Trả lời đúng 2,500 câu hỏi.', icon: BrainIcon },
  { id: 'correct_5000', name: 'Nhà Thông Thái Vũ Trụ', description: 'Trả lời đúng 5,000 câu hỏi.', icon: GlobeIcon },

  { id: 'collector_40', name: 'Nhà Sưu Tầm Tinh Anh', description: 'Thu thập 40 huy hiệu.', icon: TrophyStarIcon },
  { id: 'collector_60', name: 'Thợ Săn Thành Tích', description: 'Thu thập 60 huy hiệu.', icon: TrophyStarIcon },
  { id: 'collector_80', name: 'Bậc Thầy Sưu Tầm', description: 'Thu thập 80 huy hiệu.', icon: TrophyStarIcon },
  { id: 'collector_100', name: 'Huyền Thoại Sưu Tầm', description: 'Thu thập 100 huy hiệu.', icon: CrownIcon },
  { id: 'collector_120', name: 'Bảo Tàng Thành Tích', description: 'Thu thập 120 huy hiệu.', icon: DiamondIcon },

  { id: 'mcq_master_100', name: 'Vua Trắc Nghiệm', description: 'Trả lời đúng 100 câu trắc nghiệm.', icon: PuzzlePieceIcon },
  { id: 'mcq_master_500', name: 'Thần Đồng Trắc Nghiệm', description: 'Trả lời đúng 500 câu trắc nghiệm.', icon: PuzzlePieceIcon },
  { id: 'fill_in_pro_100', name: 'Chuyên Gia Điền Từ', description: 'Trả lời đúng 100 câu điền từ.', icon: LightbulbIcon },
  { id: 'fill_in_pro_500', name: 'Bậc Thầy Điền Từ', description: 'Trả lời đúng 500 câu điền từ.', icon: LightbulbIcon },
  { id: 'rearrange_ace_50', name: 'Nhà Sắp Xếp Tài Ba', description: 'Trả lời đúng 50 câu sắp xếp từ.', icon: ShapesIcon },
  { id: 'rearrange_ace_250', name: 'Kiến Trúc Sư Ngôn Từ', description: 'Trả lời đúng 250 câu sắp xếp từ.', icon: ShapesIcon },
  { id: 'reading_adept', name: 'Mọt Sách Chăm Chỉ', description: 'Hoàn thành 10 bài luyện đọc.', icon: BookOpenIcon },

  // II. Sự Hoàn Hảo & Tốc Độ (15 huy hiệu)
  { id: 'perfect_score_15', name: 'Ngôi Sao Hy Vọng', description: 'Đạt điểm tuyệt đối 15 lần.', icon: StarIcon },
  { id: 'perfect_score_25', name: 'Thiên Hà Lấp Lánh', description: 'Đạt điểm tuyệt đối 25 lần.', icon: StarIcon },
  { id: 'perfect_score_50', name: 'Vũ Trụ Hoàn Hảo', description: 'Đạt điểm tuyệt đối 50 lần.', icon: StarIcon },

  { id: 'perfect_streak_3', name: 'Chuỗi Hoàn Hảo', description: 'Đạt điểm tuyệt đối 3 lần liên tiếp.', icon: FireIcon },
  { id: 'perfect_streak_5', name: 'Ngọn Lửa Bất Diệt', description: 'Đạt điểm tuyệt đối 5 lần liên tiếp.', icon: FireIcon },

  { id: 'quick_thinker', name: 'Tư Duy Nhanh Nhẹn', description: 'Hoàn thành bài quiz với TB dưới 20 giây/câu.', icon: ClockIcon },
  { id: 'lightning_fast', name: 'Tia Chớp Trí Tuệ', description: 'Trả lời đúng 1 câu trong vòng 5 giây.', icon: BoltIcon },
  { id: 'beat_the_clock', name: 'Bậc Thầy Thời Gian', description: 'Đạt điểm cao bài thi Dài (còn dư trên 5 phút).', icon: ClockIcon },

  { id: 'exam_ace_short', name: 'Chinh Phục Thử Thách Ngắn', description: 'Đạt trên 80% trong bài thi thử Ngắn.', icon: DocumentCheckIcon },
  { id: 'exam_perfect_short', name: 'Tuyệt Đối Hoàn Hảo (Ngắn)', description: 'Đạt điểm tuyệt đối trong bài thi thử Ngắn.', icon: ShieldCheckIcon },
  { id: 'exam_perfect_medium', name: 'Tuyệt Đối Hoàn Hảo (Vừa)', description: 'Đạt điểm tuyệt đối trong bài thi thử Trung bình.', icon: ShieldCheckIcon },
  { id: 'exam_perfect_long', name: 'Tuyệt Đối Hoàn Hảo (Dài)', description: 'Đạt điểm tuyệt đối trong bài thi thử Dài.', icon: ShieldCheckIcon },
  { id: 'exam_trifecta', name: 'Nhà Vô Địch Thi Cử', description: 'Hoàn thành cả 3 loại bài thi.', icon: GraduationCapIcon },

  { id: 'reading_virtuoso', name: 'Giọng Đọc Vàng', description: 'Đạt 98% chính xác trong Luyện Đọc.', icon: MicrophoneIcon },
  { id: 'reading_legend', name: 'Bậc Thầy Phát Âm', description: 'Đạt 100% chính xác trong Luyện Đọc.', icon: MicrophoneIcon },

  // III. Chuyên Cần & Bền Bỉ (20 huy hiệu)
  { id: 'comeback_kid', name: 'Cú Lội Ngược Dòng', description: 'Thử lại chủ đề từng dưới 50% và đạt trên 80%.', icon: ArrowUpCircleIcon },
  { id: 'determined_learner', name: 'Nỗ Lực Phi Thường', description: 'Thử lại chủ đề từng thất bại và đạt điểm tuyệt đối.', icon: HeartIcon },
  { id: 'specialist', name: 'Nhà Nghiên Cứu Chuyên Sâu', description: 'Chơi cùng một chủ đề 3 lần liên tiếp.', icon: RepeatIcon },

  { id: 'math_marathon', name: 'Marathon Toán Học', description: 'Hoàn thành 5 bài quiz Toán trong một ngày.', icon: MathIcon },
  { id: 'vietnamese_voyage', name: 'Hành Trình Tiếng Việt', description: 'Hoàn thành 5 bài quiz Tiếng Việt trong một ngày.', icon: VietnameseIcon },
  { id: 'science_spree', name: 'Khám Phá Khoa Học', description: 'Hoàn thành 5 bài quiz Tự nhiên & Xã hội trong một ngày.', icon: ScienceIcon },

  { id: 'daily_streak_3', name: 'Học Tập Mỗi Ngày', description: 'Chơi 3 ngày liên tiếp.', icon: CalendarDaysIcon },
  { id: 'daily_streak_7', name: 'Một Tuần Chăm Chỉ', description: 'Chơi 7 ngày liên tiếp.', icon: CalendarDaysIcon },
  { id: 'daily_streak_14', name: 'Hai Tuần Bền Bỉ', description: 'Chơi 14 ngày liên tiếp.', icon: CalendarDaysIcon },
  { id: 'daily_streak_30', name: 'Thói Quen Vàng', description: 'Chơi 30 ngày liên tiếp.', icon: CalendarDaysIcon },

  { id: 'loyal_learner', name: 'Học Viên Trung Thành', description: 'Tổng số ngày chơi đạt 30 ngày.', icon: HeartIcon },
  { id: 'early_bird', name: 'Chú Chim Sâu Siêng Năng', description: 'Hoàn thành bài quiz trước 7 giờ sáng.', icon: SunIcon },
  { id: 'night_owl', name: 'Cú Đêm Thông Thái', description: 'Hoàn thành bài quiz sau 9 giờ tối.', icon: MoonIcon },
  { id: 'weekday_warrior', name: 'Chiến Binh Ngày Thường', description: 'Hoàn thành 15 bài quiz từ Thứ Hai - Thứ Sáu.', icon: CalendarDaysIcon },
  { id: 'weekend_wonder', name: 'Ngôi Sao Cuối Tuần', description: 'Hoàn thành 10 bài quiz vào cuối tuần.', icon: StarIcon },

  { id: 'unstoppable_force', name: 'Nguồn Năng Lượng Bất Tận', description: 'Hoàn thành 10 bài quiz trong một ngày.', icon: RocketLaunchIcon },
  { id: 'knowledge_seeker', name: 'Người Tìm Kiếm Tri Thức', description: 'Hoàn thành tất cả các chủ đề ít nhất một lần.', icon: GlobeIcon },
  { id: 'perfect_week', name: 'Tuần Lễ Hoàn Hảo', description: 'Đạt ít nhất 1 điểm tuyệt đối mỗi ngày trong 7 ngày.', icon: FireIcon },
  { id: 'subject_cycler', name: 'Nhà Thám Hiểm Đa Năng', description: 'Chơi cả 3 môn trong cùng một ngày.', icon: BrainIcon },
  { id: 'topic_hopper', name: 'Bước Nhảy Tri Thức', description: 'Chơi 5 chủ đề khác nhau trong một ngày.', icon: GlobeIcon },

  // IV. Bậc Thầy Các Môn Học (45 huy hiệu)
  { id: 'math_mastery', name: 'Vua Toán Học', description: 'Đạt điểm tuyệt đối trong tất cả chủ đề môn Toán.', icon: MathIcon },
  { id: 'vietnamese_mastery', name: 'Vua Tiếng Việt', description: 'Đạt điểm tuyệt đối trong tất cả chủ đề môn Tiếng Việt.', icon: VietnameseIcon },
  { id: 'science_mastery', name: 'Vua Khoa Học', description: 'Đạt điểm tuyệt đối trong tất cả chủ đề môn Tự nhiên & Xã hội.', icon: ScienceIcon },

  { id: 'math_prodigy', name: 'Thần Đồng Toán Học', description: 'Tỷ lệ đúng trung bình môn Toán trên 90%.', icon: BrainIcon },
  { id: 'vietnamese_prodigy', name: 'Thần Đồng Tiếng Việt', description: 'Tỷ lệ đúng trung bình môn Tiếng Việt trên 90%.', icon: BrainIcon },
  { id: 'science_prodigy', name: 'Thần Đồng Khoa Học', description: 'Tỷ lệ đúng trung bình môn Tự nhiên & Xã hội trên 90%.', icon: BrainIcon },

  ...[
    { topicId: 'phep_cong_tru_1000', name: 'Cộng Trừ', icon: PlusIcon },
    { topicId: 'phep_nhan_chia_bang_2_10', name: 'Nhân Chia', icon: MultiplyIcon },
    { topicId: 'hinh_hoc_co_ban', name: 'Hình Học', icon: ShapesIcon },
    { topicId: 'xem_dong_ho', name: 'Đồng Hồ', icon: ClockIcon },
    { topicId: 'giai_toan_loi_van', name: 'Toán Đố', icon: LightbulbIcon },
    { topicId: 'do_dai_do_luong', name: 'Đo Lường', icon: RulerIcon },
    { topicId: 'so_sanh', name: 'So Sánh', icon: ScaleIcon },
    { topicId: 'tu_vung', name: 'Từ Vựng', icon: VietnameseIcon },
    { topicId: 'dien_tu', name: 'Điền Từ', icon: StarIcon },
    { topicId: 'sap_xep_cau', name: 'Sắp Xếp Câu', icon: PuzzlePieceIcon },
    { topicId: 'doc_hieu_doan_van', name: 'Đọc Hiểu', icon: BookOpenIcon },
    { topicId: 'cay_xanh', name: 'Cây Xanh', icon: LeafIcon },
    { topicId: 'dong_vat', name: 'Động Vật', icon: PawIcon },
    { topicId: 'an_toan_giao_thong', name: 'Giao Thông', icon: ScienceIcon },
  ].flatMap(({ topicId, name, icon }) => [
    { id: `topic_veteran_${topicId}`, name: `Cựu Binh ${name}`, description: `Hoàn thành chủ đề ${name} 10 lần.`, icon: icon },
    { id: `topic_superstar_${topicId}`, name: `Siêu Sao ${name}`, description: `Đạt điểm tuyệt đối chủ đề ${name} 5 lần.`, icon: icon },
    { id: `topic_legend_${topicId}`, name: `Huyền Thoại ${name}`, description: `Đạt điểm tuyệt đối chủ đề ${name} 10 lần.`, icon: icon },
  ]) as Badge[],
];

// Reward Shop Items

export const SHOP_ITEMS: ShopItem[] = [
  // Hats
  { id: 'hat_crown', name: 'Vương Miện Vàng', type: 'hat', icon: '👑', price: 100, description: 'Vương miện của hoàng gia!' },
  { id: 'hat_wizard', name: 'Mũ Phù Thủy', type: 'hat', icon: '🧙', price: 80, description: 'Ma thuật thần kỳ!' },
  { id: 'hat_party', name: 'Nón Tiệc', type: 'hat', icon: '🎉', price: 50, description: 'Cùng ăn mừng nào!' },
  { id: 'hat_pirate', name: 'Mũ Cướp Biển', type: 'hat', icon: '🏴‍☠️', price: 70, description: 'Ahoy! Thuyền trưởng đây!' },
  { id: 'hat_detective', name: 'Mũ Thám Tử', type: 'hat', icon: '🕵️', price: 60, description: 'Sherlock Holmes nhí!' },

  // Glasses
  { id: 'glasses_cool', name: 'Kính Ngầu', type: 'glasses', icon: '😎', price: 40, description: 'Trông thật cool!' },
  { id: 'glasses_nerd', name: 'Kính Học Giả', type: 'glasses', icon: '🤓', price: 50, description: 'Thông minh hơn 200 IQ!' },
  { id: 'glasses_star', name: 'Kính Ngôi Sao', type: 'glasses', icon: '⭐', price: 60, description: 'Sáng như ngôi sao!' },
  { id: 'glasses_heart', name: 'Kính Trái Tim', type: 'glasses', icon: '💕', price: 55, description: 'Yêu đời yêu học!' },

  // Outfits
  { id: 'outfit_superhero', name: 'Áo Siêu Anh Hùng', type: 'outfit', icon: '🦸', price: 120, description: 'Sức mạnh vô biên!' },
  { id: 'outfit_scientist', name: 'Áo Khoa Học Gia', type: 'outfit', icon: '🔬', price: 90, description: 'Khám phá tri thức!' },
  { id: 'outfit_artist', name: 'Áo Nghệ Sĩ', type: 'outfit', icon: '🎨', price: 80, description: 'Sáng tạo nghệ thuật!' },
  { id: 'outfit_chef', name: 'Áo Đầu Bếp', type: 'outfit', icon: '👨‍🍳', price: 85, description: 'Nấu ăn siêu đẳng!' },

  // Backgrounds
  { id: 'bg_rainbow', name: 'Cầu Vồng', type: 'background', icon: '🌈', price: 150, description: 'Rực rỡ sắc màu!' },
  { id: 'bg_stars', name: 'Bầu Trời Sao', type: 'background', icon: '✨', price: 130, description: 'Lấp lánh như sao!' },
  { id: 'bg_forest', name: 'Rừng Xanh', type: 'background', icon: '🌲', price: 110, description: 'Thiên nhiên tươi mát!' },
  { id: 'bg_ocean', name: 'Đại Dương', type: 'background', icon: '🌊', price: 120, description: 'Biển xanh mênh mông!' },
];