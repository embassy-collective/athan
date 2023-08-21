import { cn } from '@/lib/styles';
import SvgIcon from './svg-icon';

const Prayer = ({
  prayer,
  isActive
}: {
  prayer: {
    name: string;
    time: string;
    id: string;
  };
  isActive?: boolean;
}) => {
  return (
    <div
      className={cn(
        'flex flex-col justify-between px-4 py-6 gap-4 bg-accent rounded-[10px] border border-accent text-[20px]',
        {
          'bg-accent text-white': isActive,
          'text-white bg-transparent': !isActive
        }
      )}
    >
      <div className="flex justify-between items-center">
        <p>{prayer.name}</p>
        <SvgIcon iconName={prayer.id} svgProp={{ className: 'w-8 h-8' }} />
      </div>
      <p className="font-semibold">{prayer.time}</p>
    </div>
  );
};

export default Prayer;
