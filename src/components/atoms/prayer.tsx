import { ReactComponent as NofityOff } from '@/assets/icons/notifs_off.svg';
import { ReactComponent as NofityOn } from '@/assets/icons/notifs_on.svg';
import { formatDate } from '@/lib/date';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/styles';
import { PrayerKey, Prayer as PrayerType } from '@/types/prayer';
import { useTranslation } from 'react-i18next';
import PrayerIcon from './prayer-icon';

const Prayer = ({ prayer, isActive }: { prayer: PrayerType; isActive?: boolean }) => {
  const { t } = useTranslation();
  const { notifications, toggleNotification, twentyFourHourTime } = useStore();

  const onClick = async () => {
    // Keep this
    toggleNotification(prayer.id as PrayerKey);
  };
  const notificationEnabled = notifications[prayer.id as PrayerKey];

  return (
    <div
      className={cn(
        'flex flex-col justify-between px-4 py-6 gap-4 bg-accent rounded-[10px] border border-accent text-[20px] hover:cursor-pointer',
        {
          'bg-accent text-white': isActive,
          'text-primary bg-transparent': !isActive
        }
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <p className="rtl:font-arabic">{t(prayer.name)}</p>
        <PrayerIcon
          prayer={prayer.id}
          className={cn('w-6 h-6', {
            'text-white': isActive,
            'text-yellow': !isActive
          })}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="font-semibold">{formatDate(prayer.time, twentyFourHourTime)}</p>
        {notificationEnabled ? (
          <NofityOn
            className={cn('w-6 h-6', {
              'text-primary': !isActive,
              'text-white': isActive
            })}
          />
        ) : (
          <NofityOff
            className={cn('w-6 h-6 opacity-50', {
              'text-primary': !isActive,
              'text-white': isActive
            })}
          />
        )}
      </div>
    </div>
  );
};

export default Prayer;
