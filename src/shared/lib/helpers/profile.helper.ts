import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProfileHelper = {
  async getProfile() {
    try {
      const profile = await AsyncStorage.getItem('profile');

      if (profile) {
        return JSON.parse(profile);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
