import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { IWordItem, IWordType, IWordExtra } from '@/types';

interface IWordStore {
  words: IWordItem[];
  addWord: (data: {
    lessonId: string;
    type: IWordType;
    content: string;
    pronunciation?: string;
    hint?: string;
    extra?: IWordExtra;
  }) => void;
  updateWord: (id: string, data: Partial<IWordItem>) => void;
  deleteWord: (id: string) => void;
  getWordsByLessonId: (lessonId: string) => IWordItem[];
  getWordById: (id: string) => IWordItem | undefined;
  batchAddWords: (
    wordsData: Array<{
      lessonId: string;
      type: IWordType;
      content: string;
      pronunciation?: string;
      hint?: string;
      extra?: IWordExtra;
    }>
  ) => void;
}

export const useWordStore = create<IWordStore>()(
  persist(
    (set, get) => ({
      words: [],
      addWord: (data) =>
        set((state) => {
          const existingWords = state.words.filter(
            (w) => w.lessonId === data.lessonId
          );
          const maxOrder = existingWords.reduce(
            (max, w) => Math.max(max, w.order),
            0
          );
          return {
            words: [
              ...state.words,
              {
                ...data,
                id: nanoid(),
                order: maxOrder + 1,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              },
            ],
          };
        }),
      updateWord: (id, data) =>
        set((state) => ({
          words: state.words.map((w) =>
            w.id === id ? { ...w, ...data, updatedAt: Date.now() } : w
          ),
        })),
      deleteWord: (id) =>
        set((state) => ({
          words: state.words.filter((w) => w.id !== id),
        })),
      getWordsByLessonId: (lessonId) =>
        get()
          .words.filter((w) => w.lessonId === lessonId)
          .sort((a, b) => a.order - b.order),
      getWordById: (id) => get().words.find((w) => w.id === id),
      batchAddWords: (wordsData) =>
        set((state) => {
          const orderMap = new Map<string, number>()

          state.words.forEach((word) => {
            orderMap.set(word.lessonId, Math.max(orderMap.get(word.lessonId) ?? 0, word.order))
          })

          const newWords = wordsData.map((data) => {
            const nextOrder = (orderMap.get(data.lessonId) ?? 0) + 1
            orderMap.set(data.lessonId, nextOrder)

            return {
              ...data,
              id: nanoid(),
              order: nextOrder,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }
          })

          return { words: [...state.words, ...newWords] }
        }),
    }),
    { name: 'ning-ting-word' }
  )
);
