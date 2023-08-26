import { ReactComponent as Asr } from '@/assets/icons/asr.svg';
import { ReactComponent as Dhuhr } from '@/assets/icons/dhuhr.svg';
import { ReactComponent as Fajr } from '@/assets/icons/fajr.svg';
import { ReactComponent as Isha } from '@/assets/icons/isha.svg';
import { ReactComponent as Maghrib } from '@/assets/icons/maghrib.svg';
import { ReactComponent as Sunrise } from '@/assets/icons/sunrise.svg';

const PrayerIcon = ({ prayer, className }: { prayer: string; className?: string }) => {
  switch (prayer) {
    case 'fajr':
      return <Fajr className={className} />;
    case 'sunrise':
      return <Sunrise className={className} />;
    case 'dhuhr':
      return <Dhuhr className={className} />;
    case 'asr':
      return <Asr className={className} />;
    case 'maghrib':
      return <Maghrib className={className} />;
    case 'isha':
      return <Isha className={className} />;
    default:
      return null;
  }
};

export default PrayerIcon;
