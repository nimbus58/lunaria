import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language, LocationData, NotificationSettings, Preferences } from './types';

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  fullMoon: true,
  newMoon: true,
  time: '08:00',
};

const DEFAULT_LOCATION: LocationData = {
  lat: 37.7749,
  lon: -122.4194,
  cityName: 'San Francisco, CA',
};

interface AppState {
  preferences: Preferences;
  locationLoading: boolean;
  locationError: string | null;
  language: Language;

  getLocation: () => LocationData;
  getNotificationSettings: () => NotificationSettings;
  setLocation: (location: LocationData) => void;
  setNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
  setLanguage: (language: Language) => void;
}

export type AppStore = AppState;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      preferences: {},
      locationLoading: false,
      locationError: null,
      language: (typeof navigator !== 'undefined' && navigator.language?.startsWith('fr') ? 'fr' : 'en') as Language,

      getLocation: () => get().preferences.location ?? DEFAULT_LOCATION,
      getNotificationSettings: () =>
        get().preferences.notificationSettings ?? DEFAULT_NOTIFICATION_SETTINGS,

      setLocation: (location) =>
        set((state) => ({
          preferences: { ...state.preferences, location },
          locationError: null,
        })),

      setNotificationSettings: (settings) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            notificationSettings: {
              ...(state.preferences.notificationSettings ?? DEFAULT_NOTIFICATION_SETTINGS),
              ...settings,
            },
          },
        })),

      setLocationLoading: (loading) => set({ locationLoading: loading }),
      setLocationError: (error) => set({ locationError: error }),

      setLanguage: (language) =>
        set((state) => ({
          language,
          preferences: { ...state.preferences, language },
        })),
    }),
    {
      name: 'moon-time-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        language: state.language,
      }),
    }
  )
);
