import { Store } from '@tauri-apps/plugin-store';
import { StateStorage } from 'zustand/middleware';

const store = new Store('.settings.json');

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await store.get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await store.set(name, value);
    await store.save();
  },
  removeItem: async (name: string): Promise<void> => {
    await store.delete(name);
    await store.save();
  }
};

export default storage;
