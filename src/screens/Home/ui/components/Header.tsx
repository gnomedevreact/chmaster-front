import React from 'react';
import { View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { ProfileType } from '@/src/shared/model/types/profile.types';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/src/shared/ui/Button';
import { router } from 'expo-router';

export const Header = ({ profile }: { profile: ProfileType }) => {
  return (
    <View className={'flex flex-row items-start justify-between'}>
      <View>
        <View className={'flex flex-row gap-2 items-center'}>
          <TextStyled className={'text-primary-white text-[28px]'}>{`Hello,`}</TextStyled>
          <TextStyled
            className={'text-[32px] text-primary-100 font-bold'}
            fontFamilyName={'NunitoSansBold'}
          >
            {profile?.name.toUpperCase()}
          </TextStyled>
        </View>
        <TextStyled className={'text-base opacity-50'}>
          Are you ready to improve your chess skills?
        </TextStyled>
      </View>
      <Button className={'size-16 self-end'} onPress={() => router.push('/intro')}>
        <Feather name="info" size={24} color="white" />
      </Button>
    </View>
  );
};
