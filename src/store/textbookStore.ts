import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { ITextbook, ISubject, IGrade, ITerm } from '@/types';

interface ITextbookStore {
  textbooks: ITextbook[];
  addTextbook: (data: {
    name: string;
    subject: ISubject;
    grade: IGrade;
    term: ITerm;
    coverColor: string;
  }) => void;
  updateTextbook: (id: string, data: Partial<ITextbook>) => void;
  deleteTextbook: (id: string) => void;
  getTextbookById: (id: string) => ITextbook | undefined;
}

export const useTextbookStore = create<ITextbookStore>()(
  persist(
    (set, get) => ({
      textbooks: [],
      addTextbook: (data) =>
        set((state) => ({
          textbooks: [
            ...state.textbooks,
            {
              ...data,
              id: nanoid(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        })),
      updateTextbook: (id, data) =>
        set((state) => ({
          textbooks: state.textbooks.map((t) =>
            t.id === id ? { ...t, ...data, updatedAt: Date.now() } : t
          ),
        })),
      deleteTextbook: (id) =>
        set((state) => ({
          textbooks: state.textbooks.filter((t) => t.id !== id),
        })),
      getTextbookById: (id) => get().textbooks.find((t) => t.id === id),
    }),
    { name: 'ning-ting-textbook' }
  )
);
