import { useStore } from '@/lib/store';
import * as adhan from 'adhan';

export type Prayers =
  | keyof Partial<Pick<adhan.PrayerTimes, 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'>>
  | null;

/**
 * Use Prayer Times Hook
 *
 * @returns {PrayerTimes} Prayer Times
 * @returns {Date} Today
 * @returns {PrayerTimes} Tomorrow Prayer Times
 * @returns {NextPrayer} Next Prayer (isToday, time, prayer)
 */
const usePrayerTimes = () => {
  const { location } = useStore();
  const coordinates = new adhan.Coordinates(location.coords!.latitude, location.coords!.longitude);
  const params = adhan.CalculationMethod.MuslimWorldLeague();
  const today = new Date();
  const tomorrow = new Date(Date.now() + 86400000);
  const todayPrayerTimes = new adhan.PrayerTimes(coordinates, today, params);
  const tomorrowPrayerTimes = new adhan.PrayerTimes(coordinates, tomorrow, params);
  const prayerTimesByDate = (date: Date) => new adhan.PrayerTimes(coordinates, date, params);

  const value = <ValueType>(v: string) => (v === 'none' ? null : (v as ValueType));

  const nextPrayerToday = value<Prayers>(todayPrayerTimes.nextPrayer());
  const nextPrayerTomorrow = value<Prayers>(tomorrowPrayerTimes.nextPrayer());

  const nextPrayerTime = nextPrayerToday
    ? todayPrayerTimes?.[nextPrayerToday]
    : nextPrayerTomorrow
    ? tomorrowPrayerTimes[nextPrayerTomorrow]
    : null;

  const nextPrayer = {
    isToday: nextPrayerToday !== null,
    date: nextPrayerTime,
    prayer: nextPrayerToday || nextPrayerTomorrow
  };

  return {
    today,
    prayerTimes: todayPrayerTimes,
    tomorrowPrayerTimes: tomorrowPrayerTimes,
    nextPrayer,
    prayerTimesByDate
  };
};

export default usePrayerTimes;
