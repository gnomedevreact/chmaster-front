import React from 'react';
import { Container } from '@/src/widgets/Container';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/shared/ui/Button';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { useGetVideoUrls } from '@/src/screens/Videos/hooks/useGetVideoUrls';
import { VideoBlock } from '@/src/screens/Videos/ui/components/VideoBlock';

export const Videos = () => {
  const { back } = useRouter();

  const { urls } = useGetVideoUrls();

  return (
    <Container className={'py-4 gap-4'}>
      <Button className={'w-[50px] h-[50px] mb-3'} isLight={false} onPress={() => back()}>
        <Ionicons name="arrow-back" size={20} color="white" />
      </Button>
      <View className={'flex flex-col gap-2 mb-10'}>
        <TextStyled className={'text-[28px]'} fontFamilyName={'NunitoSansBold'}>
          Chess Tutorial Videos
        </TextStyled>
        <TextStyled className={'text-lg text-primary-600'}>
          Explore a variety of chess tutorial videos, from beginner tips to advanced
          strategies, to help you improve your game.
        </TextStyled>
      </View>
      <View className={'flex flex-col gap-6'}>
        {urls?.map((item, i) => (
          <VideoBlock videoSource={item.signedUrl} path={item.path!} key={i} />
        ))}
      </View>
    </Container>
  );
};
