import { createStyles, Menu, Text, UnstyledButton } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscChromeClose, VscChromeMaximize, VscChromeMinimize, VscChromeRestore } from 'react-icons/vsc';

export function TitleBar() {
  const { t } = useTranslation();
  const { classes } = getTitleBarStyles();
  const [maximized, setMaximized] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [windowTitle, setWindowTitle] = useState('');

  const tauriInterval = useInterval(() => {
    appWindow.isMaximized().then(setMaximized);
    appWindow.isFullscreen().then(setFullscreen);
    appWindow.title().then((title) => {
      if (windowTitle !== title) setWindowTitle(title);
    });
  }, 200);

  useEffect(() => {
    tauriInterval.start();
    return tauriInterval.stop;
  }, []);

  return (
    <>
      {!fullscreen && (
        <div data-tauri-drag-region className={classes.titlebar} id="titlebar">
          <div>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton style={{ cursor: 'default' }}></UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => appWindow.minimize()} icon={<VscChromeMinimize size={14} />}>
                  {t('Minimize')}
                </Menu.Item>
                {maximized ? (
                  <Menu.Item onClick={() => appWindow.toggleMaximize()} icon={<VscChromeRestore size={14} />}>
                    {t('Restore Down')}
                  </Menu.Item>
                ) : (
                  <Menu.Item onClick={() => appWindow.toggleMaximize()} icon={<VscChromeMaximize size={14} />}>
                    {t('Maximize')}
                  </Menu.Item>
                )}
                <Menu.Divider />
                <Menu.Item
                  onClick={() => appWindow.hide()}
                  icon={<VscChromeClose size={14} />}
                  rightSection={
                    <Text weight="bold" size="xs">
                      Alt + F4
                    </Text>
                  }
                >
                  {t('Close')}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>

          <div>
            <div
              title={t('Minimize')}
              className={`${classes.titlebarButton} hover:bg-foreground active:bg-foreground`}
              onClick={() => appWindow.minimize()}
            >
              <VscChromeMinimize className={classes.verticalAlign} />
            </div>
            {maximized ? (
              <div
                title={t('Restore Down')}
                className={`${classes.titlebarButton} hover:bg-foreground active:bg-foreground`}
                onClick={() => appWindow.toggleMaximize()}
              >
                <VscChromeRestore className={classes.verticalAlign} />
              </div>
            ) : (
              <div
                title={t('Maximize')}
                className={`${classes.titlebarButton} hover:bg-foreground active:bg-foreground`}
                onClick={() => appWindow.toggleMaximize()}
              >
                <VscChromeMaximize className={classes.verticalAlign} />
              </div>
            )}
            <div
              title={t('Close')}
              className={`${classes.titlebarButton} hover:bg-foreground active:bg-red-500`}
              onClick={() => appWindow.hide()}
            >
              <VscChromeClose className={classes.verticalAlign} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const getTitleBarStyles = createStyles((theme) => ({
  verticalAlign: {
    verticalAlign: 'middle'
  },
  titlebar: {
    height: 30,
    background: theme.colorScheme === 'dark' ? 'white' : '0 0% 6%',
    // background: (theme.colorScheme === 'dark') ? theme.colors.dark[7] : 'white',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'fixed',
    userSelect: 'none',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    '>div:nth-of-type(2)': {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  },
  titlebarButton: {
    transitionDuration: '200ms',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    '>svg': { fill: theme.colorScheme === 'dark' ? 'white' : '0 0% 6%' },
    width: 47,
    height: 30
  }
}));
