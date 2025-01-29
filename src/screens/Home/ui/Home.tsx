import React from 'react';
import { Container } from '@/src/widgets/Container';
import { FocusBlock } from '@/src/screens/Home/ui/components/FocusBlock';
import { useProfileStore } from '@/src/core/lib/store/profile.store';

import { Header } from './components/Header';
import { useGetProfile } from '@/src/shared/api/hooks/useGetProfile';
import { useQueryClient } from '@tanstack/react-query';

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
    </Container>
  );
};
