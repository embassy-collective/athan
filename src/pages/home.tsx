import usePrayerTimes from '@/hooks/usePrayerTimes';
import { PRAYERS } from '@/lib/config/prayers';
import { formatDate } from '@/lib/date';
import { useStore } from '@/lib/store';
import { PrayerKey } from '@/types/prayer';
import { format } from 'date-fns';
import { capitalize } from 'lodash';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import NextPrayer from '../components/atoms/next-prayer';
import Prayers from '../components/molecules/prayers';
import Layout from '../components/templates/layout';

const Home = () => {
  const { t } = useTranslation();
  const { today, prayerTimes, tomorrowPrayerTimes, nextPrayer } = usePrayerTimes();
  const { twentyFourHourTime, onboarding } = useStore();
  const todayPrayers = Object.entries(prayerTimes)
    .filter(([key]) => PRAYERS.includes(key as PrayerKey))
    .map(([key, value]) => ({ name: capitalize(key), time: value, id: key }));
  const tomorrowPrayers = Object.entries(tomorrowPrayerTimes)
    .filter(([key]) => PRAYERS.includes(key as PrayerKey))
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
        <div className="flex flex-col flex-grow gap-2">
          {nextPrayer.date && (
            <>
              <NextPrayer nextPrayerTime={nextPrayer.date} />
              <h1 className="text-[112px]">
                <span className="font-black capitalize rtl:font-arabic">{t(nextPrayer.prayer as string)}</span>{' '}
                {formatDate(nextPrayer.date, twentyFourHourTime)}
              </h1>
            </>
          )}
          <div className="flex gap-2 text-accent">
            <p>{hijri.replace('AH', '')}</p>
            <p> / </p>
            <p>{format(today, 'do MMMM, yyyy')}</p>
          </div>
        </div>
      </div>
      <Prayers prayers={todayPrayers} className="mt-10" nextPrayer={nextPrayer.isToday ? nextPrayer.prayer : null}>
        {t('Today')}
      </Prayers>
      <Prayers prayers={tomorrowPrayers} className="mt-10" nextPrayer={!nextPrayer.isToday ? nextPrayer.prayer : null}>
        {t('Tomorrow')}
      </Prayers>
    </Layout>
  );
};

export default Home;
