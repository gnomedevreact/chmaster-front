import React from 'react';
import { Container } from '@/src/widgets/Container';
import { useGetProfile } from '@/src/shared/api/hooks/useGetProfile';
import { router } from 'expo-router';
import { Avatar } from '@/src/widgets/Avatar';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/src/shared/ui/Button';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { InfoBlock } from '@/src/widgets/InfoBlock';
import { Pressable, View } from 'react-native';
import { AuthHelpers } from '@/src/shared/lib/helpers/auth.helpers';
import { toast } from '@/src/shared/lib/utils/toast';
import { useGetProfileRank } from '@/src/shared/api/hooks/useGetProfileRank';
import { useProfileStore } from '@/src/core/lib/store/profile.store';
import { useQueryClient } from '@tanstack/react-query';

export const Profile = () => {
  const queryClient = useQueryClient();
  const profile = useProfileStore((state) => state.profileData);
  const { rank } = useGetProfileRank();
  useGetProfile();

  return (
    <Container
      className={'flex flex-col gap-4 pt-5 pb-4'}
      isRefresh
      onRefreshAction={() => queryClient.invalidateQueries({ queryKey: ['rank'] })}
    >
      <Avatar name={profile?.name || 'name'} />
      <InfoBlock className={'flex-row items-center justify-between max-h-[69px]'}>
        <View className={'flex flex-row items-center gap-2'}>
          <TextStyled fontFamilyName={'NunitoSansBold'} className={'text-[24px]'}>
            {`#${rank || '-'}`}
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
              {profile?.solved_puzzles || 0}
            </TextStyled>
            <TextStyled className={'text-lg text-primary-600'}>Solved puzzles</TextStyled>
          </InfoBlock>
          <InfoBlock>
            <TextStyled className={'text-[24px]'} fontFamilyName={'NunitoSansBold'}>
              {profile?.exp || 0}
            </TextStyled>
            <TextStyled className={'text-lg text-primary-600'}>EXP</TextStyled>
          </InfoBlock>
        </View>
        <View className={'flex flex-row items-center gap-3'}>
          <InfoBlock>
            <TextStyled className={'text-[24px]'} fontFamilyName={'NunitoSansBold'}>
              {profile?.streak || 0}
            </TextStyled>
            <TextStyled className={'text-lg text-primary-600'}>Streak</TextStyled>
          </InfoBlock>
          <InfoBlock>
            <TextStyled className={'text-[24px]'} fontFamilyName={'NunitoSansBold'}>
              {profile?.solved_tasks || 0}
            </TextStyled>
            <TextStyled className={'text-lg text-primary-600'}>Solved tasks</TextStyled>
          </InfoBlock>
        </View>
      </View>
      <Button
        onPress={async () => {
          try {
            await AuthHelpers.logout();
            router.replace('/auth');
          } catch (err) {
            toast({
              message: 'Something went wrong',
              type: 'danger',
            });
          }
        }}
        className={'mt-auto'}
      >
        <MaterialIcons name="logout" size={24} color="white" />
        <TextStyled className={'text-lg'}>Log out</TextStyled>
      </Button>
    </Container>
  );
};
