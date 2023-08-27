import { Input } from '@/components/atoms/input';
import { Slider } from '@/components/atoms/slider';
import { useToast } from '@/hooks/useToast';
import { AGENTS } from '@/lib/config/agents';
import { useStore } from '@/lib/store';
import { Settings, settingsSchema } from '@/lib/validation';
import { Formik } from 'formik';
import { useEffect, useMemo } from 'react';
import { Button } from '../components/atoms/button';
import { Label } from '../components/atoms/label';
import Location from '../components/atoms/location';
import PreviewButton from '../components/atoms/preview-button';
import { RadioGroup, RadioGroupItem } from '../components/atoms/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/atoms/select';
import { Switch } from '../components/atoms/switch';
import VolumeLevel from '../components/atoms/volume-level';
import Layout from '../components/templates/layout';
import { useTheme } from '@/providers/theme-provider';
import { unstable_useBlocker as useBlocker } from 'react-router-dom';

const SettingsForm = () => {
  const { setPreviewTheme } = useTheme();

  useBlocker(() => {
    setPreviewTheme(undefined);
    return false;
  });

  const themeOptions = [
    {
      label: 'System',
      value: 'system'
    },
    {
      label: 'Light',
      value: 'light'
    },
    {
      label: 'Dark',
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
    location,
    applySettings,
    onboarding,
    setOnboarding,
    remindBefore
  } = useStore();

  const onSubmit = (values: Settings) => {
    applySettings(values);
    toast({
      title: 'Settings saved',
      description: 'Your settings have been saved successfully'
    });
    if (!onboarding) setOnboarding(true);
  };

  const initialValues = useMemo(
    () =>
      ({
        agent,
        theme,
        gamify,
        time: twentyFourHourTime,
        location,
        volume,
        remindBefore
      }) as Settings,
    [agent, twentyFourHourTime, volume]
  );

  useEffect(() => {
    if (!onboarding) {
      toast({
        title: 'Welcome to Athan Time',
        description: 'Please configure your location to get started'
      });
    }
  }, [onboarding]);

  return (
    <Layout>
      <div className="flex flex-row mr-20">
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={settingsSchema} enableReinitialize>
          {({ values, setFieldValue, handleSubmit, handleReset, errors, dirty }) => (
            <div className="flex flex-col flex-grow gap-8">
              <h1 className="text-[48px] font-semibold">Settings</h1>
              <h2 className="text-xl text-accent">Audio</h2>

              <div className="flex flex-row justify-between gap-4">
                <p>Volume</p>
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
                <p>
                  Choose your Muezzin (<span className="font-arabic">مُؤَذِّن</span>)
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
                <h2 className="text-xl text-accent">Theme</h2>

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
                <h2 className="text-xl text-accent">Time</h2>
                <div className="flex justify-start w-1/2 gap-2">
                  <p>AM/PM</p>
                  <Switch onCheckedChange={(value: boolean) => setFieldValue('time', value)} checked={values.time} />
                  <p>24H</p>
                </div>
              </div>

              <div className="flex flex-row justify-between gap-4">
                <h2 className="text-xl text-accent">Location</h2>
                <div className="flex justify-start w-1/2 gap-2">
                  <Location
                    value={values.location}
                    onValueChange={(value) => setFieldValue('location', value)}
                    errors={errors.location}
                  />
                </div>
              </div>

              <div className="flex flex-row justify-between gap-4">
                <h2 className="text-xl text-accent">Gamify Tasbih</h2>
                <div className="flex justify-start w-1/2 gap-2">
                  <Switch
                    onCheckedChange={(value: boolean) => setFieldValue('gamify', value)}
                    checked={values.gamify}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-xl text-accent">Reminder</h2>
                <div className="flex flex-row items-center justify-between gap-4">
                  <p>How long before the Athan, would you like to be reminded? </p>
                  <div className="flex flex-col justify-start w-1/2 gap-2">
                    <Input
                      type="number"
                      placeholder="Enter minutes"
                      value={values.remindBefore ?? 5}
                      onChange={(e) => setFieldValue('remindBefore', e.target.value)}
                      min={0}
                      max={59}
                    />
                    {errors.remindBefore && <p className="text-red-500">{errors.remindBefore}</p>}
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-end w-full gap-4">
                <div className="flex justify-start w-1/2 gap-2">
                  <Button variant={'default'} onClick={() => handleSubmit()} disabled={onboarding && !dirty}>
                    Save
                  </Button>
                  <Button variant={'link'} onClick={() => handleReset()}>
                    Cancel
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
