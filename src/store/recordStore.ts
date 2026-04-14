import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { IDictationRecord } from '@/types';

interface IRecordStore {
  records: IDictationRecord[];
  addRecord: (data: {
    textbookId: string;
    lessonId: string;
    startTime: number;
    endTime: number;
    itemIds: string[];
    results: Record<string, boolean>;
    photoUrl?: string;
  }) => void;
  updateRecord: (id: string, data: Partial<IDictationRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecordById: (id: string) => IDictationRecord | undefined;
  getRecordsByLessonId: (lessonId: string) => IDictationRecord[];
}

export const useRecordStore = create<IRecordStore>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (data) =>
        set((state) => {
          const correctCount = Object.values(data.results).filter(Boolean).length;
          const totalCount = Object.values(data.results).length;
          const accuracy =
            totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
          return {
            records: [
              ...state.records,
              {
                ...data,
                id: nanoid(),
                accuracy,
              },
            ],
          };
        }),
      updateRecord: (id, data) =>
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),
      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),
      getRecordById: (id) => get().records.find((r) => r.id === id),
      getRecordsByLessonId: (lessonId) =>
        get().records.filter((r) => r.lessonId === lessonId),
    }),
    { name: 'ning-ting-record' }
  )
);
