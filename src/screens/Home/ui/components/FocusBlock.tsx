import React from 'react';
import { Pressable, View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';

export const FocusBlock = ({ currentDay }: { currentDay: number }) => {
  return (
    <View
      className={
        'flex flex-row items-center justify-between p-4 bg-primary-200 rounded-[16px]'
      }
    >
      <View className={'flex gap-3'}>
        <TextStyled className={'text-[20px]'}>Stay focused today</TextStyled>
        <Pressable
          className={
            'flex items-center px-4 py-1 bg-primary-100 max-w-[150px] rounded-[14px]'
          }
        >
          <TextStyled className={'text-base'}>Check progress</TextStyled>
        </Pressable>
      </View>
      <View
        className={
          'flex items-center justify-center w-[52px] h-[52px] rounded-full bg-primary-300'
        }
      >
        <TextStyled className={'text-[22px]'}>{currentDay || 1}</TextStyled>
      </View>
    </View>
  );
};
