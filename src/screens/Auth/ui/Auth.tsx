import React, { useState } from 'react';
import { Alert, AppState, View } from 'react-native';
import { supabase } from '@/src/core/lib/supabase';
import { Container } from '@/src/widgets/Container';
import { ButtonCustom } from '@/src/shared/ui/ButtonCustom';
import { TextStyled } from '@/src/shared/ui/TextStyled';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <Container>
      <View>
        <TextStyled className={'text-[36px] font-semibold text-primary-white'}>
          Chess Master
        </TextStyled>
      </View>
      <ButtonCustom text={'Continue'} isLight />
    </Container>
  );
};
