import React from 'react';
import { Divider } from 'react-native-paper';
import { View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';

export const Separator = () => {
  return (
    <View className={'w-full relative'}>
      <Divider />
      <View
        className={
          'p-2 bg-primary-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '
        }
      >
        <TextStyled className={'text-sm font-normal text-primary-white opacity-80'}>
          or
        </TextStyled>
      </View>
    </View>
  );
};
