import usePrayerTimes from '@/hooks/usePrayerTimes';
import { formatDate } from '@/lib/date';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import { capitalize } from 'lodash';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NextPrayer from '../atoms/next-prayer';
import Prayers from '../molecules/prayers';
import Layout from '../templates/layout';

const Home = () => {
  const { today, prayerTimes, tomorrowPrayerTimes, nextPrayer } = usePrayerTimes();
  const { twentyFourHourTime, onboarding } = useStore();
  const allowedKeys = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const todayPrayers = Object.entries(prayerTimes)
    .filter(([key]) => allowedKeys.includes(key))
    .map(([key, value]) => ({ name: capitalize(key), time: value, id: key }));
  const tomorrowPrayers = Object.entries(tomorrowPrayerTimes)
    .filter(([key]) => allowedKeys.includes(key))
    .map(([key, value]) => ({ name: capitalize(key), time: value, id: key }));

  const navigate = useNavigate();

  useEffect(() => {
    if (!onboarding) {
      navigate('/settings');
    }
  }, [onboarding]);

  const hijri = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(today);

  return (
    <Layout>
      <div className="flex flex-row">
        <div className="flex flex-col gap-2 flex-grow">
          {nextPrayer.time && (
            <>
              <NextPrayer nextPrayerTime={nextPrayer.time} />
              <h1 className="text-[112px]">
                <span className="font-black capitalize">{nextPrayer.prayer}</span>{' '}
                {formatDate(nextPrayer.time, twentyFourHourTime)}
              </h1>
            </>
          )}
          <p className="text-accent">{hijri.replace('AH', '')}</p>
          <p className="text-accent">{format(today, 'do MMMM, yyyy')}</p>
        </div>
      </div>
      <Prayers prayers={todayPrayers} className="mt-10" nextPrayer={nextPrayer.isToday ? nextPrayer.prayer : null}>
        Today
      </Prayers>
      <Prayers prayers={tomorrowPrayers} className="mt-10" nextPrayer={!nextPrayer.isToday ? nextPrayer.prayer : null}>
        Tomorrow
      </Prayers>
    </Layout>
  );
};

export default Home;
