export type CompanionId = 'wick' | 'pal' | 'tuanzi';

export interface Companion {
  id: CompanionId;
  name: string;
  nameEn: string;
  // Sleeper berth on the night train (B-04 is reserved for Nubo).
  seat: string;
  type: string;
  quote: string;
  avatarUrl: string;
  // Square, head-centred portrait for avatar frames.
  portraitUrl: string;
  // Full-body front view on a transparent background (companion selection cards).
  figureUrl: string;
  // Full-width scene illustration; companions without one fall back to a composed portrait scene.
  sceneUrl?: string;
  // Mouth position in the scene image (0–1 of width/height), where speech bubbles point.
  sceneMouth?: { x: number; y: number };
  // Point beside the head to anchor bubbles instead of the mouth, for scenes where a bubble at the
  // mouth would cover the body.
  sceneBubbleAnchors?: { side?: { x: number; y: number } };
  // One-line self-introduction shown in the companion selection hero.
  intro: string;
  celebrateAvatarUrl?: string;
  celebrateActionName?: string;
  celebrateQuote?: string;
  accentColor: string;
  bgGlow: string;
  description: string;
}

export type ReadingLevel = 'easy' | 'mid' | 'hard';

// One finished read = one ride on the night train; each ride leaves a ticket in the ticket book.
export interface RideTicket {
  id: string;
  rideNumber: number;
  title: string;
  chineseTitle: string;
  theme: string;
  coverUrl: string;
  date: string;
}

// What happened during one read, for the arrival screen's stats.
export interface ReadSummary {
  lookedUpWords: number;
  wordsRead: number;
  // Time spent reading, for the report's 本次阅读时长.
  seconds: number;
}

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

export interface BookmarkedSentence {
  sentence: string;
  translation: string;
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
  };
  bookmarkedWords: string[];
  bookmarkedSentences: BookmarkedSentence[];
  streakDays: number;
}

