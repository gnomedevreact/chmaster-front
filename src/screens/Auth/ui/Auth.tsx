import React, { useState } from 'react';
import {
  AppState,
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { supabase } from '@/src/core/lib/supabase';
import { Container } from '@/src/widgets/Container';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { Input } from '@/src/shared/ui/Input';
import { Separator } from '@/src/shared/ui/Separator';
import { useForm } from 'react-hook-form';
import { useAuthMutations } from '@/src/shared/api/hooks/useAuthMutations';
import { toast } from '@/src/shared/lib/utils/toast';
import { Link, router } from 'expo-router';
import { AuthHelpers } from '@/src/shared/lib/helpers/auth.helpers';
import { GoogleSignInBtn } from '@/src/features/GoogleSignInBtn/GoogleSignInBtn';
import { useProfileStore } from '@/src/core/lib/store/profile.store';
import Purchases from 'react-native-purchases';
import { Button } from '@/src/shared/ui/Button';

interface FormProps {
  email: string;
  password: string;
}

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export const Auth = () => {
  const setProfile = useProfileStore((state) => state.setProfileData);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormProps>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { signUpMutation, isPending } = useAuthMutations();

  const [email, password] = watch(['email', 'password']);

  const isFormEmpty = email.length <= 0 || password.length <= 0;

  async function signInWithEmail(data: FormProps) {
    setLoading(true);
    const {
      error,
      data: { user },
    } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .single();

    const generalError = error || profileError;

    if (generalError) {
      toast({
        type: 'danger',
        message: generalError.message,
      });

      await AuthHelpers.logout(false);
    }

    if (!generalError) {
      try {
        await Purchases.logIn(profileData.id);
        setProfile(profileData);
      } catch (error) {
        console.error(error);
      }

      router.replace('/(tabs)');
    }
    setLoading(false);
  }

  async function signUpWithEmail(data: FormProps) {
    signUpMutation(data);
  }

  return (
    <Container className={'pt-5'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
        <View className={'flex-1 flex flex-col gap-4'}>
          <View className={'flex flex-col gap-4 mb-6'}>
            <TextStyled className={'text-[28px] font-medium text-primary-white'}>
              {!isAuth ? 'Sign Up' : 'Sign In'}
            </TextStyled>
            <Input
              label={'E-mail'}
              control={control}
              name={'email'}
              keyboardType={'email-address'}
              rules={{
                pattern:
                  /^(?!.*\.\.)[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/,
              }}
            />
            <Input
              label={'Password'}
              control={control}
              name={'password'}
              secure={true}
              rules={{
                minLength: 6,
              }}
            />
          </View>
          <View className={'flex flex-col gap-8'}>
            <View className={'flex flex-col gap-6'}>
              <Button
                isLoading={isPending || loading}
                disabled={
                  !!(errors.email || errors.password) ||
                  isFormEmpty ||
                  isPending ||
                  loading
                }
                onPress={
                  isAuth ? handleSubmit(signInWithEmail) : handleSubmit(signUpWithEmail)
                }
              >
                <TextStyled className={'text-base'}>Continue</TextStyled>
              </Button>
              <Pressable onPress={() => setIsAuth(!isAuth)}>
                <TextStyled
                  className={
                    'text-lg font-medium text-primary-white self-center opacity-80'
                  }
                >
                  {isAuth ? 'Sign Up' : 'Sign In'}
                </TextStyled>
              </Pressable>
            </View>
            <Separator />
            <GoogleSignInBtn />
            <View className={'mt-auto'}>
              <TextStyled className={'text-primary-600 self-center text-[8px]'}>
                By continuing, you agree to the{' '}
                <Link href={'https://chmaster-terms.vercel.app/'}>Terms of Use</Link> and{' '}
                <Link href={'https://chmaster-privacy.vercel.app/'}>Privacy Policy</Link>.
              </TextStyled>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
};
