import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from '@/src/core/lib/supabase';
import { toast } from '@/src/shared/lib/utils/toast';
import { useCreateProfileMutation } from '@/src/shared/api/hooks/ProfilesHooks/useCreateProfileMutation';

export function AppleAuthBtn() {
  const { createProfileMutation } = useCreateProfileMutation();

  if (Platform.OS === 'ios')
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
        cornerRadius={5}
        style={{ height: 54, borderRadius: 14 }}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            if (credential.identityToken) {
              const {
                error,
                data: { user },
              } = await supabase.auth.signInWithIdToken({
                provider: 'apple',
                token: credential.identityToken,
              });

              if (!error) {
                createProfileMutation({ userId: user?.id! });
              }
            } else {
              throw new Error('No identityToken.');
            }
          } catch (e: any) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
              toast({
                type: 'danger',
                message: e.message,
              });
            } else {
              toast({
                type: 'danger',
                message: e.message,
              });
            }
          }
        }}
      />
    );
}
