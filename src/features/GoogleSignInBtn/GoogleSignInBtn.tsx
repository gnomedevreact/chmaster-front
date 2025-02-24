// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Pressable, StyleSheet } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { useState } from 'react';

import GoogleIcon from '../../assets/images/googleIcon.svg';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { supabase } from '@/src/core/lib/supabase';
import { toast } from '@/src/shared/lib/utils/toast';
import { useAuthMutations } from '@/src/shared/api/hooks/useAuthMutations';

export function GoogleSignInBtn() {
  const [isPressed, setIsPressed] = useState(false);

  const { createProfileMutation } = useAuthMutations();

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
  });

  return (
    <Pressable
      className={
        'w-full flex flex-row items-center justify-center gap-2.5 p-4 rounded-[14px] border border-primary-500 bg-transparent'
      }
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[styles.button, isPressed && styles.buttonPressed]}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          if (userInfo?.data?.idToken) {
            const {
              data: { user },
              error,
            } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: userInfo.data.idToken,
            });

            if (!error) {
              createProfileMutation({ userId: user?.id! });
            }
          } else {
            throw new Error('no ID token present!');
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          } else if (error.code === statusCodes.IN_PROGRESS) {
            toast({
              type: 'danger',
              message: error.message,
            });
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            toast({
              type: 'danger',
              message: error.message,
            });
          } else {
            toast({
              type: 'danger',
              message: error.message,
            });
          }
        }
      }}
    >
      <GoogleIcon />
      <TextStyled className={'text-sm font-medium text-primary-white'}>
        Continue with Google
      </TextStyled>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 14,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
});
