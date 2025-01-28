import React from 'react';
import { Container } from '@/src/widgets/Container';
import { FocusBlock } from '@/src/screens/Home/ui/components/FocusBlock';
import { useProfileStore } from '@/src/core/lib/store/profile.store';

import { Header } from './components/Header';

export const Home = () => {
  const profile = useProfileStore((state) => state.profileData);
  console.log(profile);
  if (!profile) {
    return null;
  }

  return (
    <Container className={'flex flex-col gap-5 pt-4'}>
      <Header profile={profile} />
      <FocusBlock satisfied={profile?.streak_satisfied} />
    </Container>
  );
};
