import { cn } from '@/lib/styles';
import { useEffect, useRef, useState } from 'react';
import SvgIcon from './svg-icon';

const PreviewButton = ({ agent, volume }: { agent: string; volume: number }) => {
  const [playing, setPlaying] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const ref = useRef<HTMLAudioElement | null>(null);
  const path = `/audio/agents/${agent}.mp3`;

  const preview = async () => {
    if (ref.current) {
      await ref.current.pause();
      setPlaying(false);
      return;
    }

    ref.current = new Audio(path);
    ref.current.volume = volume / 100;

    setPlaying(true);
    await ref.current?.play();

    timeout.current = setTimeout(() => {
      if (!ref.current) return;
      ref.current?.pause();
      setPlaying(false);
    }, 10000);
  };

  useEffect(() => {
    return () => {
      ref.current?.pause();
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [timeout]);

  return (
    <div onClick={() => preview()} className="flex h-full justify-center items-center">
      <SvgIcon iconName={!playing ? 'play' : 'pause'} svgProp={{ className: cn('w-8 h-8') }} />
    </div>
  );
};

export default PreviewButton;
