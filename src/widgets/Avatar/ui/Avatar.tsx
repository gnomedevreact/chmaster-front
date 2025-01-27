import React from 'react';
import { View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';

interface AvatarProps {
  name: string;
}

export const Avatar = (props: AvatarProps) => {
  const { name } = props;

  return (
    <View className={'flex flex-col gap-3 items-center justify-center pt-10'}>
      <View
        className={'flex items-center justify-center rounded-full bg-primary-200'}
        style={{ width: 150, height: 150 }}
      >
        <TextStyled className={'text-[62px]'}>
          {name.substring(0, 2).toUpperCase()}
        </TextStyled>
      </View>
      <TextStyled className={'text-[28px]'}>
        {name.substring(0, 1).toUpperCase() + name.substring(1)}
      </TextStyled>
    </View>
  );
};
