import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { ILesson } from '@/types';

interface ILessonStore {
  lessons: ILesson[];
  addLesson: (data: { textbookId: string; name: string }) => void;
  updateLesson: (id: string, data: Partial<ILesson>) => void;
  deleteLesson: (id: string) => void;
  getLessonsByTextbookId: (textbookId: string) => ILesson[];
  getLessonById: (id: string) => ILesson | undefined;
}

export const useLessonStore = create<ILessonStore>()(
  persist(
    (set, get) => ({
      lessons: [],
      addLesson: (data) =>
        set((state) => {
          const existingLessons = state.lessons.filter(
            (l) => l.textbookId === data.textbookId
          );
          const maxOrder = existingLessons.reduce(
            (max, l) => Math.max(max, l.order),
            0
          );
          return {
            lessons: [
              ...state.lessons,
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
      updateLesson: (id, data) =>
        set((state) => ({
          lessons: state.lessons.map((l) =>
            l.id === id ? { ...l, ...data, updatedAt: Date.now() } : l
          ),
        })),
      deleteLesson: (id) =>
        set((state) => ({
          lessons: state.lessons.filter((l) => l.id !== id),
        })),
      getLessonsByTextbookId: (textbookId) =>
        get()
          .lessons.filter((l) => l.textbookId === textbookId)
          .sort((a, b) => a.order - b.order),
      getLessonById: (id) => get().lessons.find((l) => l.id === id),
    }),
    { name: 'ning-ting-lesson' }
  )
);
