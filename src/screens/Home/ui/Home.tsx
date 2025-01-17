import React from 'react';
import { Container } from '@/src/widgets/Container';
import { useGetProfile } from '@/src/shared/hooks/useGetProfile';

import { Header } from './components/Header';
import { FocusBlock } from '@/src/screens/Home/ui/components/FocusBlock';

export const Home = () => {
  const { profile } = useGetProfile();

  if (!profile) {
    return null;
  }

  return (
    <Container className={'flex flex-col gap-5 pt-4'}>
      <Header profile={profile} />
      <FocusBlock currentDay={profile?.current_day} />
    </Container>
  );
};
