import React from 'react';

export type QuestionType = 'MULTIPLE_CHOICE' | 'FILL_IN_THE_BLANK' | 'REARRANGE_WORDS' | 'READ_ALOUD';

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
}

export type Question = MultipleChoiceQuestion | FillInTheBlankQuestion | RearrangeWordsQuestion | ReadAloudQuestion;


export interface Subject {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  lightBgColor: string;
  borderColor: string;
  baseColor: string;
}

export interface Topic {
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
}

export interface QuizStats {
  [subjectId: string]: {
    [topicId: string]: TopicStats;
  };
}

export type GameState = 'subject_selection' | 'topic_selection' | 'loading_quiz' | 'in_quiz' | 'results' | 'badge_collection' | 'parents_corner' | 'reading_activity' | 'exam_options' | 'loading_exam' | 'in_exam';

export interface ReadingAnalysis {
  accuracy: number;
  incorrectWords: { expected: string; actual: string; }[];
  unclearWords: string[];
  feedback: string;
}