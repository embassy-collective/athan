import { Slider } from '@/components/atoms/slider';
import { useToast } from '@/hooks/useToast';
import { AGENTS } from '@/lib/config/agents';
import { useStore } from '@/lib/store';
import { Settings, settingsSchema } from '@/lib/validation';
import { Formik } from 'formik';
import { useMemo } from 'react';
import { Button } from '../atoms/button';
import { Label } from '../atoms/label';
import Location from '../atoms/location';
import PreviewButton from '../atoms/preview-button';
import { RadioGroup, RadioGroupItem } from '../atoms/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../atoms/select';
import { Switch } from '../atoms/switch';
import VolumeLevel from '../atoms/volume-level';
import Layout from '../templates/layout';

const SettingsForm = () => {
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
  const state = useStore();
  const { agent, gamify, theme, twentyFourHourTime, volume, applySettings, onboarding, setOnboarding } = state;
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
        location: {
          coords: {
            latitude: 5.3698,
            longitude: 43.2965
          },
          city: 'Marseille',
          country: 'France'
        },
        volume
      }) as Settings,
    [agent, twentyFourHourTime, volume]
  );

  return (
    <Layout>
      <div className="flex flex-row mr-20">
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={settingsSchema} enableReinitialize>
          {({ values, setFieldValue, handleSubmit, handleReset, errors }) => (
            <div className="flex flex-col gap-8 flex-grow">
              <h1 className="text-[48px] font-semibold">Settings</h1>
              <h2 className="text-xl text-accent">Audio</h2>

              <div className="flex flex-row gap-4 justify-between">
                <p>Volume</p>
                <div className="flex gap-2 w-1/2">
                  <Slider
                    defaultValue={[values.volume]}
                    max={100}
                    step={1}
                    onValueChange={(value: number[]) => setFieldValue('volume', value?.[0])}
                  />
                  <VolumeLevel volume={values.volume} />
                </div>
              </div>

              <div className="flex flex-row gap-4 justify-between">
                <p>Choose your agent</p>
                <div className="flex gap-2 w-1/2">
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
              <div className="flex flex-row gap-4 justify-between">
                <h2 className="text-xl text-accent">Theme</h2>

                <div className="flex w-1/2 justify-start">
                  <RadioGroup
                    className="flex-row gap-4"
                    value={values.theme}
                    onValueChange={(value: string) => setFieldValue('theme', value)}
                  >
                    {themeOptions.map((option) => (
                      <div className="flex items-center space-x-2" key={option.value}>
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              <div className="flex flex-row gap-4 justify-between">
                <h2 className="text-xl text-accent">Time</h2>
                <div className="flex w-1/2 justify-start gap-2">
                  <p>AM/PM</p>
                  <Switch onCheckedChange={(value: boolean) => setFieldValue('time', value)} checked={values.time} />
                  <p>24H</p>
                </div>
              </div>

              <div className="flex flex-row gap-4 justify-between">
                <h2 className="text-xl text-accent">Location</h2>
                <div className="flex w-1/2 justify-start gap-2">
                  <Location
                    value={values.location}
                    onValueChange={(value) => setFieldValue('location', value)}
                    errors={errors.location}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4 justify-between">
                <h2 className="text-xl text-accent">Gamify Tasbih</h2>
                <div className="flex w-1/2 justify-start gap-2">
                  <Switch
                    onCheckedChange={(value: boolean) => setFieldValue('gamify', value)}
                    checked={values.gamify}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4 justify-end w-full">
                <div className="flex w-1/2 justify-start gap-2">
                  <Button onClick={() => handleSubmit()}>Save</Button>
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
