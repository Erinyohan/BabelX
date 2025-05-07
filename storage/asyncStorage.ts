import AsyncStorage from '@react-native-async-storage/async-storage';

// Save history or favorites
export const saveData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving data to AsyncStorage:", error);
  }
};

// Get history or favorites
export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error retrieving data from AsyncStorage:", error);
  }
};

// Delete data
export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing data from AsyncStorage:", error);
  }
};
