import { InferType, boolean, number, object, string } from 'yup';

export const settingsSchema = object({
  volume: number().min(0).max(100).required(),
  agent: string().required(),
  theme: string().oneOf(['light', 'dark', 'system']).required(),
  time: boolean().required(), // True = 24h, False = 12h
  location: object({
    coords: object({
      latitude: number().required(),
      longitude: number().required()
    }),
    city: string().required(),
    country: string().required()
  })
});

export type Settings = InferType<typeof settingsSchema>;
