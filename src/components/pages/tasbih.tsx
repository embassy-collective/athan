import { cn } from '@/lib/styles';
import { random } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import Layout from '../templates/layout';
// @ts-ignore
import { ReactComponent as Mouse } from '@/assets/icons/mouse.svg';
import { useStore } from '@/lib/store';
const BOX_SIZE = 224;

const Tasbih = () => {
  const playground = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: BOX_SIZE / 2, y: BOX_SIZE / 2 });
  const [counter, setCounter] = useState(0);

  const randomize = () => {
    setPosition({
      x: random(BOX_SIZE / 2, dimensions.width - BOX_SIZE / 2),
      y: random(BOX_SIZE / 2, dimensions.height - BOX_SIZE / 2)
    });
  };

  const onResize = () => {
    if (!playground.current) return;

    setDimensions({
      width: playground.current.offsetWidth,
      height: playground.current.offsetHeight
    });
    setPosition({
      x: playground.current.offsetWidth / 2,
      y: playground.current.offsetHeight / 2
    });
  };

  useEffect(() => {
    if (playground.current) {
      onResize();
    }
  }, [playground]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      onResize();
    });
    return () => {
      window.removeEventListener('resize', () => {
        onResize();
      });
    };
  }, []);

  const thresholds = {
    33: 'سبحان الله',
    66: 'الحمد لله',
    99: 'الله أكبر',
    100: `لا إله إلا الله وحده لا شريك له، له الملك،
    وله الحمد، وهو على كل شيء قدير`
  };

  const displayed = parseInt(Object.keys(thresholds).find((key) => counter < parseInt(key))!);

  const { gamify } = useStore();
  return (
    <Layout>
      <div className="flex flex-row mr-20 h-full">
        <div className="flex flex-col gap-8 flex-grow justify-center">
          <h1 className="text-[48px] text-accent font-semibold" onClick={() => randomize()}>
            Tasbih
          </h1>

          <h2 className="text-[64px] mx-auto font-arabic font-semibold text-center">
            {thresholds[displayed as keyof typeof thresholds]}
          </h2>

          <div
            className="w-full h-full relative"
            ref={playground}
            onClick={() => {
              setCounter(0);
            }}
          >
            <div
              className={cn(
                `border-4 border-accent h-56 w-56 absolute text-[128px] font-bold rounded-lg flex items-center justify-center cursor-pointer select-none`
              )}
              style={{
                top: position.y,
                left: position.x,
                transform: `translate(-50%, -50%)`
              }}
              onClick={(e) => {
                e.stopPropagation();
                setCounter(counter + 1);
                if (gamify && counter > 0 && counter % 11 === 0) {
                  randomize();
                }

                if (counter === 100) {
                  setCounter(0);
                }
              }}
            >
              {(counter % 33) + 1}
              {counter === 0 && <Mouse className={'w-12 h-12 absolute -bottom-32'} />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tasbih;
