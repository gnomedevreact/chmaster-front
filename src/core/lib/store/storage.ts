import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'my-app-storage',
  encryptionKey: 'some_encryption_key',
});

export const mmkvStorage = {
  setItem: (key: string, value: any) => storage.set(key, value),
  getItem: (key: string) => storage.getString(key) ?? null,
  removeItem: (key: string) => storage.delete(key),
};
