import { PrayerKey } from '@/types/prayer';
import { create } from 'zustand';

interface GeoLocation {
  coords: {
    latitude: number;
    longitude: number;
  };
  city: string;
  country: string;
}

interface State {
  location: GeoLocation;
  notifications: Record<PrayerKey, boolean>;
  toggleNotification: (key: PrayerKey) => void;
  setLocation: (location: GeoLocation) => void;
}

export const useStore = create<State>((set) => ({
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
    }))
}));
