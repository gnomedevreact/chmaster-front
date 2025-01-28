import React from 'react';
import { Pressable, View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { cn } from '@/src/shared/lib/utils/cnUtils';

export const FocusBlock = ({ satisfied }: { satisfied: boolean }) => {
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
        className={cn(
          'flex items-center justify-center w-[52px] h-[52px] rounded-full opacity-80',
          {
            'bg-[#50C878]': satisfied,
            'bg-[#E34234]': !satisfied,
          },
        )}
      >
        {satisfied && <AntDesign name="check" size={24} color="white" />}
        {!satisfied && (
          <MaterialCommunityIcons name="skull-crossbones" size={24} color="white" />
        )}
      </View>
    </View>
  );
};
