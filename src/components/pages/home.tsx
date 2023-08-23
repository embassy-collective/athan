import { useStore } from '@/lib/store';
import { PrayerKey } from '@/types/prayer';
import * as adhan from 'adhan';
import { format } from 'date-fns';
import { capitalize } from 'lodash';
import Location from '../atoms/location';
import NextPrayer from '../atoms/next-prayer';
import Prayers from '../molecules/prayers';
import Layout from '../templates/layout';
import { FixType } from '@/types';

const Home = () => {
  const { location } = useStore();
  const coordinates = new adhan.Coordinates(location.coords.latitude, location.coords.longitude);
  const params = adhan.CalculationMethod.MuslimWorldLeague();
  const today = new Date();
  const tomorrow = new Date(Date.now() + 86400000);
  const todayPrayerTimes = new adhan.PrayerTimes(coordinates, today, params);
  const tomorrowPrayerTimes = new adhan.PrayerTimes(coordinates, tomorrow, params);

  const value = (v: string) => (v === 'none' ? null : v);

  const nextPrayerToday = value(todayPrayerTimes.nextPrayer()) as keyof adhan.PrayerTimes | null;
  let nextPrayerTomorrow = null;

  let nextPrayer = nextPrayerToday;
  let nextPrayerTime: FixType = nextPrayerToday ? todayPrayerTimes[nextPrayerToday] : null;

  if (!nextPrayerTime) {
    nextPrayerTomorrow = value(tomorrowPrayerTimes.nextPrayer()) as keyof adhan.PrayerTimes;
    nextPrayer = nextPrayerTomorrow;
    nextPrayerTime = tomorrowPrayerTimes[nextPrayerTomorrow];
  }

  const allowedKeys = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

  const todayPrayers = Object.entries(todayPrayerTimes)
    .filter(([key]) => allowedKeys.includes(key))
    .map(([key, value]) => ({ name: capitalize(key), time: value, id: key }));

  const tomorrowPrayers = Object.entries(tomorrowPrayerTimes)
    .filter(([key]) => allowedKeys.includes(key))
    .map(([key, value]) => ({ name: capitalize(key), time: value, id: key }));

  return (
    <Layout>
      <div className="flex flex-row">
        <div className="flex flex-col gap-2 flex-grow">
          <NextPrayer nextPrayerTime={nextPrayerTime} />
          <h1 className="text-[112px]">
            <span className="font-black capitalize">{nextPrayer}</span> {format(nextPrayerTime, 'hh:mm')}
          </h1>
          {/* <p className="text-accent">5th Safar, 1445</p> TODO: */}
          <p className="text-accent">{format(today, 'do MMMM, yyyy')}</p>
        </div>
        <div>
          <div className="flex flex-row gap-2 items-center justify-center">
            <Location />
            <img src="/images/icons/edit.svg" alt="location" className="w-6 h-6 text-accent" />
          </div>
        </div>
      </div>
      <Prayers prayers={todayPrayers} className="mt-10" nextPrayer={nextPrayerToday as PrayerKey | null}>
        Today
      </Prayers>
      <Prayers prayers={tomorrowPrayers} className="mt-10" nextPrayer={nextPrayerTomorrow as PrayerKey | null}>
        Tomorrow
      </Prayers>
    </Layout>
  );
};

export default Home;
