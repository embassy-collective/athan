import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const NextPrayer = ({ nextPrayerTime }: { nextPrayerTime: Date }) => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState<string>();

  const countdownTillNextPrayer = () => {
    const now = new Date();
    const diff = nextPrayerTime.getTime() - now.getTime();
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    // Format as HH:MM:SS
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(countdownTillNextPrayer());
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <h2 className="text-3xl font-light rtl:font-arabic">
      {t('Next prayer in')} <span className="text-accent">{countdown}</span>
    </h2>
  );
};

export default NextPrayer;
