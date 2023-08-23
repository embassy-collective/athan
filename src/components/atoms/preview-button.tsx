import { cn } from '@/lib/styles';
import { useEffect, useState } from 'react';
import SvgIcon from './svg-icon';

const PreviewButton = ({ agent, volume }: { agent: string; volume: number }) => {
  let timeout: NodeJS.Timeout | undefined = undefined;
  const [playing, setPlaying] = useState(false);

  const preview = async () => {
    if (playing) return;
    const path = `/audio/agents/${agent}.mp3`;

    const audio = new Audio(path);
    audio.volume = volume / 100;

    setPlaying(true);
    await audio?.play();

    timeout = setTimeout(() => {
      audio.pause();
      setPlaying(false);
    }, 10000);

    useEffect(() => {
      return () => {
        clearTimeout(timeout);
      };
    }, [timeout]);
  };

  return (
    <div onClick={() => preview()} className="flex h-full justify-center items-center">
      <SvgIcon iconName={!playing ? 'play' : 'pause'} svgProp={{ className: cn('w-8 h-8') }} />
    </div>
  );
};

export default PreviewButton;
