import React from 'react';
import { Container } from '@/src/widgets/Container';
import { View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { useGetVideoUrls } from '@/src/screens/Videos/hooks/useGetVideoUrls';
import { VideoBlock } from '@/src/screens/Videos/ui/components/VideoBlock';
import { BackButton } from '@/src/shared/ui/BackButton';

export const Videos = () => {
  const { urls } = useGetVideoUrls();

  return (
    <Container className={'py-4 gap-4'}>
      <BackButton />
      <View className={'flex flex-col gap-2 mb-10'}>
        <TextStyled className={'text-[28px]'} fontFamilyName={'NunitoSansBold'}>
          Chess Tutorial Videos
        </TextStyled>
        <TextStyled className={'text-lg text-primary-600'}>
          Explore a variety of chess tutorial videos, from beginner tips to advanced
          strategies, to help you improve your game.
        </TextStyled>
        <TextStyled className={'text-sm text-primary-500'}>
          (New Videos Coming Soon)
        </TextStyled>
      </View>
      <View className={'flex flex-col gap-6'}>
        {urls?.map((item, i) => (
          <VideoBlock videoSource={item.signedUrl} path={item.path!} index={i} key={i} />
        ))}
      </View>
    </Container>
  );
};
