import { supabase } from '@/src/core/lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthHelpers = {
  async logout(): Promise<void> {
    await supabase.auth.signOut();
    await GoogleSignin.signOut();
    await AsyncStorage.clear();
  },
};
