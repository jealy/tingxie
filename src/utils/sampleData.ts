import type { ITextbook, IWordItem } from '@/types';

export const SAMPLE_TEXTBOOK: Omit<ITextbook, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '部编版语文一年级上册',
  subject: 'chinese',
  grade: 1,
  term: 1,
  coverColor: '#FF9A62',
};

export const SAMPLE_LESSONS: Array<{
  textbookId: string;
  name: string;
  order: number;
}> = [
  { textbookId: '', name: '识字（一）', order: 1 },
  { textbookId: '', name: '课文 1 秋天', order: 2 },
];

export const SAMPLE_WORDS: Array<{
  lessonId: string;
  type: IWordItem['type'];
  content: string;
  pronunciation?: string;
  hint?: string;
  order: number;
}> = [
  { lessonId: '', type: 'hanzi', content: '天', pronunciation: 'tiān', hint: '天空的天', order: 1 },
  { lessonId: '', type: 'hanzi', content: '地', pronunciation: 'dì', hint: '大地的地', order: 2 },
  { lessonId: '', type: 'hanzi', content: '人', pronunciation: 'rén', hint: '大人的人', order: 3 },
  { lessonId: '', type: 'hanzi', content: '口', pronunciation: 'kǒu', hint: '人口的口', order: 4 },
  { lessonId: '', type: 'hanzi', content: '手', pronunciation: 'shǒu', hint: '小手的手', order: 5 },
  { lessonId: '', type: 'hanzi', content: '日', pronunciation: 'rì', hint: '日月的日', order: 6 },
  { lessonId: '', type: 'hanzi', content: '月', pronunciation: 'yuè', hint: '月亮的月', order: 7 },
  { lessonId: '', type: 'hanzi', content: '水', pronunciation: 'shuǐ', hint: '河水的水', order: 8 },
  { lessonId: '', type: 'hanzi', content: '火', pronunciation: 'huǒ', hint: '火山的火', order: 9 },
  { lessonId: '', type: 'hanzi', content: '山', pronunciation: 'shān', hint: '高山的山', order: 10 },
  { lessonId: '', type: 'ciyu', content: '秋天', pronunciation: 'qiū tiān', hint: '秋天的秋天', order: 1 },
  { lessonId: '', type: 'ciyu', content: '天气', pronunciation: 'tiān qì', hint: '天气的天气', order: 2 },
  { lessonId: '', type: 'ciyu', content: '树叶', pronunciation: 'shù yè', hint: '树叶的树叶', order: 3 },
  { lessonId: '', type: 'ciyu', content: '天空', pronunciation: 'tiān kōng', hint: '天空的天空', order: 4 },
  { lessonId: '', type: 'ciyu', content: '丰收', pronunciation: 'fēng shōu', hint: '丰收的丰收', order: 5 },
];

export const isDataSeeded = (textbooks: ITextbook[]) => {
  return textbooks.some((t) => t.name === '部编版语文一年级上册');
};
