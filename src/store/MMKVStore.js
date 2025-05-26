import MMKVStorage from 'react-native-mmkv-storage';


const mmkv = new MMKVStorage.Loader().initialize();

export const setDataInMmkv = (key, value) => {
  const today = new Date().toISOString().split('T')[0]; // e.g. "2025-05-21"
  mmkv.setString(key, JSON.stringify({ value, date: today }));
};

export const getDataFromMmkv = (key) => {
  const raw = mmkv.getString(key);
  if (!raw) return null;

  const { value, date } = JSON.parse(raw);
  const today = new Date().toISOString().split('T')[0];

  if (date !== today) {
    mmkv.delete(key); // Invalidate
    return null;
  }

  return value;
};
