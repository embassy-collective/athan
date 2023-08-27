import { InferType, boolean, number, object, string } from 'yup';

export const settingsSchema = object({
  volume: number().min(0).max(100).required(),
  agent: string().required(),
  theme: string().oneOf(['light', 'dark', 'system']).required(),
  time: boolean().required(), // True = 24h, False = 12h
  gamify: boolean().default(false),
  language: string().default('en'),
  location: object({
    coords: object({
      latitude: number().required(),
      longitude: number().required()
    }),
    city: string().required(),
    country: string().required()
  }),
  remindBefore: number().min(0).max(59).default(5)
});

export type Settings = InferType<typeof settingsSchema>;
