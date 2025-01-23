import { View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { cn } from '@/src/shared/lib/utils/cnUtils';
import React from 'react';

export const Badge = ({ text1, text2 }: { text1: string; text2: string }) => {
  return (
    <View
      className={
        'flex flex-row items-center justify-center self-start p-2 bg-primary-200 rounded opacity-80'
      }
    >
      <TextStyled className={'text-lg mr-2'}>{text1}</TextStyled>
      <TextStyled className={cn('text-lg text-primary-100')}>{text2}</TextStyled>
    </View>
  );
};
