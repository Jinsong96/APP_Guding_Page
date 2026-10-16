export type CompanionId = 'pal' | 'wick' | 'nubo' | 'light';

export interface Companion {
  id: CompanionId;
  name: string;
  nameEn: string;
  type: string;
  quote: string;
  avatarUrl: string;
  celebrateAvatarUrl?: string;
  celebrateActionName?: string;
  celebrateQuote?: string;
  accentColor: string;
  bgGlow: string;
  description: string;
}

export type ReadingLevel = 'easy' | 'mid' | 'hard';

export interface VocabItem {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  chinese: string;
  englishDef: string;
  example: string;
  companionNote: string;
}

export interface SentenceChunk {
  text: string;
  role: '主语' | '谓语' | '宾语/状语' | '修饰分句';
  explanation: string;
}

export interface StoryLevelContent {
  level: ReadingLevel;
  cefr: 'A1' | 'A2' | 'B1';
  levelLabel: string;
  cefrDesc: string;
  diffSummary: string;
  estMinutes: number;
  paragraphs: string[];
}

export interface Story {
  id: string;
  title: string;
  chineseTitle: string;
  continent: string;
  series: string;
  part: string;
  synopsis: string;
  coverImage?: string;
  levels: {
    easy: StoryLevelContent;
    mid: StoryLevelContent;
    hard: StoryLevelContent;
  };
  keyVocab: Record<string, VocabItem>;
  sentenceBreakdown: {
    original: string;
    analysis: string;
    chunks: SentenceChunk[];
  };
}

export interface GoalTrackDetails {
  category: 'exam' | 'workplace' | 'original' | 'interest';
  categoryLabel: string;
  targetFocus: string;
  targetHurdle: string;
}

export interface UserPreferences {
  companionId: CompanionId;
  interestTheme: string;
  selectedThemes?: string[];
  pacing: 'relaxed' | 'challenging';
  readingRatings: {
    stage4?: 'hard' | 'just_right' | 'easy';
    stage5?: 'hard' | 'just_right' | 'easy';
    stage6?: 'hard' | 'just_right' | 'easy';
  };
  currentLevel: ReadingLevel;
  determinedCefr?: 'A1-' | 'A2' | 'B1' | 'B2+';
  profile: {
    startingLevel: string;
    hintDensity: 'light' | 'detailed';
    sessionDuration: 5 | 10;
    goal?: string;
    challenge?: string;
    durationPreference?: string;
    companionStyle?: string;
    goalTrack?: GoalTrackDetails;
  };
  bookmarkedWords: string[];
  streakDays: number;
}

