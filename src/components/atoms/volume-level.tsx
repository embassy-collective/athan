import { ReactComponent as Full } from '@/assets/icons/volume_full.svg';
import { ReactComponent as Loud } from '@/assets/icons/volume_loud.svg';
import { ReactComponent as Low } from '@/assets/icons/volume_low.svg';
import { ReactComponent as Mute } from '@/assets/icons/volume_muted.svg';
import { cn } from '@/lib/styles';
import { useMemo } from 'react';

const VolumeLevel = ({ volume }: { volume: number }) => {
  const Icon = useMemo(() => {
    if (volume === 0) return Mute;
    else if (volume < 33.33) return Low;
    else if (volume < 66.66) return Loud;
    else return Full;
  }, [volume]);
  return <Icon className={cn('w-8 h-8 ease-in duration-200')} />;
};

export default VolumeLevel;
