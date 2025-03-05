import { supabase } from '@/src/core/lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProfileStore } from '@/src/core/lib/store/profile.store';
import { storage } from '@/src/core/lib/store/storage';
import { router } from 'expo-router';
import { queryClientUtil } from '@/src/core/queryClient';

export const AuthHelpers = {
  async logout(replace: boolean = true) {
    const intro = storage.getBoolean('intro');
    if (replace) {
      router.replace('/auth');
    }
    await supabase.auth.signOut();
    await GoogleSignin.signOut();
    await AsyncStorage.clear();
    storage.clearAll();
    useProfileStore.getState().clearProfileData();
    queryClientUtil.clear();
    if (intro) {
      storage.set('intro', true);
    }
  },
};
