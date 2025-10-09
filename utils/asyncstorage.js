import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.error(`❌ Error storing data for key "${key}":`, e);
    return false;
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`❌ Error reading data for key "${key}":`, e);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(`❌ Error removing data for key "${key}":`, e);
    return false;
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (e) {
    console.error("❌ Error clearing storage:", e);
    return false;
  }
};

export const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (e) {
    console.error("❌ Error getting all keys:", e);
    return [];
  }
};

export const multiSet = async (entries) => {
  try {
    const formattedEntries = entries.map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]);
    await AsyncStorage.multiSet(formattedEntries);
    return true;
  } catch (e) {
    console.error("❌ Error multiSet:", e);
    return false;
  }
};

export const multiGet = async (keys) => {
  try {
    const result = await AsyncStorage.multiGet(keys);
    const data = {};
    result.forEach(([key, value]) => {
      data[key] = value ? JSON.parse(value) : null;
    });
    return data;
  } catch (e) {
    console.error("❌ Error multiGet:", e);
    return {};
  }
};

export const multiRemove = async (keys) => {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (e) {
    console.error("❌ Error multiRemove:", e);
    return false;
  }
};
