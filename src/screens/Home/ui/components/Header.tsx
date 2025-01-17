import React from 'react';
import { View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { ProfileType } from '@/src/shared/model/types/profile.types';
import { FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export const Header = ({ profile }: { profile: ProfileType }) => {
  return (
    <View className={'flex flex-row items-center justify-between'}>
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
        <TextStyled className={'text-base opacity-50 max-w-[270px]'}>
          Are you ready to improve your chess skills?
        </TextStyled>
      </View>
      <View className={'max-w-[56px]'}>
        <FAB
          icon={() => <MaterialIcons name="info-outline" size={24} color="white" />}
          size={'medium'}
          style={{ backgroundColor: '#DA0C81' }}
          onPress={() => console.log('Pressed')}
        />
      </View>
    </View>
  );
};
