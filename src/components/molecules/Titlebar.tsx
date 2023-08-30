import { appWindow } from '@tauri-apps/api/window';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cross1Icon, MinusIcon, SquareIcon, CopyIcon } from '@radix-ui/react-icons';
import { useInterval } from 'use-interval';

export function TitleBar() {
  const { t } = useTranslation();
  const [maximized, setMaximized] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useInterval(() => {
    appWindow.isMaximized().then(setMaximized);
    appWindow.isFullscreen().then(setFullscreen);
  }, 200);

  return (
    <>
      {!fullscreen && (
        <div
          data-tauri-drag-region
          className="h-8 bg-transparent flex justify-end fixed select-none top-0 w-full z-50 "
          id="titlebar"
        >
          <div>
            <div
              title={t('Minimize')}
              className={`duration-200 inline-flex justify-center items-center h-8 w-12 fill-[#D9D9D9] dark:fill-[#181818] hover:bg-foreground active:bg-foreground`}
              onClick={() => appWindow.minimize()}
            >
              <MinusIcon className="align-middle" />
            </div>
            {maximized ? (
              <div
                title={t('Restore Down')}
                className={`uration-200 inline-flex justify-center items-center h-8 w-12 fill-[#D9D9D9] dark:fill-[#181818] hover:bg-foreground active:bg-foreground`}
                onClick={() => appWindow.toggleMaximize()}
              >
                <CopyIcon className="align-middle" />
              </div>
            ) : (
              <div
                title={t('Maximize')}
                className={`uration-200 inline-flex justify-center items-center h-8 w-12 fill-[#D9D9D9] dark:fill-[#181818] hover:bg-foreground active:bg-foreground`}
                onClick={() => appWindow.toggleMaximize()}
              >
                <SquareIcon className="align-middle" />
              </div>
            )}
            <div
              title={t('Close')}
              className={`uration-200 inline-flex justify-center items-center h-8 w-12 fill-[#D9D9D9] dark:fill-[#181818] hover:bg-foreground active:bg-red-500`}
              onClick={() => appWindow.hide()}
            >
              <Cross1Icon className="align-middle" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
