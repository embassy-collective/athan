import { ReactComponent as PauseIcon } from '@/assets/icons/pause.svg';
import { ReactComponent as PlayIcon } from '@/assets/icons/play.svg';
import { cn } from '@/lib/styles';
import { useEffect, useRef, useState } from 'react';
const PreviewButton = ({ agent, volume }: { agent: string; volume: number }) => {
  const [playing, setPlaying] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const ref = useRef<HTMLAudioElement | null>(null);
  const path = `/audio/agents/${agent}.mp3`;

  const stop = () => {
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

    setPlaying(true);
    await ref.current?.play();

    timeout.current = setTimeout(() => {
      stop();
    }, 30000);
  };

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  return (
    <div onClick={() => preview()} className="flex items-center justify-center h-full">
      {playing ? <PauseIcon className={cn('w-8 h-8')} /> : <PlayIcon className={cn('w-8 h-8')} />}
    </div>
  );
};

export default PreviewButton;
