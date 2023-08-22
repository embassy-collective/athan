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
}

export const useStore = create<State>(() => ({
  location: {
    coords: {
      latitude: 5.3698,
      longitude: 43.2965
    },
    city: 'Marseille',
    country: 'France'
  }
}));
