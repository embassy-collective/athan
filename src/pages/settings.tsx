import { Input } from '@/components/atoms/input';
import { Slider } from '@/components/atoms/slider';
import { useToast } from '@/hooks/useToast';
import { AGENTS } from '@/lib/config/agents';
import { useStore } from '@/lib/store';
import { Settings, settingsSchema } from '@/lib/validation';
import { useTheme } from '@/providers/theme-provider';
import { isPermissionGranted, requestPermission } from '@tauri-apps/api/notification';
import { Formik } from 'formik';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { unstable_useBlocker as useBlocker } from 'react-router-dom';
import { Button } from '../components/atoms/button';
import { Label } from '../components/atoms/label';
import LanguageSelector from '../components/atoms/language-selector';
import Location from '../components/atoms/location';
import PreviewButton from '../components/atoms/preview-button';
import { RadioGroup, RadioGroupItem } from '../components/atoms/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/atoms/select';
import { Switch } from '../components/atoms/switch';
import VolumeLevel from '../components/atoms/volume-level';
import Layout from '../components/templates/layout';
import '../assets/css/settings.css';

const SettingsForm = () => {
  const { setPreviewTheme } = useTheme();

  useBlocker(() => {
    setPreviewTheme(undefined);
    return false;
  });

  const { t, i18n } = useTranslation();
  const themeOptions = [
    {
      label: t('System'),
      value: 'system'
    },
    {
      label: t('Light'),
      value: 'light'
    },
    {
      label: t('Dark'),
      value: 'dark'
    }
  ];

  const { toast } = useToast();
  const {
    agent,
    gamify,
    theme,
    twentyFourHourTime,
    volume,
    language,
    location,
    applySettings,
    onboarding,
    setOnboarding,
    remindBefore
  } = useStore();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.body.dir = i18n.dir();
  };

  const onSubmit = (values: Settings) => {
    applySettings(values);
    toast({
      title: t('Settings saved'),
      description: t('Your settings have been saved successfully')
    });
    if (!onboarding) setOnboarding(true);
    changeLanguage(values.language);
  };

  const initialValues = useMemo(
    () =>
      ({
        agent,
        theme,
        gamify,
        time: twentyFourHourTime,
        language,
        location,
        volume,
        remindBefore
      }) as Settings,
    [agent, twentyFourHourTime, volume]
  );

  const checkPermissions = async () => {
    // Remove this later
    let permissionGranted = await isPermissionGranted();

    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
  };

  useEffect(() => {
    if (!onboarding) {
      toast({
        title: t('Welcome to Athan Time'),
        description: t('Please configure your location to get started')
      });
      checkPermissions();
    }
  }, [onboarding]);

  return (
    <Layout>
      <div className="flex flex-row mr-20">
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={settingsSchema} enableReinitialize>
          {({ values, setFieldValue, handleSubmit, handleReset, errors, dirty }) => (
            <div className="flex flex-col flex-grow gap-8">
              <h1 className="text-[48px] font-semibold  rtl:font-arabic">{t('Settings')}</h1>
              <h2 className="text-xl text-accent rtl:font-arabic">{t('Audio')}</h2>

              <div className="flex flex-row justify-between gap-4">
                <p className=" rtl:font-arabic">{t('Volume')}</p>
                <div className="flex w-1/2 gap-2">
                  <Slider
                    defaultValue={[values.volume]}
                    max={100}
                    step={1}
                    onValueChange={(value: number[]) => setFieldValue('volume', value?.[0])}
                  />
                  <VolumeLevel volume={values.volume} />
                </div>
              </div>

              <div className="flex flex-row justify-between gap-4">
                <p className=" rtl:font-arabic">
                  {t('Choose your Muezzin')} {i18n.language === 'en' && <span className="font-arabic">(مُؤَذِّن)</span>}
                </p>
                <div className="flex w-1/2 gap-2">
                  <Select value={values.agent} onValueChange={(value: string) => setFieldValue('agent', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="..." />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENTS.map((agent) => (
                        <SelectItem value={agent.value} key={agent.value}>
                          {agent.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <PreviewButton agent={values.agent} volume={values.volume} />
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4">
                <h2 className="text-xl text-accent rtl:font-arabic">{t('Theme')}</h2>

                <div className="flex justify-start w-1/2">
                  <RadioGroup
                    className="flex-row gap-4"
                    value={values.theme}
                    onValueChange={(value: string) => setFieldValue('theme', value)}
                  >
                    {themeOptions.map((option) => (
                      <div className="flex items-center space-x-2" key={option.value}>
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          onClick={() => {
                            setPreviewTheme(option.value as Settings['theme'] | undefined);
                          }}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              <div className="flex flex-row justify-between gap-4">
                <h2 className="text-xl text-accent rtl:font-arabic">{t('Language')}</h2>
                <div className="flex justify-start w-1/2 gap-2">
                  <LanguageSelector
                    value={values.language}
                    onValueChange={(value) => setFieldValue('language', value)}
                  />
                </div>
              </div>

              <div className="flex flex-row justify-between gap-4">
                <h2 className="text-xl text-accent rtl:font-arabic">{t('Time')}</h2>
                <div className="flex justify-start w-1/2 gap-2">
                  <p>AM/PM</p>
                  <Switch onCheckedChange={(value: boolean) => setFieldValue('time', value)} checked={values.time} />
                  <p>24H</p>
                </div>
              </div>

              <div className="flex flex-row justify-between gap-4">
                <h2 className="text-xl text-accent rtl:font-arabic">{t('Location')}</h2>
                <div className="flex justify-start w-1/2 gap-2">
                  <Location
                    value={values.location}
                    onValueChange={(value) => setFieldValue('location', value)}
                    errors={errors.location}
                  />
                </div>
              </div>

              <div className="flex flex-row justify-between gap-4">
                <h2 className="text-xl text-accent rtl:font-arabic">{t('Gamify Tasbih')}</h2>
                <div className="flex justify-start w-1/2 gap-2">
                  <Switch
                    onCheckedChange={(value: boolean) => setFieldValue('gamify', value)}
                    checked={values.gamify}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-xl text-accent rtl:font-arabic">{t('Reminder')}</h2>
                <div className="flex flex-row items-center justify-between gap-4">
                  <p className=" rtl:font-arabic">{t('How long before the Athan, would you like to be reminded?')}</p>
                  <div className="flex flex-col justify-start w-1/2 gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        className="w-24 text-xl font-bold"
                        placeholder="Enter minutes"
                        value={values.remindBefore ?? 5}
                        onChange={(e) => setFieldValue('remindBefore', e.target.value)}
                        min={0}
                        max={59}
                      />
                      <span className="font-arabic">{t('min')}</span>
                    </div>
                    {errors.remindBefore && <p className="text-red-500">{errors.remindBefore}</p>}
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-end w-full gap-4">
                <div className="flex justify-start w-1/2 gap-2">
                  <Button variant={'default'} onClick={() => handleSubmit()} disabled={onboarding && !dirty}>
                    {t('Save')}
                  </Button>
                  <Button variant={'link'} onClick={() => handleReset()}>
                    {t('Cancel')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default SettingsForm;
