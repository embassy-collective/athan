import { ReactComponent as NofityOff } from '@/assets/icons/notifs_off.svg';
import { ReactComponent as NofityOn } from '@/assets/icons/notifs_on.svg';
import { formatDate } from '@/lib/date';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/styles';
import { PrayerKey, Prayer as PrayerType } from '@/types/prayer';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import PrayerIcon from './prayer-icon';

const Prayer = ({ prayer, isActive }: { prayer: PrayerType; isActive?: boolean }) => {
  const { notifications, toggleNotification, twentyFourHourTime } = useStore();

  const onClick = async () => {
    // Keep this
    toggleNotification(prayer.id as PrayerKey);

    // Remove this later
    let permissionGranted = await isPermissionGranted();

    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }

    if (permissionGranted) {
      sendNotification({
        title: 'Athan time',
        body: `It's time for ${prayer.name} prayer!`
      });
      // playAthan();
    }
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
      <div className="flex justify-between items-center">
        <p>{prayer.name}</p>
        <PrayerIcon
          prayer={prayer.id}
          className={cn('w-6 h-6', {
            'text-white': isActive,
            'text-yellow': !isActive
          })}
        />
      </div>
      <div className="flex justify-between items-center">
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
