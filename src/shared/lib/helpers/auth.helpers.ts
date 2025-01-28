import { supabase } from '@/src/core/lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProfileStore } from '@/src/core/lib/store/profile.store';
import { storage } from '@/src/core/lib/store/storage';

export const AuthHelpers = {
  async logout() {
    await supabase.auth.signOut();
    await GoogleSignin.signOut();
    await AsyncStorage.clear();
    useProfileStore.getState().clearProfileData();
    storage.clearAll();
  },
};
