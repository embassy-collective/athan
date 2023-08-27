import { PrayerKey } from '@/types/prayer';
import { create } from 'zustand';
import { Settings } from './validation';

import { createJSONStorage, persist } from 'zustand/middleware';
import { AGENTS } from './config/agents';
import storage from './storage';

export interface GeoLocation {
  coords?: {
    latitude: number;
    longitude: number;
  };
  city?: string;
  country?: string;
}

interface State {
  onboarding: boolean;
  location: GeoLocation;
  language: string;
  notifications: Record<PrayerKey, boolean>;
  volume: Settings['volume'];
  twentyFourHourTime: Settings['time'];
  agent: Settings['agent'];
  theme: Settings['theme'];
  gamify: boolean;
  remindBefore: Settings['remindBefore'];
  toggleNotification: (key: PrayerKey) => void;
  setLocation: (location: GeoLocation) => void;
  setLanguage: (language: string) => void;
  applySettings: (settings: Settings) => void;
  setTheme: (theme: Settings['theme']) => void;
  setOnboarding: (onboarding: boolean) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      onboarding: false,
      theme: 'system',
      volume: 50,
      twentyFourHourTime: true,
      gamify: false,
      remindBefore: 5,
      agent: AGENTS[0].value,
      language: 'en',
      location: {
        coords: {
          latitude: 5.3698,
          longitude: 43.2965
        },
        city: 'Marseille',
        country: 'France'
      },
      notifications: {
        sunrise: true,
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true
      },
      toggleNotification: (key: PrayerKey) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [key]: !state.notifications[key]
          }
        })),
      setLocation: (location: GeoLocation) =>
        set(() => ({
          location: location
        })),
      setLanguage: (language: string) =>
        set(() => ({
          language: language
        })),
      applySettings: (settings: Settings) =>{
        set((state) => ({
          ...state,
          volume: settings.volume,
          twentyFourHourTime: settings.time,
          agent: settings.agent,
          theme: settings.theme,
          location: settings.location,
          language: settings.language,
          gamify: settings.gamify,
          remindBefore: settings.remindBefore
        }))
      },
      setTheme: (theme: Settings['theme']) =>
        set(() => ({
          theme: theme
        })),
      setOnboarding: (onboarding: boolean) =>
        set(() => ({
          onboarding: onboarding
        }))
    }),
    {
      name: 'athan-time-storage',
      storage: createJSONStorage(() => storage)
    }
  )
);
