import React from 'react';
import { Container } from '@/src/widgets/Container';
import { FocusBlock } from '@/src/screens/Home/ui/components/FocusBlock';
import { useProfileStore } from '@/src/core/lib/store/profile.store';

import { Header } from './components/Header';
import { useGetProfile } from '@/src/shared/api/hooks/useGetProfile';
import { LinkBlock } from '@/src/screens/Home/ui/components/LinkBlock';
import { Pressable, View } from 'react-native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { handleLink } from '@/src/shared/lib/utils/handleLink';
import { ActivityIndicator } from 'react-native-paper';

export const Home = () => {
  const profile = useProfileStore((state) => state.profileData);
  useGetProfile();

  if (!profile) {
    return <ActivityIndicator color={'#FAFAFA'} />;
  }

  return (
    <Container className={'flex flex-col gap-5 py-4 pb-10'}>
      <Header profile={profile} />
      <FocusBlock satisfied={profile?.streak_satisfied} />
      <View className={'flex flex-row gap-3'}>
        <Pressable
          className={
            'flex items-center justify-center flex-1 bg-primary-200 h-[150px] rounded-[14px] border border-primary-300'
          }
          onPress={() => handleLink(true, '/feed')}
        >
          <Entypo name="chat" size={80} color="white" />
          <TextStyled className={'text-primary-600'} fontFamilyName={'NunitoSansBold'}>
            Threads
          </TextStyled>
        </Pressable>
        <Pressable
          className={
            'flex items-center justify-center flex-1 bg-primary-200 h-[150px] rounded-[14px] border border-primary-300'
          }
          onPress={() => handleLink(true, '/plan')}
        >
          <MaterialIcons name="task-alt" size={80} color="white" />
          <TextStyled className={'text-primary-600'} fontFamilyName={'NunitoSansBold'}>
            Pro plan
          </TextStyled>
        </Pressable>
      </View>
      <View className={'flex flex-col items-center gap-3'}>
        <LinkBlock
          title={'Watch Tutorials'}
          image={require('@/src/assets/images/test.webp')}
          link={'/videos'}
          subscription={true}
        />
        <LinkBlock
          title={'Find Your Chess Opening'}
          image={require('@/src/assets/images/test2.webp')}
          link={'/quiz'}
          subscription={true}
        />
      </View>
    </Container>
  );
};
