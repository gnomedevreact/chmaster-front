import React from 'react';
import { Container } from '@/src/widgets/Container';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/shared/ui/Button';
import { router } from 'expo-router';
import { useGetTopProfiles } from '@/src/shared/api/hooks/ProfilesHooks/useGetTopProfiles';
import { Image, View } from 'react-native';
import { ProfileType } from '@/src/shared/model/types/profile.types';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { useQueryClient } from '@tanstack/react-query';

const ProfileBlock = ({ profile, index }: { profile: ProfileType; index: number }) => {
  return (
    <View
      className={
        'flex flex-row items-center justify-between gap-3 p-3 rounded-[14px] bg-primary-200'
      }
    >
      <View className={'flex flex-row items-center gap-3'}>
        <View
          className={
            'flex items-center justify-center w-14 h-14 rounded-full overflow-hidden bg-primary-500'
          }
        >
          {profile.avatar && (
            <Image source={{ uri: profile.avatar }} className={'w-14 h-14'} />
          )}
          {!profile.avatar && (
            <TextStyled>{profile.name.substring(0, 2).toUpperCase()}</TextStyled>
          )}
        </View>
        <View className={'flex flex-col'}>
          <TextStyled className={'text-base text-primary-600'}>{profile.name}</TextStyled>
          <TextStyled className={'text-base'}>{`${profile.exp} EXP`}</TextStyled>
          <TextStyled
            className={'text-base'}
          >{`${profile.solved_puzzles} solved puzzles`}</TextStyled>
        </View>
      </View>
      <TextStyled className={'text-lg text-primary-100'}>{`#${index}`}</TextStyled>
    </View>
  );
};

export const Top = () => {
  const queryClient = useQueryClient();
  const { topProfiles, isLoading } = useGetTopProfiles();

  if (isLoading) return null;

  return (
    <Container
      className={'py-4 flex flex-col gap-4'}
      isRefresh={true}
      onRefreshAction={() =>
        queryClient.invalidateQueries({ queryKey: ['top profiles'] })
      }
    >
      <View className={'flex flex-row items-center gap-4'}>
        <Button
          className={'w-[50px] h-[50px]'}
          isLight={false}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </Button>
        <TextStyled className={'text-[28px]'} fontFamilyName={'NunitoSansBold'}>
          Top 10 students
        </TextStyled>
      </View>
      <View className={'w-[60px] h-[3px] bg-primary-200 self-center'} />
      <View className={'flex flex-col gap-4'}>
        {topProfiles?.map((item, index) => (
          <ProfileBlock profile={item} index={index + 1} key={index} />
        ))}
      </View>
    </Container>
  );
};
