import { cn } from '@/lib/styles';
import { Prayer as PrayerType } from '@/types/prayer';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { format } from 'date-fns';
import SvgIcon from './svg-icon';

const Prayer = ({ prayer, isActive }: { prayer: PrayerType; isActive?: boolean }) => {
  const onClick = async () => {
    console.log('Hello!');
    let permissionGranted = await isPermissionGranted();

    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }

    if (permissionGranted) {
      console.log('Permission granted!');
      sendNotification('Tauri is awesome!');

      sendNotification({
        title: 'Athan time',
        body: `It's time for ${prayer.name} prayer!`
      });
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col justify-between px-4 py-6 gap-4 bg-accent rounded-[10px] border border-accent text-[20px] hover:cursor-pointer',
        {
          'bg-accent text-white': isActive,
          'text-white bg-transparent': !isActive
        }
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <p>{prayer.name}</p>
        <SvgIcon iconName={prayer.id} svgProp={{ className: 'w-8 h-8' }} />
      </div>
      <p className="font-semibold">{format(prayer.time, 'hh:mm')}</p>
    </div>
  );
};

export default Prayer;
