import { cn } from '@/lib/styles';
import { useEffect, useRef, useState } from 'react';
import SvgIcon from './svg-icon';

const PreviewButton = ({ agent, volume }: { agent: string; volume: number }) => {
  const [playing, setPlaying] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const ref = useRef<HTMLAudioElement | null>(null);
  const path = `/audio/agents/${agent}.mp3`;

  const stop = () => {
    console.log('stop');
    ref.current?.pause();
    setPlaying(false);
    ref.current = null;
  };

  const preview = async () => {
    if (ref.current) {
      console.log('Already playing, stop');
      return stop();
    }

    ref.current = new Audio(path);
    ref.current.volume = volume / 100;

    console.log('play');
    setPlaying(true);
    await ref.current?.play();

    timeout.current = setTimeout(() => {
      stop();
    }, 30000);
  };

  useEffect(() => {
    return () => {
      console.log('unmount');
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  return (
    <div onClick={() => preview()} className="flex h-full justify-center items-center">
      <SvgIcon iconName={!playing ? 'play' : 'pause'} svgProp={{ className: cn('w-8 h-8') }} />
    </div>
  );
};

export default PreviewButton;
