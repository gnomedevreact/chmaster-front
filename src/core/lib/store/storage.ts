import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'profile-storage',
  encryptionKey: '9ufjejf2349jdqk3i945849jd9qu9384dj2387',
});

export const mmkvStorage = {
  setItem: (key: string, value: any) => storage.set(key, value),
  getItem: (key: string) => storage.getString(key) ?? null,
  removeItem: (key: string) => storage.delete(key),
};
