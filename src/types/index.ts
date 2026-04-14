export type ISubject = 'chinese' | 'english' | 'poetry';
export type IGrade = 1 | 2 | 3 | 4 | 5 | 6;
export type ITerm = 1 | 2;
export type IWordType = 'hanzi' | 'ciyu' | 'english' | 'poetry';
export type ITheme = 'light' | 'auto';

export interface ITextbook {
  id: string;
  name: string;
  subject: ISubject;
  grade: IGrade;
  term: ITerm;
  coverColor: string;
  createdAt: number;
  updatedAt: number;
}

export interface ILesson {
  id: string;
  textbookId: string;
  name: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface IWordExtra {
  author?: string;
  fullText?: string;
  example?: string;
}

export interface IWordItem {
  id: string;
  lessonId: string;
  type: IWordType;
  content: string;
  pronunciation?: string;
  hint?: string;
  extra?: IWordExtra;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface IDictationRecord {
  id: string;
  textbookId: string;
  lessonId: string;
  startTime: number;
  endTime: number;
  itemIds: string[];
  results: Record<string, boolean>;
  accuracy: number;
  photoUrl?: string;
}

export interface IAppSettings {
  defaultSpeechRate: number;
  defaultRepeatTimes: 1 | 2 | 3;
  theme: ITheme;
}

export interface IAppData {
  version: string;
  textbooks: ITextbook[];
  lessons: ILesson[];
  words: IWordItem[];
  records: IDictationRecord[];
  settings: IAppSettings;
}
