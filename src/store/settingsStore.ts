import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IAppSettings } from '@/types';

interface ISettingsStore {
  settings: IAppSettings;
  updateSettings: (data: Partial<IAppSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: IAppSettings = {
  defaultSpeechRate: 1.0,
  defaultRepeatTimes: 2,
  theme: 'auto',
};

export const useSettingsStore = create<ISettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (data) =>
        set((state) => ({
          settings: { ...state.settings, ...data },
        })),
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    { name: 'ning-ting-settings' }
  )
);
