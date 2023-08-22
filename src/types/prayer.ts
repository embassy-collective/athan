export interface Prayer {
  id: string;
  name: string;
  time: Date;
}

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
