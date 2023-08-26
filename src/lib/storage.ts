import { Store } from '@tauri-apps/plugin-store';
import { StateStorage } from 'zustand/middleware';

const store = new Store('.settings.json');

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, 'has been retrieved');
    return (await store.get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, 'with value', value, 'has been saved');
    await store.set(name, value);
    await store.save();
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, 'has been deleted');
    await store.delete(name);
    await store.save();
  }
};

export default storage;
