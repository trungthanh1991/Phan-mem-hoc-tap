import React from 'react';

export type QuestionType = 'MULTIPLE_CHOICE' | 'FILL_IN_THE_BLANK' | 'REARRANGE_WORDS' | 'READ_ALOUD' | 'WRITE_PASSAGE';

interface BaseQuestion {
  type: QuestionType;
  explanation: string;
  correctAnswer: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'MULTIPLE_CHOICE';
  question: string;
  options: string[];
}

export interface FillInTheBlankQuestion extends BaseQuestion {
  type: 'FILL_IN_THE_BLANK';
  // Ví dụ: ["Con ", " là con vật hay kêu 'meo meo'."] cho câu "Con mèo là..."
  questionParts: [string, string];
}

export interface RearrangeWordsQuestion extends BaseQuestion {
  type: 'REARRANGE_WORDS';
  // Lời dẫn yêu cầu, ví dụ: "Sắp xếp các từ sau thành câu có nghĩa:"
  question: string;
  // Các từ bị xáo trộn
  words: string[];
}

export interface ReadAloudQuestion extends BaseQuestion {
  type: 'READ_ALOUD';
  passage: string;
  translation?: string; // Nghĩa Tiếng Việt cho từ Tiếng Anh
}

export interface WritePassageQuestion extends BaseQuestion {
  type: 'WRITE_PASSAGE';
  passage: string;
}


export type Question = MultipleChoiceQuestion | FillInTheBlankQuestion | RearrangeWordsQuestion | ReadAloudQuestion | WritePassageQuestion;


export interface Subject {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  gradientFrom?: string;
  gradientTo?: string;
  textColor: string;
  lightBgColor: string;
  borderColor: string;
  baseColor: string;
  backgroundImage?: string;
}

export interface Topic {
  id: string;
  name: string;
}

export interface SubTopic {
  id: string;
  name: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface TopicStats {
  bestScore: number;
  timesCompleted: number;
  totalCorrect: number;
  totalQuestions: number;
  perfectScoreCount: number;
}

export interface QuizStats {
  [subjectId: string]: {
    [topicId: string]: TopicStats;
  };
}

export type GameState = 'subject_selection' | 'topic_selection' | 'loading_quiz' | 'in_quiz' | 'results' | 'badge_collection' | 'parents_corner' | 'reading_activity' | 'exam_options' | 'loading_exam' | 'in_exam' | 'writing_activity' | 'review' | 'english_reading_subtopic_selection';

export interface ReadingAnalysis {
  accuracy: number;
  incorrectWords: { expected: string; actual: string; }[];
  unclearWords: string[];
  missedWords: string[];
  feedback: string;
}

export interface WritingAnalysis {
  legibilityScore: number; // Điểm dễ đọc
  neatnessScore: number; // Điểm ngay ngắn
  correctnessScore: number; // Điểm đúng chuẩn
  completenessScore: number; // Điểm đầy đủ
  positiveFeedback: string; // Lời khen
  constructiveSuggestion: string; // Góp ý
}


export interface ReadingRecord {
  passage: string;
  analysis: ReadingAnalysis;
  timestamp: number;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  unlockRequirement: string; // Badge ID hoặc điều kiện để unlock
  isUnlocked: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    gradient: { from: string; to: string };
  };
  mascotImage?: string; // URL hoặc path đến mascot
  backgroundPattern?: string;
}

export interface MistakeRecord {
  question: Question;
  userAnswer: string;
  subjectId: string;
  topicId: string;
  timestamp: number;
}

export interface UserData {
  earnedBadges: string[];
  stats: QuizStats;
  readingHistory: ReadingRecord[];
  // Các trường mới để theo dõi tiến trình
  lastPlayDate: string; // Định dạng 'YYYY-MM-DD'
  consecutivePlayDays: number;
  perfectScoreStreak: number; // Chuỗi điểm tuyệt đối trên các bài quiz
  dailyHistory: { date: string; quizzes: number; subjects: Set<string>; topics: Set<string> };
  // Theme customization
  currentThemeId: string;
  unlockedThemes: string[];
  // Smart review
  mistakes: MistakeRecord[];
}