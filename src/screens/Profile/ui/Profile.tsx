import React from 'react';
import { Container } from '@/src/widgets/Container';
import { useGetProfile } from '@/src/shared/api/hooks/useGetProfile';
import { supabase } from '@/src/core/lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useGetProfileFromStorage } from '@/src/shared/hooks/useGetProfileFromStorage';
import { Avatar } from '@/src/widgets/Avatar';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/src/shared/ui/Button';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { InfoBlock } from '@/src/widgets/InfoBlock';
import { Pressable, View } from 'react-native';

export const Profile = () => {
  const { profile } = useGetProfileFromStorage();
  useGetProfile();

  return (
    <Container className={'flex flex-col gap-4 pt-5 pb-4'}>
      <Avatar name={profile?.name || 'name'} />
      <InfoBlock className={'flex-row items-center justify-between max-h-[69px]'}>
        <View className={'flex flex-row items-center gap-2'}>
          <TextStyled fontFamilyName={'NunitoSansBold'} className={'text-[24px]'}>
            #3000
          </TextStyled>
          <TextStyled className={'text-lg text-primary-600'}>world rating</TextStyled>
        </View>
        <Pressable className={'p-3 bg-primary-100 rounded-[14px]'}>
          <Feather name="external-link" size={24} color="white" />
        </Pressable>
      </InfoBlock>
      <View className={'w-[60px] h-[3px] bg-primary-200 self-center'} />
      <View className={'flex flex-col gap-3'}>
        <View className={'flex flex-row items-center gap-3'}>
          <InfoBlock>
            <TextStyled className={'text-[24px]'} fontFamilyName={'NunitoSansBold'}>
              169
            </TextStyled>
            <TextStyled className={'text-lg text-primary-600'}>Solved puzzles</TextStyled>
          </InfoBlock>
          <InfoBlock>
            <TextStyled className={'text-[24px]'} fontFamilyName={'NunitoSansBold'}>
              +169
            </TextStyled>
            <TextStyled className={'text-lg text-primary-600'}>EXP</TextStyled>
          </InfoBlock>
        </View>
        <View className={'flex flex-row items-center gap-3'}>
          <InfoBlock>
            <TextStyled className={'text-[24px]'} fontFamilyName={'NunitoSansBold'}>
              28
            </TextStyled>
            <TextStyled className={'text-lg text-primary-600'}>Longest streak</TextStyled>
          </InfoBlock>
          <InfoBlock>
            <TextStyled className={'text-[24px]'} fontFamilyName={'NunitoSansBold'}>
              12
            </TextStyled>
            <TextStyled className={'text-lg text-primary-600'}>Solved tasks</TextStyled>
          </InfoBlock>
        </View>
      </View>
      <Button
        onPress={async () => {
          await supabase.auth.signOut();
          await GoogleSignin.signOut();
          router.replace('/auth');
        }}
        className={'mt-auto'}
      >
        <MaterialIcons name="logout" size={24} color="white" />
        <TextStyled className={'text-lg'}>Log out</TextStyled>
      </Button>
    </Container>
  );
};
