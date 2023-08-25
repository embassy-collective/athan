import { PrayerKey } from '@/types/prayer';
import { create } from 'zustand';
import { Settings } from './validation';

import { persist } from 'zustand/middleware';
import { AGENTS } from './config/agents';

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
  notifications: Record<PrayerKey, boolean>;
  volume: Settings['volume'];
  twentyFourHourTime: Settings['time'];
  agent: Settings['agent'];
  theme: Settings['theme'];
  toggleNotification: (key: PrayerKey) => void;
  setLocation: (location: GeoLocation) => void;
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
      agent: AGENTS[0].value,
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
      applySettings: (settings: Settings) =>
        set((state) => ({
          ...state,
          volume: settings.volume,
          twentyFourHourTime: settings.time,
          agent: settings.agent,
          theme: settings.theme,
          location: settings.location
        })),
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
      name: 'athan-time-storage'
    }
  )
);
