import { useStore } from '@/lib/store';
import { PrayerKey } from '@/types/prayer';
import * as adhan from 'adhan';
import { format } from 'date-fns';
import { capitalize } from 'lodash';
import NextPrayer from '../atoms/next-prayer';
import Prayers from '../molecules/prayers';
import Layout from '../templates/layout';

const Home = () => {
  const { location } = useStore();
  const coordinates = new adhan.Coordinates(location.coords.latitude, location.coords.longitude);
  const params = adhan.CalculationMethod.MuslimWorldLeague();
  const today = new Date();
  const tomorrow = new Date(Date.now() + 86400000);
  const todayPrayerTimes = new adhan.PrayerTimes(coordinates, today, params);
  const tomorrowPrayerTimes = new adhan.PrayerTimes(coordinates, tomorrow, params);

  
  const myFormat = 'en-u-ca-islamic-umalqura-nu-latn'; // uses islamic-umalqura calendar 
  const myDate   = new Date(Date.now());  // today's date
  const hijriDate   = new Intl.DateTimeFormat(myFormat,{dateStyle:'long'}).format(myDate);

  const value = (v: string) => (v === 'none' ? null : v);

  const nextPrayerToday = value(todayPrayerTimes.nextPrayer()) as keyof adhan.PrayerTimes;
  const nextPrayerTomorrow = value(tomorrowPrayerTimes.nextPrayer()) as keyof adhan.PrayerTimes;

  const nextPrayer = nextPrayerToday || nextPrayerTomorrow;
  const nextPrayerTime = (
    nextPrayerToday ? todayPrayerTimes[nextPrayerToday] : tomorrowPrayerTimes[nextPrayerTomorrow]
  ) as Date;

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
          <div>
            <p className="text-accent inline ">{hijriDate}</p>
            <p className='text-accent inline'> / </p>
            <p className="text-accent inline ">{format(today, 'do MMMM, yyyy')}</p>
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
