import React from 'react';
import { Container } from '@/src/widgets/Container';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/shared/ui/Button';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';

export const Videos = () => {
  const { back } = useRouter();

  // const videoSource =
  //   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  //
  // const player = useVideoPlayer(videoSource, (player) => {
  //   player.loop = true;
  //   player.play();
  // });

  return (
    <Container className={'py-4 gap-4'}>
      <Button className={'w-[50px] h-[50px] mb-3'} isLight={false} onPress={() => back}>
        <Ionicons name="arrow-back" size={20} color="white" />
      </Button>
      <View className={'flex flex-col gap-2'}>
        <TextStyled className={'text-[28px]'} fontFamilyName={'NunitoSansBold'}>
          Chess Tutorial Videos
        </TextStyled>
        <TextStyled className={'text-base text-primary-600'}>
          Explore a variety of chess tutorial videos, from beginner tips to advanced
          strategies, to help you improve your game.
        </TextStyled>
      </View>
      {/*<VideoView player={player} allowsFullscreen allowsPictureInPicture />*/}
    </Container>
  );
};
