import React from 'react';
import { Container } from '@/src/widgets/Container';
import { FocusBlock } from '@/src/screens/Home/ui/components/FocusBlock';
import { useProfileStore } from '@/src/core/lib/store/profile.store';

import { Header } from './components/Header';
import { useGetProfile } from '@/src/shared/api/hooks/useGetProfile';
import { useQueryClient } from '@tanstack/react-query';
import { LinkBlock } from '@/src/screens/Home/ui/components/LinkBlock';
import { View } from 'react-native';

export const Home = () => {
  const queryClient = useQueryClient();
  const profile = useProfileStore((state) => state.profileData);
  useGetProfile();

  if (!profile) {
    return null;
  }

  return (
    <Container
      className={'flex flex-col gap-5 pt-4'}
      isRefresh={true}
      onRefreshAction={() => queryClient.invalidateQueries({ queryKey: ['rank'] })}
    >
      <Header profile={profile} />
      <FocusBlock satisfied={profile?.streak_satisfied} />
      <View className={'flex flex-col items-center gap-3'}>
        <LinkBlock
          title={'Watch Tutorials'}
          text={
            'Explore a collection of expert-led chess training videos to sharpen your strategy, improve your tactics, and take your game to the next level.'
          }
          image={require('@/src/assets/images/test.webp')}
          link={'/videos'}
        />
        <LinkBlock
          title={'Watch Tutorials'}
          text={
            'Explore a collection of expert-led chess training videos to sharpen your strategy, improve your tactics, and take your game to the next level.'
          }
          image={require('@/src/assets/images/test2.webp')}
          link={'/videos'}
        />
      </View>
    </Container>
  );
};
